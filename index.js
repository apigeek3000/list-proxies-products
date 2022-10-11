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
app.get('/', (req, res) => {
  console.log('Starting Job');

  // First get environment variables
  const options = {
    org : process.env.org,
    user: process.env.username,
    password: process.env.password,
    token: process.env.token,
    apigeex: true
  };

  // 

  // Connect to Apigee
  const org = apigee.connect(options).then ( org => {
    console.log(`Connected to org`);
    // First list all API Proxies in environment

    // Then list all API Products and their associated API Proxies

    // Map product data to full list of API Proxies

    // Return data
    org.get().then(data => {
      res.send(data);
    }).catch((err) => {
      console.error(err);
      res.send("Unable to list API proxies and products");
    });
  }).catch((err) => {
    console.error(err);
    res.send("Unable to list API proxies and products");
  });
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});