var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable

contract("Distributor", function(accounts) {
    var distributor;
    describe("Distributor", function(){
        it("should has correctly created the initial concept ", function(){
            return Distributor.deployed().then(function(instance){
                distributor = instance
                return distributor.addedConcepts.call()
            }).then(function(added){
                assert.equal(added.toNumber(), setup.length, "an incorrect number of concepts got added")
            })
        })
        it("should correctly link the added Concepts to their parents", function(){
            p = 1;
            return distributor.addedConceptParents.call(p).then(function(parentsOfP){
                for (i=0; i<parentsOfP.length; i++){
                    assert.equal(parentsOfP[i].toNumber(), setup[p][1][i], "parent did not get added") //TODO add index i of fialed parent
                }
            }).then(function(){
                p =2;
                return distributor.addedConceptParents.call(p)
            }).then(function(parentsOfP){
                for (i=0; i<parentsOfP.length; i++){
                    assert.equal(parentsOfP[i].toNumber(), setup[p][1][i], "parent did not get added")
                }
            })
        })
    })
})

