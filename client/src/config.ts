// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5vpkehi3d9'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-tpqi4clb.auth0.com',            // Auth0 domain
  clientId: '2d0z2EDjBByLIQhG57x67JU5FwMi0rHk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
