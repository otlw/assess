const conceptRegistryAbi = JSON.parse(require('../../build/contracts/ConceptRegistry.json')).abi
const userRegistryAbi = JSON.parse(require('../../build/contracts/ConceptRegistry.json')).abi


module.exports = {
  STORAGE_KEY: 'fathom-config',
  CONCEPT_REGISTRY: '0x4b54573213d1ecb12f5bd416e39984d04615c45b',
  USER_REGISTRY: '',
  initialState: {
    appState: {
      currentView: {
        name: 'concepts',
      },
    }
  }
}
