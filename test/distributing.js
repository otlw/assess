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
    var conceptReg;
    describe("Distributor", function(){
        it("should create the initial concepts", function(){
            return Distributor.deployed().then(function(instance){
                distributor = instance
                return distributor.addedConcepts.call()
            }).then(function(added){
                assert.equal(added.toNumber(), setup.length, "an incorrect number of concepts got added")
            })
        })
        it("such that they are linked to their parents", function(){
            //check whether it worked for the first and third concepts
            //TODO once looping over promises works, this should be done for all concepts
            p = 1;
            return distributor.addedConceptParents.call(p).then(function(parentsOfP){
                for (i=0; i<parentsOfP.length; i++){
                    assert.equal(parentsOfP[i].toNumber(), setup[p][1][i], "parent " + i +  " did not get added") //TODO add index i of fialed parent
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
        it("should add the initial users as members with their respective weight", function(){
            //check for concepts 1 and 3 //TODO loop and check for all
            p = 1;
            return distributor.addedConceptMembers.call(p).then(function(membersOfP){
                memberAddresses = membersOfP
                return distributor.addedConceptWeights.call(p)
            }).then(function(weightsOfP){
                memberWeights = weightsOfP
                for (j=0; j<memberAddresses.length; j++){
                    assert.equal(memberAddresses[j], setup[p][2][j], "member " + j +  " did not get added")
                    assert.equal(memberWeights[j].toNumber(), setup[p][3][j], "member " + j +  " got added with the wrong weight")
                }
            }).then(function(){
                p = 3
                return distributor.addedConceptMembers.call(p)
            }).then(function(membersOfP){
                memberAddresses = membersOfP
                return distributor.addedConceptWeights.call(p)
            }).then(function(weightsOfP){
                memberWeights = weightsOfP
                for (j=0; j<memberAddresses.length; j++){
                    assert.equal(memberAddresses[j], setup[p][2][j], "member " + j +  " did not get added")
                    assert.equal(memberWeights[j].toNumber(), setup[p][3][j], "member " + j +  " got added with the wrong weight")
                }
            })
        })
        it("such that they are propageted upwards through the tree with decreasing weights", function(){
            return ConceptRegistry.deployed().then(function(instance){
                conceptReg = instance
                return conceptReg.mewAddress.call()
            }).then(function(mewAddress){
                mewConcept = Concept.at(mewAddress)

                //check whether there is a member in mewConcept:
                //note this is hacky test for the correct number of members in mew
                return mewConcept.members.call(0) //this throws if members is empty
            }).then(function(mew1){
                assert.equal(mew1, accounts[0], "account0 not propagated to mew")
                return mewConcept.members.call(2) //this throws if members is empty
            }).then(function(mew1){
                assert.equal(mew1, accounts[2], "account2 not propagated to mew")

                //this is a (less but still) hacky test for the correct weights:
                //check only accounts 1 and 2 //TODO loop and check
                a = 1
                return mewConcept.weights.call(accounts[a])
            }).then(function(weight){
                assert.isAbove(weight.toNumber(), 0, "account"  + a +  " has no weight in mew")
                a = 2
                return mewConcept.weights.call(accounts[a])
            }).then(function(weight){
                assert.isAbove(weight.toNumber(), 0, "account"  + a +  " has no weight in mew")
            })
        })
    })
})
