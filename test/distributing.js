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

    describe("Distributor", function(){
        it("should create the initial concepts", async () => {
            distributorInstance = await Distributor.deployed()
            conceptRegistryInstance = await ConceptRegistry.deployed()

            numConceptsAdded = await distributorInstance.addedConceptsLength.call()
            assert.equal(numConceptsAdded.toNumber(), setup.length, "an incorrect number of concepts got added")

            for(i=0; i<setup.length; i++) {
                let conceptAddress = await distributorInstance.conceptLookup.call(i)
                assert.isTrue(await conceptRegistryInstance.conceptExists.call(conceptAddress), "Concept doesn't exist")
            }
        })

        it("such that they are linked to their parents", async () => {
            for (i=0; i<setup.length; i++) {
                nParents = await distributorInstance.addedConceptParentsLength.call(i)
                for (j=0; j < nParents.toNumber(); j++) {
                    let conceptParent = await distributorInstance.addedConceptParent.call(i,j)
                    assert.equal(conceptParent.toNumber(), setup[i][2][j], "parent "+ j + " of concept " + i + " did not get added")
                }
            }
        })

        it("should add the initial users as members with their respective weight", async () => {
            for( i=0; i<setup.length; i++) {
                let conceptInstance = await Concept.at(await distributorInstance.conceptLookup.call(i))
                conceptMemberLength = (await distributorInstance.addedConceptMembersLength.call(i)).toNumber()
                assert.isAtLeast((await conceptInstance.getMemberLength.call()).toNumber(),
                                 conceptMemberLength,
                                 "less members in the concept than in mentioned in the distributor")

                emptySpots = (await distributorInstance.addedConceptAddableMembers.call(i)).toNumber()
                assert.equal(emptySpots, 0, "the distributor does not remember all added members members")

                for(j=0; j<conceptMemberLength; j++) {
                    let memberAddress = await distributorInstance.addedConceptMemberAddress.call(i,j)
                    weight =  await conceptInstance.getWeight.call(memberAddress)
                    assert.equal(weight.toNumber(), setup[i][6][j])
                }
            }
        })

        it("should not allow the addition of more members than specified", async () => {
            for( i=0; i<setup.length; i++) {
                conceptMemberLengthBefore = (await distributorInstance.addedConceptMembersLength.call(i)).toNumber()
                let conceptInstance = await Concept.at(await distributorInstance.conceptLookup.call(0))
                await distributorInstance.addInitialMember(0, accounts[0], 10)
                conceptMemberLengthAfter = (await distributorInstance.addedConceptMembersLength.call(i)).toNumber()
                assert.equal(conceptMemberLengthBefore, conceptMemberLengthAfter, "a member could be added")
            }
        })

        it("should propagate to the parent according to the rate", async () => {
            const mew = await conceptRegistryInstance.mewAddress.call()
            for( i=0; i<setup.length; i++) {
                let initialConceptInstance = await Concept.at(await distributorInstance.conceptLookup.call(i))
                let conceptMembers =  setup[i][5]

                for(j = 0; j<setup[i][1].length; j++) {
                    let parentConceptInstance = await Concept.at(await distributorInstance.conceptLookup(setup[i][1][j]))

                    for(k = 0; k <conceptMembers.length; k++) {
                        let weightInParent = await parentConceptInstance.getWeight.call(conceptMembers[k])
                        let weightInChild = await initialConceptInstance.getWeight.call(conceptMembers[k])
                        assert.equal(weightInParent.toNumber(),
                                     Math.floor(weightInChild.toNumber()*(setup[i][2][j]/1000)))
                    }
                }
            }
        })
    })
})
