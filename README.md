About
========

An Ethereum based solution for peer assessment based on a participatory token economy. You get tokens through assessment, you pay them to get assessed. This system is an abstracted assessment framework capable of assessing anything that can be defined through a hierarchical ontology.
For more documentation see our [whitepaper](http://fathom.network/whitepaper/).

Concept Structure
============

To define an assessment we use a hierarchical structure from most general to most specific. For example, if you wanted to be assessed in creating a Hello World program in Python you would create that assessment on the Hello World concept, which would be a child of the Python concept, which would be a child of the Programming concept, et cetera. This allows us to pull assessors accurately, and group similar tasks together. 

Contract Structure
==============

The system is based upon a data store and management contract:
`conceptRegistry`, which can be used to create new Concepts. Concepts manage the
creation and storage of `assessments`. Assessments are paid for in the native
token of the network, defined in `FathomToken`.


Deployment
========

Deploying a fathom-network-instance will lead the following contracts being on-chain:

- ConceptRegistry.sol, to manage creation of new concepts
- FathomToken.sol, to manage payments
- one instance of Concept.sol, being the at the root of the concept-tree (the _mew-concept_)
- Math.sol, a library to do scoring and clustering

### To a private testnet

If you do not already have it, you will need to install
[ganache-cli](https://github.com/trufflesuite/ganache-cli) (formerly testrpc) to
run a testnet. 
> npm install ganache-cli

Next, open a console and run your private testnet:
> ganache-cli

In another console, run the migration: 
>'truffle migrate'

### To rinkeby-testnet

Make sure to the key-managing library [truffle-hd-walletprovider](https://github.com/trufflesuite/truffle-hdwallet-provider) installed:
> npm i

As you want to deploy to a real testnet, you need to have
[Metamask](https://metamask.io/) installed and some rinkeby-ether on its first
account. To generate your keys, create a file `secrets.json` in the uppermost
project folder ('./'), where you save the seed-phrase that underlies the account
that pays for the deployment. (Metamask -> Settings -> Reveal Seed Words) 

Your secrets.json-file should look like this: 
>'{seed: "baseball poet vague session shrimp humus embrace glare monkey donkey balony bread"}'

If you want to deploy the minimal version of a fathom network, temporarily
remove the third and fourth migration file (./migrations/3_... & 4...).

If you also want to seed the network with some initial users in the mew-concept
and distribute the token to them, create a specific list of accounts, which you
save it as `./intitialMembers.json` in the root-folder of the project.

Its content should look like this:
>'{accounts: ['0xaccount1...', 0xaccount2...', ... ]}'

Then uncomment the respective lines in the migration files.

Lastly, run 
>'truffle migrate --rinkeby'

Contributing
=========
Feel free to submit a pull request or send an email at <contact@fathom.network> if you would like to get in contact.
