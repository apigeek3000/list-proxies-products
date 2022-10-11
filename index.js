// Import libraries
const express = require('express');
const apigeejs = require('apigee-edge-js');
require('dotenv').config();

// Initialize libraries
const app = express();
app.use(express.json());
const apigee = apigeejs.apigee;

/**
  * A basic "hello world" type endpoint
*/
app.get('/', async (req, res) => {
  console.log('Starting Job');

  // First get important variables
  // Potential improvement is to bring in google-auth module
  // to print token on the fly
  const proxyObj = {};
  const options = {
    org : process.env.org,
    token: process.env.token, // gcloud auth print-access-token
    apigeex: true
  };

  try {
    // First connect to Apigee
    const org = await apigee.connect(options);

    // Next get a list of all API Proxies & map to proxyObj
    const proxies = await org.proxies.get();
    for (const proxy of proxies.proxies) {
      proxyObj[proxy.name] = [];
    }

    // Then get all API Products and map to the APIs
    const products = await org.products.get({expand:true});
    for (const product of products.apiProduct) {
      const productName = product.name;

      // Get apis within
      for (const prodApi of product.operationGroup.operationConfigs) {
        const prodApiName = prodApi.apiSource;
        proxyObj[prodApiName].push(productName);
      }
    }

    // Return data to client
    console.log('Job complete');
    res.send(proxyObj);
  } catch (e) {
    console.error(e);
    res.send('Error: Unable to retreive data');
  }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});