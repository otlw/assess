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
[ganache-cli](https://github.com/trufflesuite/ganache-cli) (formerly named testrpc) to
run a testnet. 
> npm install ganache-cli

Next, open a console and run your private testnet:
> ganache-cli

In another console, run the migration: 
>'truffle migrate'

_NOTE: If you have deployed to rinkeby before, make sure to remove/rename the
`initialMembers.json` file. Otherwise signing transactions will not work and all
tests will fail._

### To rinkeby-testnet

#### Set up key-management
Make sure to have the key-managing library
[truffle-hd-walletprovider](https://github.com/trufflesuite/truffle-hdwallet-provider)
installed: 

> npm i 
or
> npm install truffle-hd-walletprovider

As you want to deploy to a real testnet, you need to have
[Metamask](https://metamask.io/) installed and some rinkeby-ether on its first
account. To generate your keys, create a file `secrets.json` in the uppermost
project folder ('./'), where you save the seed-phrase that underlies the account
that pays for the deployment. (Metamask -> Settings -> Reveal Seed Words) 

Your secrets.json-file should look like this: 
>'{seed: "baseball poet vague session shrimp humus embrace glare monkey donkey balony bread"}'

#### 1) Specify an initial set of users

NOTE: If you *DON'T* want to add initial users to mew nor distribute tokens to
them, follow the instructions in the comments of
`migrations/2_deploy_contracts.js` and continue at step 2).

If you *DO* want to seed the network with some initial users in the mew-concept
create a specific list of accounts, which you save it as
`./intitialMembers.json` in the root-folder of the project.

Its content should look like this:
>'{accounts: ['0xaccount1...', 0xaccount2...', ... ]}'

_OPTIONAL_: If you want to be able to add more members than specified in the
list, adjust the `nInitialMewMembers`-variable in `/migrations/2_deploy_contracts.js`
to that end.

#### 2) Specify the initial AHA-Owner(s)

Next, you need to specify which account should get all created AHA-tokens.

Open `/migrations/2_deploy_contracts.js` and set the variable
`initialAhaAccount` to the desired address. 

If you have provided an inital set of users, this will automatically be set for
you to the first address in the list. Optionally, you can also change how many
tokens will be created. 

#### 3) Configure token & member distribution

By default, all tokens will be distributed amongst all addresses in the
initial-member list and all addresses will be added to MEW. If you want to
change that play around with the parameters in `/migrations/3_fund_users.js` and
`/migrations/4_add_members_to_mew.js` respectively.

If you don't want to distribute tokens or add initial members, temporarily
remove the respective migrations-file from the folder.

#### 3) Deploy

Lastly, run 
>'truffle migrate --network rinkeby'

_(NOTE: If you get any issues feel free to open an issue or add to an existing
one (e.g. [this]() one on 'Unhandled Promise Rejections'))._

Contributing
=========
Feel free to submit a pull request or send an email at <contact@fathom.network> if you would like to get in contact.
