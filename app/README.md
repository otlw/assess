## How to test the frontend on your local testnet

1. Run ganache-cli with your metamask-addresses

> ganache-cli -m "your twelve seed words "

_Whenever you run ganache with your seedwords, assessments and concepts will be
deployed to the same address, so you can always navigate back to them_.

2. Deploy the contracts to your network

> truffle migrate --reset

3. Run the script to create local concepts and assessments

> node create2concepts2assessments.js 

3. Run the frontend to view and create assessments

> npm run dev

Open http://localhost:8080/ in your browser to see the app, where you can

- browse tabs to look for your assessments.
- click on an assessment address to see a detailed view of that assessment and interact with it.
- create more assessments by selecting a concept in the top component and using the "Create Assessment" button.

## How to test the frontend on the rinkeby-testnet

1. Switch your metamask browser extension to rinkeby

2. Deploy the contracts to rinkeby

> truffle migrate --network rinkeby

(be sure to put your seed words in a secret.js file and list initialMembers -
see [deployement instructions](https://gitlab.com/fathom/assess/#to-the-rinkeby-or-kovan-testnet) for details)

3. Run the frontend

> npm run dev

5. View and create assessments 

Open http://localhost:8080/ in your browser.

4. Create concepts and assessments

Like (3.) above or by running the script with the rinkeby-flag

> node create2concepts2assessments.js rinkeby
