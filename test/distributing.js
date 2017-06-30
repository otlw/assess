var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");

utils = require("../js/utils.js")

contract("Distributor", function(accounts) {
    var distributor;
    var createdAfter;
    describe("Distributor", function(){
        it("should add the first concept", function(){
            return Distributor.deployed().then(function(instance){
                distributor = instance
                return distributor.conceptIndex.call()
            }).then(function(nCreated){
                createdBefore = nCreated
                return distributor.addNextConcept()
            }).then(function(){
                return distributor.conceptIndex.call()
            }).then(function(nCreated){
                createdAfter = nCreated
                assert.equal(createdAfter, createdBefore + 1, "concept did not get created")
            })
        })
        // it("should add the second concept with its initial members")
    })
}

