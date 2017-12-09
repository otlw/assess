About
========

An Ethereum based solution for peer assessment based on a participatory token economy. You get tokens through assessment, you pay them to get assessed. This system is an abstracted assessment framework capable of assessing anything that can be defined through a hierarchical ontology.

Concept Structure
============

To define an assessment we use a hierarchical structure from most general to most specific. For example, if you wanted to be assessed in creating a Hello World program in Python you would create that assessment on the Hello World concept, which would be a child of the Python concept, which would be a child of the Programming concept, etcetera. This allows us to pull assessors accurately, and group similar tasks together. 

Deployment
========

To your private testnet just run 
>'truffle migrate'

To deploy to the rinkeby-testnet:

Create a file secrets.json in where you save a seed-phrase that will be used
to pay for the deployment. (Make sure that the first account holds some ether).
like this: 
{seed: "baseball poet vague session shrimp humus embrace glare monkey donkey balony bread"}

If you just want to deploy the contracts, temporariliy remove the third and
fourth migration file. If you want to distribute the token and and add users to
the mew-concept, leave them in and create a specific list of accounts, which you
save it as './intitialMembers.json'. Then uncomment the respective lines in the
migration files.
{accounts: ['0x...', 0x...', ... ]}

Then run 
>'truffle migrate --rinkeby'

Contract Structure
==============

The system is based upon a data store and management contract:
`conceptRegistry`, which can be used to create new Concepts. Concepts manage the
creation and storage of `assessments`. Assessments are paid for in the native
token of the network, defined in `FathomToken`.

Contributing
=========
Feel free to submit a pull request or send an email at <contact@fathom.network> if you would like to get in contact.
