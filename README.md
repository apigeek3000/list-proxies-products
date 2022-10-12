# list-proxies-products
Use Apigee Managent APIs to list all products by proxies and all proxies by products

# Instructions
In this repo is a simple Node.js script that uses [Apigee X Management APIs](https://cloud.google.com/apigee/docs/reference) to list all the proxies within the org and the associated products for each as well as the products within the org and the associated proxies for each. For products by proxies I am using a popular NPM library, [apigee-edge-js](https://www.npmjs.com/package/apigee-edge-js). For proxies by products I am using the raw HTTPS Apigee X Management APIs.

To run the script, follow these steps:
1. [Download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to your computer
2. [Download and install the gcloud tool](https://cloud.google.com/sdk/docs/install) to your computer. Sign into the tool using the command `gcloud init`
3. [Clone this repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) and using your machine's command line terminal navigate to the appropriate folder
4. Using the gcloud tool, print your OAuth token using the following command `gcloud auth print-access-token`. Copy this value for the next step
5. Create a file called `.env` and within it write the following key value pairs
```
org=[YOUR_APIGEE_ORG]
token=[YOUR_GOOGLE_OAUTH_TOKEN]
```
6. From your terminal, run the command `npm i` to install the needed dependencies
7. From your terminal, run the command `npm start` to run the application
8. Finally, navigate to http://localhost:8080 to run the script and see the results.