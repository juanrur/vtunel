/// <reference path="../pb_data/types.d.ts" />
// Public API: CRUD of every resource of RESOURCES (utils.js) for the owner of the X-API-Key header.
// /api/v1/keys (api_keys.pb.js) is more specific, so it wins over /api/v1/{resource}.

routerAdd('GET', '/api/v1/{resource}', (e) => {
  const { getResource, authenticateApiKey, toApi, parseRangeDate } = require(`${__hooks}/utils.js`)

  const resource = getResource(e)
  const userId = authenticateApiKey(e)

  const query = e.request.url.query()
  const from = query.get('from')
  const to = query.get('to')

  let filter = 'user_id = {:userId}'
  const params = { userId }

  if (from || to) {
    if (!resource.rangeFilter) throw new BadRequestError('This resource can\'t be filtered by dates')
    params.from = from ? parseRangeDate(from, 'from') : '0001-01-01 00:00:00.000Z'
    params.to = to ? parseRangeDate(to, 'to') : '9999-12-31 23:59:59.999Z'
    filter += ` && (${resource.rangeFilter})`
  }

  const records = $app.findRecordsByFilter(resource.collection, filter, 'created', 0, 0, params)

  return e.json(200, records.map(record => toApi(resource, record)))
})

routerAdd('GET', '/api/v1/{resource}/{id}', (e) => {
  const { getResource, authenticateApiKey, toApi, findOwnRecord } = require(`${__hooks}/utils.js`)

  const resource = getResource(e)
  const userId = authenticateApiKey(e)
  const record = findOwnRecord(resource, e.request.pathValue('id'), userId)

  return e.json(200, toApi(resource, record))
})

routerAdd('POST', '/api/v1/{resource}', (e) => {
  const { getResource, authenticateApiKey, toApi, applyBody, checkRequired, checkDateOrder, saveRecord } = require(`${__hooks}/utils.js`)

  const resource = getResource(e)
  const userId = authenticateApiKey(e)
  const body = Object.assign({}, resource.defaults || {}, e.requestInfo().body)

  checkRequired(resource, body)

  const record = new Record($app.findCollectionByNameOrId(resource.collection))
  applyBody(resource, record, body)
  // The owner always comes from the key, never from the body
  record.set('user_id', userId)
  checkDateOrder(resource, record)
  saveRecord(record)

  return e.json(201, toApi(resource, record))
})

routerAdd('PATCH', '/api/v1/{resource}/{id}', (e) => {
  const { getResource, authenticateApiKey, toApi, applyBody, checkDateOrder, findOwnRecord, saveRecord } = require(`${__hooks}/utils.js`)

  const resource = getResource(e)
  const userId = authenticateApiKey(e)
  const record = findOwnRecord(resource, e.request.pathValue('id'), userId)

  applyBody(resource, record, e.requestInfo().body)
  checkDateOrder(resource, record)
  saveRecord(record)

  return e.json(200, toApi(resource, record))
})

routerAdd('DELETE', '/api/v1/{resource}/{id}', (e) => {
  const { getResource, authenticateApiKey, findOwnRecord } = require(`${__hooks}/utils.js`)

  const resource = getResource(e)
  const userId = authenticateApiKey(e)
  const record = findOwnRecord(resource, e.request.pathValue('id'), userId)

  $app.delete(record)

  return e.noContent(204)
})
