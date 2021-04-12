// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '2go4lhsvnl'
const region = 'eu-central-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-yk6uhsvx.eu.auth0.com',               // Auth0 domain
  clientId: 'uiH4i3hGiUvt69ggfA53Nn1Z0yaKO1hN',      // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
