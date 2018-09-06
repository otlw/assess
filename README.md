About
========

This is a frontend to run assesments for the
[fathom-network](https://fathom.network/).


Build
========

Install all dependencies:

` npm i`

Make sure your Metamask is set to the kovan or rinkeby testnet, then serve the
frontend by running

` npm run dev`

Developing
========

### Deploy the contracts to your local development testnet

1. If you don't have ganache install it with: `npm i -g ganache-cli`

2. Fire up ganache with the seedwords of your Metamask instance
```
ganache-cli -m 'your twelve seed words should be here in bla bla blub'
```

3. Deploy the contracts by running `npm run deploy-testnet`

### Create new concepts and assessments

Use the script to create assessments in new concepts

`node scripts/create2concepts2assessments.js`

You can also pass 'kovan' or 'rinkeby' as an argument to create the concepts and
assessments on the respective testnet.


### Run assessments until a certain stage

On you local testnet (only!), you can also run assessments (new ones or existing
ones) until a given stage, e.g. to have 5 assessors commit the scores four 90's
and a 70:

` node scripts/completeAssessment -s commit 90,90,90,90,70`

See the comments in the first lines of completeAssessment.js for more options.

Contributing
=========

To contribute to this project...
- check out our [contribution guide](https://gitlab.com/fathom/org) to see how
  you we work together,
- talk to us on [gitter](https://gitter.im/fathom-network/Lobby) or
- send an email to <contact@fathom.network> if you would like to get in contact.


Styleguide
==========

#### Javascript

We follow Standard JS style guide.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

To use its linter, run the following command:
```
npm run lint
```
This will check all JavaScript files in the current working directory and call attention to any code that needs fixing. 

