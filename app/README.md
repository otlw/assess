## Design Process

We are using [figma](https://www.figma.com) to plan the new features of our app. Check out [this](https://www.figma.com/file/d7IBsgXcicMhsgVmMHLBCRBB/Fathom-App?node-id=63%3A48)
to see what the next iteration of our app should will look like (requires login!).


## How to test the frontend on your local testnet

1. Run ganache-cli with your metamask-addresses

> ganache-cli -m "your twelve seed words "

_Whenever you run ganache with your seedwords, assessments and concepts will be
deployed to the same address, so you can always navigate back to them_.

2. Deploy the contracts to your network

> truffle migrate --reset

3. Run the script to create local concepts and assessments

> node create2concepts2assessments.js 

4. Run the frontend to view and create assessments

> npm run dev

Open http://localhost:8080/ in your browser to see the app, where you can

- browse tabs to look for your assessments.
- click on an assessment address to see a detailed view of that assessment and interact with it.
- create more assessments by selecting a concept in the top component and using the "Create Assessment" button.

## How to test the frontend on a testnet

_For sake of readability, this section assume you want to use rinkeby. Support for other testnets is planned but not yet ready _

1. Switch your metamask browser extension to rinkeby

2. Let truffle know where to find the contracts  

You can do this in two different ways:

2.1 Use the latest version from the deployments folder

To interact with the latest version of the fathom-network that has been deployed
to the your testnet, run

> ./scripts/loadDeployment.sh rinkeby

This will replace the json-files in your local build folder with the artififacts from the deployments folder.

2.1 OR Deploy your own the contracts to rinkeby

> truffle migrate --network rinkeby

(be sure to put your seed words in a secret.js file and provide a list of initialMembers -
see [deployement instructions](https://gitlab.com/fathom/assess/#to-the-rinkeby-or-kovan-testnet) for more detailed instructions)

3. Run the frontend

> npm run dev

4. View and create assessments 

Open http://localhost:8080/ in your browser.

5. Create concepts and assessments

Like (3.) above or by running the script with the rinkeby-flag

## Saving your deployments

If you don't want to overwrite your local deployment files, use the saveDeployment.sh script to back them up to the deployments folder.
Optionally, you can also provide some text as a second argument that will be saved in a README.txt.
For example: 

> ./scripts/saveDeployment.sh myDeployments "testFeatureSet1 on kovan"

To restore them, you would use the 'loadDeployment'-script like this

> ./scripts/loadDeployment.sh myDeployments




