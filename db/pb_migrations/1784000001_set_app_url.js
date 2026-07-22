/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const settings = app.settings()
  settings.meta.appURL = 'http://localhost:8080'
  app.save(settings)
  console.log(`App URL configured: ${settings.meta.appURL}`)
})
