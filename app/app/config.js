const conceptRegistryContract = require('../../build/contracts/ConceptRegistry.json')
const userRegistryContract = require('../../build/contracts/ConceptRegistry.json')


module.exports = {
  STORAGE_KEY: 'fathom-config',
  CONCEPT_REGISTRY_CONTRACT: conceptRegistryContract,
  USER_REGISTRY: '',
  initialState: {
    appState: {
      currentView: {
        name: 'concepts',
      },
      conceptList: []
    }
  }
}
