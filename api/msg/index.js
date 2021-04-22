const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
console.log(process.env.GCLOUD_CREDENTIALS)
const creds = process.env.GCLOUD_CREDENTIALS ? JSON.parse(Buffer.from(process.env.GCLOUD_CREDENTIALS).toString('base64')) : null
console.log(creds)
const config = creds ? {
  credentials: {
    private_key: creds.private_key,
    client_email: creds.client_email
  }
} : {}

async function runSample(projectId = 'comparison-bot-lmck') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'hello',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  return result;
}

module.exports = async (req, res) => {

  let result = await runSample()

  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
    dialog: result
  })
}