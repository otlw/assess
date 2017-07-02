var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
var setup  = require("../js/setup.js")

contract("Distributor", function(accounts) {
    var distributor;
    var createdAfter;
    var callsToNext = 0;
    describe("Distributor", function(){
        it("should add the first concept", function(){
            return Distributor.deployed().then(function(instance){
                distributor = instance
                return distributor.conceptIndex.call()
            }).then(function(nCreated){
                createdBefore = nCreated.toNumber()
                return distributor.addNextConcept(setup[2][0], setup[2][1],setup[2][2],setup[2][3])
            }).then(function(){
                return distributor.addNextConcept(setup[3][0], setup[3][1], setup[3][2],setup[3][3])
            }).then(function(){
                return distributor.conceptIndex.call()
            }).then(function(nCreated){
                createdAfter = nCreated.toNumber()
                assert.equal(createdAfter, createdBefore + 2, "concept did not get created")
            })
        })
        // it("should add the second concept with its initial members")
        describe("account 0", function(){
            it("should have a weight in the mew-concept", function(){
                return Concept.deployed().then(function(instance) {
                    mewInstance = instance
                    return instance.getMemberLength.call()
                }).then(function(memberLength) {
                    console.log(memberLength.toNumber())
                    return mewInstance.weights.call(accounts[0])
                }).then(function(weight) {
                    assert.isAbove(weight.toNumber(), 0)
                })
            })
        })
    })
})

