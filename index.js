// Import libraries
const apigeejs = require('apigee-edge-js');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

// Initialize libraries
const app = express();
app.use(express.json());
const apigee = apigeejs.apigee;

app.get('/', async (req, res) => {
  console.log('Starting Job');

  // First get important variables
  const retObj = {proxyObj: {}, productObj: {}};
  const options = {
    org : process.env.org,
    token: process.env.token, // gcloud auth print-access-token
    apigeex: true
  };

  // Get products per proxy first
  try {
    // First connect to Apigee
    console.log("Starting on proxies");
    const org = await apigee.connect(options);

    // Next get a list of all API Proxies & map to proxyObj
    const proxies = await org.proxies.get();
    for (const proxy of proxies.proxies) {
      retObj.proxyObj[proxy.name] = [];
    }

    // Then get all API Products and map to the API proxies
    const products = await org.products.get({expand:true});
    for (const product of products.apiProduct) {
      const productName = product.name;

      // Get apis within
      for (const prodApi of product.operationGroup.operationConfigs) {
        const prodApiName = prodApi.apiSource;
        retObj.proxyObj[prodApiName].push(productName);
      }
    }
    console.log("Finished with proxies");
  } catch (e) {
    console.error(e);
    retObj.proxyObj = "Unable to retreive data";
  }

  // Next get proxies by product
  try {
    console.log("Starting on products");
    // Get a list of all API Products & map to productObj
    const axiosOptions = {
      headers: {
        Authorization: `Bearer ${options.token}`,
        Accept: `application/json`
      },
      params: {expand: true}
    }
    const products = await axios.get(`https://apigee.googleapis.com/v1/organizations/${options.org}/apiproducts`, axiosOptions);
    for (const product of products.data.apiProduct) {
      // Define products
      retObj.productObj[product.name] = [];

      // Get the proxies within each
      for (const proxy of product.operationGroup.operationConfigs) {
        const prodProxyName = proxy.apiSource;
        retObj.productObj[product.name].push(prodProxyName);
      }
    }
    
    console.log("Finished with products");
  } catch (e) {
    console.error(e);
    retObj.productObj = "Unable to retreive data";
  }

  console.log('Job complete');
  res.send(retObj);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});