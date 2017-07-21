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
            //check for concepts 0 and 2 //TODO loop and check for all
            p = 0;
            return distributor.addedConceptMembers.call(p).then(function(membersOfP){
                memberAddresses = membersOfP
                return distributor.addedConceptWeights.call(p)
            }).then(function(weightsOfP){
                memberWeights = weightsOfP
                for (j=0; j<memberAddresses.length; j++){
                    assert.equal(memberAddresses[j], setup[p][5][j], "member " + j +  " did not get added")
                    assert.equal(memberWeights[j].toNumber(), setup[p][6][j], "member " + j +  " got added with the wrong weight")
                }
            }).then(function(){
                p = 2
                return distributor.addedConceptMembers.call(p)
            }).then(function(membersOfP){
                memberAddresses = membersOfP
                return distributor.addedConceptWeights.call(p)
            }).then(function(weightsOfP){
                memberWeights = weightsOfP
                for (j=0; j<memberAddresses.length; j++){
                    assert.equal(memberAddresses[j], setup[p][5][j], "member " + j +  " did not get added")
                    assert.equal(memberWeights[j].toNumber(), setup[p][6][j], "member " + j +  " got added with the wrong weight")
                }
            })
        })
        it(" which decreases as they are propageted upwards to mew", function(){
            return ConceptRegistry.deployed().then(function(instance){
                conceptReg = instance
                return conceptReg.mewAddress.call()
            }).then(function(mewAddress){
                mewConcept = Concept.at(mewAddress)
                //check only account 1 for weight>0 in mew //TODO loop and check for all
                a = 1
                return mewConcept.getWeight.call(accounts[a])
            }).then(function(weight){
                assert.isAbove(weight.toNumber(), 0, "account"  + a +  " has no weight in mew")
                //check account 2 for a decreased weight
                a = 2
                return distributor.conceptLookup.call(0)
            }).then(function(addressOfConcept0){
                concept0 = Concept.at(addressOfConcept0)
                return concept0.getWeight.call(accounts[a])
            }).then(function(_weightAt0){
                weightAt0 = _weightAt0.toNumber()
                return mewConcept.getWeight.call(accounts[a])
            }).then(function(weightAtMew){
                assert.isAbove(weightAt0, weightAtMew.toNumber(), "weight of account " + a + " did not decrease")
            })
        })
    })
})
