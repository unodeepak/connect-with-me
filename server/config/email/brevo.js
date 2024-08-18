const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;

// Configure API key authorization
let apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

module.exports = Sib;
