/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const githubClientId = process.env.GITHUB_CLIENT_ID
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  const providers = []

  if (githubClientId && githubClientSecret) {
    providers.push({
      pkce: null,
      name: "github",
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      authUrl: "",
      tokenUrl: "",
      userApiUrl: "",
      displayName: "GitHub",
    })
  } else {
    console.warn("GitHub OAuth not configured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set")
  }

  if (googleClientId && googleClientSecret) {
    providers.push({
      pkce: null,
      name: "google",
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authUrl: "",
      tokenUrl: "",
      userApiUrl: "",
      displayName: "Google",
    })
  } else {
    console.warn("Google OAuth not configured: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set")
  }

  if (providers.length === 0) {
    console.warn("No OAuth providers configured, skipping")
    return
  }

  const users = app.findCollectionByNameOrId("_pb_users_auth_")

  users.oauth2.enabled = true
  users.oauth2.providers = providers

  app.save(users)
  console.log("OAuth providers configured successfully:", providers.map(p => p.name).join(", "))
}, (app) => {
  const users = app.findCollectionByNameOrId("_pb_users_auth_")

  users.oauth2.enabled = false
  users.oauth2.providers = []

  app.save(users)
})
