[![Join the chat at https://gitter.im/otlw/otlw-assess](https://badges.gitter.im/otlw/otlw-assess.svg)](https://gitter.im/otlw/otlw-assess?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

About
========

An Ethereum based solution for peer assessment based on a participatory token economy. You get tokens through assessment, you pay them to get assessed. This system is an abstracted assessment framework capable of assessing anything that can be defined through a hierarchical ontology. 

Tag Structure
============
To define an assessment we use a hierarchical structure from most general to most specific. For example, if you wanted to be assessed in creating a Hello World program in Python you would create that assessment on the Hello World tag, which would be a child of the Python tag, which would be a child of the Programming tag, etcetera. This allows us to pull assessors accurately, and group similar tasks together. 

Deployment
========
These are all the contracts required for the network to run. The only ones that must be deployed are `userMaster` and `tagMaster` while the others are managed and created by those two. 

The steps for deployment are a bit tricky. First `tagMaster` must be deployed, followed by `userMaster`, which takes the `tagMaster` address as a parameter. Next, `setUserMasterAddress` must be called from `tagMaster` with the `userMaster` address. 

Next, the initial tag and user must be created. First one must create the "account" tag in `tagMaster`. This is the base that all other tags will be a child of, and every user must earn. It essentially acts as a spam preventer, and as a token faucet for users. Once this is done the first User must be created from `userMaster`. 


Contract Structure
==============
The system is based upon two data store and management contracts, `tagMaster` and `userMaster`. Tags manage the creation and storage of `assessments`. Users are defined by User Contracts, which are created and added to `userMaster` once they have gone through the account tag assessment process. 

Contributing 
=========
Feel free to submit a pull request or send an email at <jared@otlw.co> if you would like to get in contact, or join us on Gitter. 
