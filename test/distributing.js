var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")


contract("Distributor", function(accounts) {
    var setup = [
        [0, [], [],[]],
        [1, [0], [accounts[0]],[100]],
        [2, [0], [],[]],
        [3, [2],[accounts[1],accounts[2]],[10]]
    ];
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
                return distributor.addNextConcept(setup[0][0], setup[0][1],setup[0][2],setup[0][3])
            }).then(function(){
                return distributor.addNextConcept(setup[1][0], setup[1][1],setup[1][2],setup[1][3])
            }).then(function(){
                return distributor.conceptIndex.call()
            }).then(function(nCreated){
                createdAfter = nCreated.toNumber()
                assert.equal(createdAfter, createdBefore + 2, "concept did not get created")
            })
        })
        // it("should add the second concept with its initial members")
    })
})

