var ConceptRegistry = artifacts.require("ConceptRegistry");
var Concept = artifacts.require("Concept");

var conReg
var aha

contract("Changing data on Concepts: ", (accounts) => {

    let createdConcept;
    let mewAddress;

    it ("Initially, create a new concept", async () => {
        conReg = await ConceptRegistry.deployed()
        mewAddress = await conReg.mewAddress.call()
        let name1 = "banana"
        let txReciept = await conReg.makeConcept([mewAddress], [500], 60*60*24, name1, accounts[0])
        let createdConceptAddress = txReciept.logs[0].args["_concept"]
        createdConcept = await Concept.at(createdConceptAddress)
        assert.isTrue(await conReg.conceptExists.call(createdConceptAddress), "mew doesn't exist")

    })
    describe("Concepts..", async () => {
        it("should allow only the owner to change lifetime of the concept", async () => {
            let ltBefore  = await createdConcept.lifetime.call()
            await createdConcept.changeLifetime(10000)
            let ltAfter  = await createdConcept.lifetime.call()
            assert.notEqual(ltBefore, ltAfter);
            try {
                await createdConcept.changeLifetime(4, {from:accounts[2]})
            } catch(e) {
                if (e.toString().indexOf('revert') > 0) {
                    assert(true, "a 'revert' is thrown")
                } else {
                    assert(false, e.toString(), "execution should have failed with a revert")
                }
            }
        })

        it("should allow ownership to be transferred", async () => {
            await createdConcept.transferOwnership(accounts[1])
            let newOwner  = await createdConcept.owner.call()
            assert.equal(accounts[1], newOwner);
        })
    })
})

