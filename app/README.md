## How to test the frontend on your local testnet

1. run ganache-cli with your metamask-addresses

> ganache-cli -m "your twelve seeed words "

2. deploy the contracts to your network

> truffle migrate --reset

3. run the frontend

> npm run dev

4. run the script to create local assessments!

> node create2concepts2assessments.js 

5. navigate to the assessment-view

copy the assessment address from the scripts output and add it to the url below.
Like this:

http://localhost:8080/#/assessment/<assessmentAddress>

6. Bookmark that site!

Wheneever you run ganache with your seedwords, assessments & concepts will be
deployed to the same address, so you can always navigate back to it 


## How to test the frontend on a deployed version of the rinkeby-testnet

To interact with the latest version of the fathom-network that has been deployed to rinkeby, run 

> ./scripts/loadDeployment.sh

Similarly, if you have deployed a new version of the network, use the saving script to save it to the deployments-folder:

> ./scripts/saveDeployment.sh

By default both of these scripts act on the deployment saved in
'deployments/rinkeby'. If you want to save or load to/from another directory,
pass the name as a parameter.
