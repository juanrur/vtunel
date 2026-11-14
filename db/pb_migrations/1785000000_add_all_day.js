/// <reference path="../pb_data/types.d.ts" />
// Needed to store whether an event or task lasts the whole day (no hour).
// all_day items are saved from 00:00 of the first day to 23:59 of the last day.
migrate((app) => {
  for (const name of ['pbc_events', 'pbc_tasks']) {
    const collection = app.findCollectionByNameOrId(name)

    collection.fields.add(new Field({
      "hidden": false,
      "id": `bool_${name}_all_day`,
      "name": "all_day",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "bool"
    }))

    app.save(collection)
  }
}, (app) => {
  for (const name of ['pbc_events', 'pbc_tasks']) {
    const collection = app.findCollectionByNameOrId(name)
    collection.fields.removeByName('all_day')
    app.save(collection)
  }
})
