About
========

An Ethereum based solution for peer assessment based on a participatory token economy. You get tokens through assessment, you pay them to get assessed. This system is an abstracted assessment framework capable of assessing anything that can be defined through a hierarchical ontology.

Concept Structure
============
To define an assessment we use a hierarchical structure from most general to most specific. For example, if you wanted to be assessed in creating a Hello World program in Python you would create that assessment on the Hello World concept, which would be a child of the Python concept, which would be a child of the Programming concept, etcetera. This allows us to pull assessors accurately, and group similar tasks together.

Deployment
========
These are all the contracts required for the network to run. The only ones that must be deployed are `userRegistry` and `conceptRegistry` while the others are managed and created by those two.

The steps for deployment are a bit tricky. First `conceptRegistry` must be deployed, followed by `userRegistry`, which takes the `conceptRegistry` address as a parameter. Next, `setUserRegistryAddress` must be called from `conceptRegistry` with the `userRegistry` address.

Next, the initial concept and user must be created. First one must create the "mew" concept in `conceptRegistry`. This is the base that all other concepts will be a child of, and every user must earn. It essentially acts as a spam preventer, and as a token faucet for users. Once this is done the first User must be created from `userRegistry`.


Contract Structure
==============
The system is based upon two data store and management contracts, `conceptRegistry` and `userRegistry`. Concepts manage the creation and storage of `assessments`. Users are defined by User Contracts, which are created and added to `userRegistry`.

Contributing
=========
Feel free to submit a pull request or send an email at <jared@otlw.co> if you would like to get in contact, or join us on Gitter.
