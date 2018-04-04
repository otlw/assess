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


Dependencies
========

Install all dependencies by running 

> npm i

This will install 
- [ganache-cli](https://github.com/trufflesuite/ganache-cli) (formerly named testrpc), to run your private testnet,
- [truffle-hd-walletprovider](https://github.com/trufflesuite/truffle-hdwallet-provider) to manage keys when deploying to rinkeby and
- [ethjs-abi](https://github.com/ethjs/ethjs-abi) and [ethereumjs-abi](https://github.com/ethereumjs/ethereumjs-abi), to be able to run all our tests.

Deployment
========

Deploying a fathom-network-instance will lead the following contracts being on-chain:

- ConceptRegistry.sol, to manage creation of new concepts
- FathomToken.sol, to manage payments
- One instance of Concept.sol, being the root of the concept-tree (the _MEW-concept_)
- Math.sol, a library to do scoring and clustering

### ...to a private testnet

Open a console and run your private testnet:
> ganache-cli

In another console, run the migration: 
>'truffle migrate'


### ...to the rinkeby-testnet

As you want to deploy to a real testnet, you need to have
[Metamask](https://metamask.io/) installed and some rinkeby-ether on its first
account. To generate your keys, create a file `secrets.json` in the uppermost
project folder ('./'), where you save the seed-phrase that underlies the account
that pays for the deployment. (Metamask -> Settings -> Reveal Seed Words) 

Your secrets.json-file should look like this: 
>'{"seed": "baseball poet vague session shrimp humus embrace glare monkey donkey balony bread"}'

#### 1) Specify the initial AHA-Owner

You need to provide at least one address to which all the initial tokens will be
distributed. 
To do so, create a file `./intitialMembers.json` in the root-folder of the
project.

Its content should look like this:
>'{"accounts": ["0xaccount1...", "0xaccount2...", ... ]}'

It must hold at least one account, which will the one that will receive all the
AHA-tokens. To modify the amount, open `/migrations/2_deploy_contracts.js` and
set the variable `initialAmount` to the desired value.

#### 2) Specify an initial set of users and distribute tokens to them

_*NOTE*: If you *DON'T* want to the MEW-concept to have any initial members nor
distribute tokens to them, remove the third and fourth migration-file and
continue at step 3). (Be aware that this you'll have to manually call the
distributor and add the first member to the MEW-concept before any assessment
can be run in your system.)_

If you *DO* want to seed the network with some initial users in the mew-concept
add them to the list of initial accounts.

_OPTIONAL_: If you want to be able to add more members than specified in the
list, adjust the `nInitialMewMembers`-variable in `/migrations/2_deploy_contracts.js`
to that end.

#### 3) Configure token & member distribution

By default, all tokens will be distributed amongst all addresses in the
initial-member list and all addresses will be added to MEW. If you want to
change that play around with the parameters in `/migrations/3_fund_users.js` and
`/migrations/4_add_members_to_mew.js` respectively.

#### 4) Deploy

Lastly, run 
>'truffle migrate --network rinkeby'


#### 5) Troubleshooting

- If you encounter an error-message saying 'Unknown number of arguments to
  solidity-function' it sometimes helps to recompile everything: 
  > rm -rf ./build

- If you get any other issues feel free to open an issue or add to an existing
one.

Tests
============
Most functionnalities are tested in the test files inside the 'test' folder.
To run them, try:
`truffle test`

Contributing
=========

To contribute to this project...
- check out our [contribution guide](https://gitlab.com/fathom/org) to see how
  you we work together,
- talk to us on [gitter](https://gitter.im/fathom-network/Lobby) or
- send an email to <contact@fathom.network> if you would like to get in contact.

This repo has two relevant branches: master and development. master holds
the version of our protocol which will eventually be deployed on the main-net.
On the development-branch, the protocol is modified to make testing and
developing for it much easier. Therefore, several constants (e.g. minimum number
of assessors) have been factored out into an extra-contract, so that it becomes
possible to create and complete assessments without having to wait and whithout
controlling many accounts.

Styleguide
==========

#### Solidity

We follow the [solidity-style
guide](https://solidity.readthedocs.io/en/develop/style-guide.html) and have
recently committed to using the
[solhint](https://protofire.github.io/solhint/rules.html)-linter to enforce it.

After installing it, simply run 
> solhint ./contracts/xxx.sol

until _your_ code does not generate any errors or warnings.

_NOTE:_ Due to our recent adoption of the linter, our codebase is not 100%
compliant with it yet. If you lint your merge-request, make sure to only heed
warnings and errors that are relevant to your new code. If you want to fix other
code too, please do so in the context of a separate issue.

#### Javascript

We follow Standard JS style guide.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

To use its linter, run the following command:
```
npm run lint
```
This will check all JavaScript files in the current working directory and call attention to any code that needs fixing. 

