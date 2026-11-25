// Helpers of the public API (/api/v1). Loaded with require(`${__hooks}/utils.js`) inside each
// handler, because PocketBase runs every handler isolated and they can't see outer variables.

// Resources exposed by the API. For each one: its collection, the fields the API accepts and
// returns (camelCase name → column and type), the fields required on create and the filter
// used by ?from=&to= (null if the resource has no dates). Optionally, defaults applied on create.
// Types: text, number, bool, date, json. To expose a new collection, add an entry here.
const RESOURCES = {
  events: {
    collection: 'events',
    fields: {
      name: { column: 'name', type: 'text' },
      startTime: { column: 'start_time', type: 'date' },
      endTime: { column: 'end_time', type: 'date' },
      allDay: { column: 'all_day', type: 'bool' },
      recurrenceType: { column: 'recurrence_type', type: 'text' },
      recurrenceInterval: { column: 'recurrence_interval', type: 'number' },
      recurrenceDays: { column: 'recurrence_days', type: 'json' },
      recurrenceEnd: { column: 'recurrence_end', type: 'date' },
      exceptionDates: { column: 'exception_dates', type: 'json' }
    },
    required: ['name', 'startTime', 'endTime'],
    // Same defaults as the app (pocketbase-events-repository.ts)
    defaults: { recurrenceType: 'none', recurrenceInterval: 1 },
    // Recurring events are always returned: their occurrences can fall inside any range
    rangeFilter: "((start_time <= {:to} && end_time >= {:from}) || (recurrence_type != '' && recurrence_type != 'none'))"
  },
  tasks: {
    collection: 'tasks',
    fields: {
      title: { column: 'title', type: 'text' },
      startTime: { column: 'start_time', type: 'date' },
      endTime: { column: 'end_time', type: 'date' },
      allDay: { column: 'all_day', type: 'bool' },
      done: { column: 'done', type: 'bool' }
    },
    required: ['title'],
    rangeFilter: "start_time != '' && start_time <= {:to} && end_time >= {:from}"
  },
  templates: {
    collection: 'templates',
    fields: {
      title: { column: 'title', type: 'text' },
      duration: { column: 'duration', type: 'number' }
    },
    required: ['title'],
    rangeFilter: null
  },
  routines: {
    collection: 'routines',
    fields: {
      name: { column: 'name', type: 'text' },
      weekdays: { column: 'weekdays', type: 'json' },
      startTime: { column: 'start_time', type: 'date' },
      endTime: { column: 'end_time', type: 'date' },
      repeatUntil: { column: 'repeat_until', type: 'date' }
    },
    required: ['name', 'weekdays', 'startTime', 'endTime'],
    rangeFilter: "start_time <= {:to} && (repeat_until = '' || repeat_until >= {:from})"
  }
}

// last_used_at is only saved if the previous value is older than this, to avoid a write per request
const LAST_USED_PRECISION_MS = 60 * 1000

function getResource (e) {
  const name = e.request.pathValue('resource')
  const resource = RESOURCES[name]
  if (!resource) throw new NotFoundError(`Unknown resource "${name}"`)
  return resource
}

// Returns the id of the owner of the X-API-Key header, or responds 401
function authenticateApiKey (e) {
  const key = e.request.header.get('X-API-Key')
  if (!key) throw new UnauthorizedError('Missing X-API-Key header')

  let apiKey
  try {
    apiKey = $app.findFirstRecordByData('api_keys', 'key_hash', $security.sha256(key))
  } catch (_) {
    throw new UnauthorizedError('Invalid API key')
  }

  const lastUsed = apiKey.getDateTime('last_used_at')
  if (lastUsed.isZero() || Date.now() - lastUsed.unix() * 1000 > LAST_USED_PRECISION_MS) {
    apiKey.set('last_used_at', new Date().toISOString())
    $app.saveNoValidate(apiKey)
  }

  return apiKey.getString('user_id')
}

// PocketBase dates are "2026-11-24 10:00:00.000Z"; the API uses ISO 8601
function dateToApi (dateTime) {
  return dateTime.isZero() ? null : dateTime.string().replace(' ', 'T')
}

function valueToApi (record, { column, type }) {
  switch (type) {
    case 'date': return dateToApi(record.getDateTime(column))
    case 'bool': return record.getBool(column)
    case 'number': return record.getFloat(column)
    case 'json': {
      const raw = record.getString(column)
      return raw ? JSON.parse(raw) : null
    }
    default: return record.getString(column)
  }
}

function toApi (resource, record) {
  const result = { id: record.id }
  for (const name in resource.fields) {
    result[name] = valueToApi(record, resource.fields[name])
  }
  result.created = dateToApi(record.getDateTime('created'))
  result.updated = dateToApi(record.getDateTime('updated'))
  return result
}

// Copies onto the record only the known fields present in the body. Unknown fields are ignored
function applyBody (resource, record, body) {
  for (const name in resource.fields) {
    if (body[name] === undefined) continue
    const { column, type } = resource.fields[name]
    let value = body[name]

    if (type === 'date' && value !== null && value !== '') {
      const date = new Date(value)
      if (isNaN(date.getTime())) throw new BadRequestError(`"${name}" must be an ISO 8601 date`)
      value = date.toISOString()
    }
    if (value === null && type !== 'json') value = ''

    record.set(column, value)
  }
}

function checkRequired (resource, body) {
  const missing = resource.required.filter(name => body[name] === undefined || body[name] === null || body[name] === '')
  if (missing.length > 0) throw new BadRequestError(`Missing required fields: ${missing.join(', ')}`)
}

function checkDateOrder (resource, record) {
  if (!resource.fields.startTime || !resource.fields.endTime) return
  const start = record.getDateTime('start_time')
  const end = record.getDateTime('end_time')
  if (!start.isZero() && !end.isZero() && end.unix() < start.unix()) {
    throw new BadRequestError('"endTime" must be after "startTime"')
  }
}

// Finds a record of the resource owned by the user. Responds 404 if it doesn't exist or isn't theirs
function findOwnRecord (resource, id, userId) {
  let record
  try {
    record = $app.findRecordById(resource.collection, id)
  } catch (_) {
    throw new NotFoundError('Not found')
  }
  if (record.getString('user_id') !== userId) throw new NotFoundError('Not found')
  return record
}

// Turns a ?from= / ?to= value into the format PocketBase uses to store dates
function parseRangeDate (value, name) {
  const date = new Date(value)
  if (isNaN(date.getTime())) throw new BadRequestError(`"${name}" must be an ISO 8601 date`)
  return date.toISOString().replace('T', ' ')
}

function saveRecord (record) {
  try {
    $app.save(record)
  } catch (err) {
    throw new BadRequestError(`Invalid data: ${err}`)
  }
}

module.exports = {
  RESOURCES,
  getResource,
  authenticateApiKey,
  dateToApi,
  toApi,
  applyBody,
  checkRequired,
  checkDateOrder,
  findOwnRecord,
  parseRangeDate,
  saveRecord
}
