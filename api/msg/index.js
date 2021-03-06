const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const credentials = process.env.GCLOUD_CREDENTIALS ? JSON.parse(
  Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString()
) : null
const config = credentials ? {
  credentials
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