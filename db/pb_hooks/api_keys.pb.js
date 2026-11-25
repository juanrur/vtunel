/// <reference path="../pb_data/types.d.ts" />
// Management of the API keys of the logged user (from the Vtunel UI, with the normal session token).
// The plain key is returned only once, when it is created; only its sha256 is stored.

routerAdd('GET', '/api/v1/keys', (e) => {
  const { dateToApi } = require(`${__hooks}/utils.js`)

  const records = $app.findRecordsByFilter('api_keys', 'user_id = {:userId}', '-created', 0, 0, { userId: e.auth.id })

  return e.json(200, records.map(record => ({
    id: record.id,
    name: record.getString('name'),
    prefix: record.getString('prefix'),
    created: dateToApi(record.getDateTime('created')),
    lastUsedAt: dateToApi(record.getDateTime('last_used_at'))
  })))
}, $apis.requireAuth('users'))

routerAdd('POST', '/api/v1/keys', (e) => {
  const { dateToApi } = require(`${__hooks}/utils.js`)

  const body = e.requestInfo().body
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) throw new BadRequestError('"name" is required')
  if (name.length > 100) throw new BadRequestError('"name" must have at most 100 characters')

  const key = `vt_${$security.randomString(40)}`

  const record = new Record($app.findCollectionByNameOrId('api_keys'))
  record.set('user_id', e.auth.id)
  record.set('name', name)
  record.set('key_hash', $security.sha256(key))
  record.set('prefix', key.slice(0, 11))
  $app.save(record)

  return e.json(201, {
    id: record.id,
    name,
    prefix: record.getString('prefix'),
    created: dateToApi(record.getDateTime('created')),
    lastUsedAt: null,
    key
  })
}, $apis.requireAuth('users'))

routerAdd('DELETE', '/api/v1/keys/{id}', (e) => {
  let record
  try {
    record = $app.findRecordById('api_keys', e.request.pathValue('id'))
  } catch (_) {
    throw new NotFoundError('Not found')
  }
  if (record.getString('user_id') !== e.auth.id) throw new NotFoundError('Not found')

  $app.delete(record)

  return e.noContent(204)
}, $apis.requireAuth('users'))
