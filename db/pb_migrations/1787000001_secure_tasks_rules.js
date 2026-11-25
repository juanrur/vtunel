/// <reference path="../pb_data/types.d.ts" />
// The tasks rules only checked that the user was logged in, so anyone could read or edit
// the tasks of another user. Now, like events and routines, only the owner can.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_tasks")

  collection.listRule = "@request.auth.id = user_id"
  collection.viewRule = "@request.auth.id = user_id"
  collection.updateRule = "@request.auth.id = user_id"
  collection.deleteRule = "@request.auth.id = user_id"

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_tasks")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\""
  collection.deleteRule = "@request.auth.id != \"\""

  return app.save(collection)
})
