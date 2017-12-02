var ConceptRegistry = artifacts.require("ConceptRegistry");
var FathomToken = artifacts.require("FathomToken");
var Concept = artifacts.require("Concept");

var conReg
var aha

contract("ConceptRegistry", function() {
    var mewAddress;
    var createdConceptAddress;

    it("should have created the mew contract", async () => {
        conReg = await ConceptRegistry.deployed()
        mewAddress = await conReg.mewAddress.call()

        assert.isTrue(await conReg.conceptExists.call(mewAddress), "mew doesn't exist")
    })
    it("should allow mew as the parent when specified", async () => {
        let txReciept = await conReg.makeConcept([mewAddress], [500], 60*60*24, "")
        createdConceptAddress = txReciept.logs[0].args["_concept"]

        let createdConcept = await Concept.at(createdConceptAddress)

        assert.equal( await createdConcept.parents.call(0), mewAddress)
    });

    it("should set the parents if specified", async () => {
        let txReceipt = await conReg.makeConcept([createdConceptAddress], [500], 60*60*24, "")

        let childConcept = await Concept.at(txReceipt.logs[0].args["_concept"])
        assert.equal(await childConcept.parents.call(0), createdConceptAddress, "Child concept doesn't know supplied parent")
    });

    it("should throw if parent doesn't exist", async () => {
        try {
            await conReg.makeConcept(["0x123"], [500], 60*60*24, "")
        } catch (e) {
            if(e.toString().indexOf('revert') > 0) {
                assert(true)
            }
            else {
                assert(false, e.toString())
            }
        }
    })
})

contract("Initial User", function(accounts){ 
    it("should have a balance of 10000000000", async () => {
        aha = await FathomToken.deployed()
        balance = await aha.balances.call(accounts[0])
        assert.equal(balance.toNumber(),10000000000, "User0 does not have 10 billion Ahas")
        balance = await aha.balances.call(accounts[4])
        assert.equal(balance.toNumber(),10000000000, "User4 does not have 10 billion Ahas")
    });
})

contract("token transfers", function(accounts) {
    it("Should modify balances correctly", async () => {
        var account1InitialBalance = await aha.balances.call(accounts[0]);
        var account2InitialBalance = await aha.balances.call(accounts[1]);
        var amount = 50;

        await aha.transfer(accounts[1], amount, {from: accounts[0]})

        assert.equal(account1InitialBalance - await aha.balances.call(accounts[0]), amount)
        assert.equal(await aha.balances.call(accounts[1]) - account1InitialBalance, amount)
   })
})
