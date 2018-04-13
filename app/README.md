## How to test the frontend on your local testnet

1) run ganache-cli with your metamask-addresses

> ganache-cli -m "your twelve seeed words "

2) deploy the contracts to your network

> truffle migrate --reset

3) run the frontend

> npm run dev

4) run the script to create local assessments!

> node create2concepts2assessments.js 

5) navigate to the assessment-view

copy the assessment address from the scripts output and add it to the url below.
Like this:

http://localhost:8080/#/assessment/<assessmentAddress>

6) Bookmark that site!

Wheneever you run ganache with your seedwords, assessments & concepts will be
deployed to the same address, so you can always navigate back to it 
