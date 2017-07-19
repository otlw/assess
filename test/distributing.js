var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable

contract("Distributor", function(accounts) {
    var distributorInstance;
    var conceptRegistryInstance;
    var conceptReg;
    describe("Distributor", function(){
        it("should create the initial concepts", async () => {
            distributorInstance = await Distributor.deployed()
            conceptRegistryInstance = await ConceptRegistry.deployed()

            numConceptsAdded = await distributorInstance.addedConcepts.call()
            assert.equal(numConceptsAdded.toNumber(), setup.length, "an incorrect number of concepts got added")

            for(i=0; i<setup.length; i++) {
                let ConceptAddress = await distributorInstance.conceptLookup.call(i)
                assert.isTrue(await conceptRegistryInstance.conceptExists.call(ConceptAddress), "Concept doesn't exist")
            }
        })

        it("such that they are linked to their parents", async () => {
            for( i=0; i<setup.length; i++) {
                let conceptParents = await distributorInstance.addedConceptParents.call(i)
                for (j=0; j < conceptParents.length; j++) {
                    assert.equal(conceptParents[j].toNumber(), setup[i][1][j], "parent " + i +  " did not get added")
                }
            }
        })

        it("should add the initial users as members with their respective weight", async () => {
            for( i=0; i<setup.length; i++) {
                let conceptInstance = await Concept.at(await distributorInstance.conceptLookup.call(i))
                let conceptMembers = await distributorInstance.addedConceptMembers(i)

                for(j=0; j<conceptMembers.length; j++) {
                    assert.equal(await conceptInstance.getWeight(conceptMembers[j]), setup[i][6][j])
                }
            }
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
