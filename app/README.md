## How to test the frontend on your local testnet

1. run ganache-cli with your metamask-addresses

> ganache-cli -m "your twelve seed words "

2. deploy the contracts to your network

> truffle migrate --reset

3. run the frontend

> npm run dev

4. run the script to create local concepts and assessments

> node create2concepts2assessments.js 

5. the dashboard should be running on http://localhost:8080/

- to create more assessments, select a concept in the top component and use the "Create Assessment" button
- browse tabs to look for your assessments
- click on an assessment address to see a detailed view of that assessment and interact with it

Whenever you run ganache with your seedwords, assessments & concepts will be
deployed to the same address, so you can always navigate back to it 

## How to test the frontend on Rinkeby


1. deploy the contracts to rinkeby

> truffle migrate --network rinkeby

(be sure to put your seed words in a secret.js file and list initialMembers - see deployement instructions)

2. switch your metamask browser extension to rinkeby

3. run the frontend

> npm run dev

4. run the script to create oncepts and assessments

> node create2concepts2assessments.js rinkeby

5. the dashboard should be running on http://localhost:8080/

- to create more assessments, select a concept in the top component and use the "Create Assessment" button
- browse tabs to look for your assessments
- click on an assessment address to see a detailed view of that assessment and interact with it