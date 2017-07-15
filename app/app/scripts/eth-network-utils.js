con
const query = require('eth-query')
const Eth = require('ethjs')
const {CONCEPT_REGISTRY, USER_REGISTRY} = require('../config')
const conceptRegistryAbi = JSON.parse(require('../../../build/contracts/ConceptRegistry.json')).abi
const userRegistryAbi = JSON.parse(require('../../../build/contracts/ConceptRegistry.json')).abi
const eth = new Eth(global.ethereumProvider)
const conceptRegistry = eth.contract(conceptRegistryAbi).at(CONCEPT_REGISTRY)
const userRegistry = eth.contract(userRegistryAbi).at(USER_REGISTRY)

const ethQuery = new Proxy(new query(ethereumProvider), {
  get: (eQuery, key) => {
    const method = eQuery[key] ? key : 'sendAsync'

    return (...args) => {
      if (method === 'sendAsync' && key !== method) {
        args = {
          method,
          params: args,
        }
      }
      return new Promise( (resolve, reject) => {
        eQuery[method](...args, (err, ress) => {
          !err ? resolve(ress) : reject(err)
        })
      })
    }
  },

  set: (eQuery, key, value) => {
    eQuery[key] = value
  },
})



function newConcept (concept, parents = []) {

}
