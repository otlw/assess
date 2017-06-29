var ConceptRegistry = artifacts.require("./ConceptRegistry.sol")
var Concept = artifacts.require("./Concept.sol")

module.exports = function(deployer) {
    var ConceptRegistryInstance
    var firstConceptAddress;
    deployer.then(function(){
        return ConceptRegistry.deployed()
    }).then(function(instance){
        ConceptRegistryInstance = instance
        return ConceptRegistryInstance.makeConcept([])
    }).then(function(result){
        firstConceptAddress = result.logs[0].args["_concept"]
        return ConceptRegistryInstance.makeConcept([firstConceptAddress])
    }).then(function(){
        return ConceptRegistryInstance.makeConcept([firstConceptAddress])
    })
}
