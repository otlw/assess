const contract = require('truffle-contract')
const config = require('../config.js')
const Web3 = require('web3')

module.exports = {
    SHOW_NEW_CONCEPT_FORM: 'SHOW_NEW_CONCEPT_FORM',
    showNewConceptForm,
    UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
    updateFormData,
    addConcept,
    getConceptEvents,
    CLEAR_CONCEPTS: 'CLEAR_CONCEPTS',
    clearConcepts,
    SHOW_CONCEPT_VIEW: 'SHOW_CONCEPT_VIEW',
    showConceptView
}



function showNewConceptForm() {
  return {
    type: this.SHOW_NEW_CONCEPT_FORM
  }
}

function updateFormData (key, value) {
    return {
        type: this.UPDATE_FORM_DATA,
        key,
        value,
    }
}

function addConcept (name, address) {
    return {
        type: "ADD_CONCEPT",
        name,
        address,
    }
}

function getConceptEvents(){
    const web3 = new Web3(window.ethereumProvider)
    const conceptRegistry = contract(config.CONCEPT_REGISTRY_CONTRACT)
    conceptRegistry.setProvider(window.ethereumProvider)

    return function (dispatch) {
        dispatch(clearConcepts())
        conceptRegistry.deployed().then(function(instance){
            instance.ConceptCreation({}, {fromBlock:0, toBlock:"latest"}, function(err, result) {
                if(!err){
                    const name = web3.toAscii(result.args._data)
                    const address = result.args._concept
                    dispatch(addConcept(name, address))
                }
            })
        })
    }
}

function clearConcepts(){
    return {
        type: 'CLEAR_CONCEPTS'
    }
}

function showConceptView(concept){
    return {
        type: this.showConceptView,
    }
}
