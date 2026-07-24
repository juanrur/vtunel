/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn("OAuth providers not configured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set")
    console.log('client id', process.env.GITHUB_CLIENT_ID)
    console.log('client secret', process.env.GITHUB_CLIENT_SECRET)
    return
  }

  const users = app.findCollectionByNameOrId("_pb_users_auth_")

  users.oauth2.enabled = true
  users.oauth2.providers = [
    {
      pkce: null,
      name: "github",
      clientId: clientId,
      clientSecret: clientSecret,
      authUrl: "",
      tokenUrl: "",
      userApiUrl: "",
      displayName: "GitHub",
    }
  ]

  app.save(users)
  console.log("GitHub OAuth provider configured successfully")
}, (app) => {
  const users = app.findCollectionByNameOrId("_pb_users_auth_")

  users.oauth2.enabled = false
  users.oauth2.providers = []

  app.save(users)
})
