About
========

An Ethereum based solution for peer assessment based on a participatory token economy. You get tokens through assessment, you pay them to get assessed. This system is an abstracted assessment framework capable of assessing anything that can be defined through a hierarchical ontology. 

Installation
========
There is currently no end-user deployment of the application. You can however run it in a development environment using `embark-framework` and `meteor`. 

You must have an Ethereum RPC client running using either `geth` or `embark simulator`. 

Simply `git clone` this directory and run `embark deploy` followed by `meteor` in its root folder. 

Contract Structure
==============
The system is contract by a Master Contract to store account balances and achievements, as well as a list of Tag Contracts, all through `mappings`. It also currently contains the functions to manipulate these and a function to create new Tag contracts. 

A tag contract contains a `string` definition of itself, an `array` of user who have earned it, as well as a history of all assessments completed.  Its definition includes the address of the Master that spawned it as well as addresses of any parent tags it may have. The functions for pulling assessors is stored on this contract and the function to create new assessments

Assessment contracts store all the information pertaining to a specific assessment of a specific user, the pass/fail, score, and any data passed between users and assessors, all in a `Struct. It contains the functions for collecting assessments and processing them, as well as those for punishment/reward through tokens. 

Contributing 
=========
Feel free to submit a pull request or send an email at <jared@otlw.co> if you would like to get in contact, or join our Slack. 
