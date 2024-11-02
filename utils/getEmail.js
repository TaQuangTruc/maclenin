const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { getLink, delay } = require("./helper");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "./auth/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "./auth/credentials.json");


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  console.log("Saving new token.");
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.web || keys.installed ;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function getConfirmationLink(auth, toEmail) {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    q: `from:@youth@vnuhcm.edu.vn to:${toEmail}`,
  });

  if (!res.data.messages) return null;
  const message = await gmail.users.messages.get({
    userId: "me",
    id: res.data.messages[0].id,
  });

  const body = message.data.payload.parts[1].body.data;
  // var htmlBody = (body.replace(/-/g, '+').replace(/_/g, '/'));
  var htmlBody = Buffer.from(
    body.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString();
  return getLink(htmlBody);
}

module.exports = {
  authorize,
  getConfirmationLink,
};


