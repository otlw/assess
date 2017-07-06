var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor")

var utils = require("../js/utils.js")
var assessmentStep = require("../js/assessmentFunctions.js")

contract("a timed out assessment", (accounts) => {
    let cost = 10;
    let size = 5;
    let assessee = {address: accounts[5]}
    let assessors;
    let assessorInitialBalance;
    let assessment
    let UserRegistryInstance
    it ("should create Assessment with "+size+" assessors", async () => {
        UserRegistryInstance = await UserRegistry.deployed()
        const DistributorInstance = await Distributor.deployed()

        assessee.balance = await UserRegistryInstance.balances.call(assessee.address)
        const assessmentResult = await Concept.at(await DistributorInstance.conceptLookup(2)).makeAssessment(cost, size, {from: assessee.address})

        assessment = Assessment.at(utils.getNotificationArgsFromReceipt(assessmentResult.receipt, 1)[0].sender)

        assessors = utils.getCalledAssessors(assessmentResult.receipt)
        assessorInitialBalance = await UserRegistryInstance.balances.call(assessors[0])
        assert.equal(assessors.length, size, size + " assessors were called")
    })

    it ("should allow an assessor to confirm after 10 hours", async () => {
        await utils.evmIncreaseTime(60*60*11)

        const txResult = await assessment.confirmAssessor({from: assessors[0]})
        const notifications = utils.getNotificationArgsFromReceipt(txResult.receipt, 2)

        assert.equal(notifications.length, 1, "an assessor couldn't confirm")
    })

    describe ("after 12 hours", function() {
        it("shouldn't allow an assessor to confirm", async () => {
            await utils.evmIncreaseTime(60*60*2)

            const txResult = await assessment.confirmAssessor({from: assessors[1]})
            const notifications = utils.getNotificationArgsFromReceipt(txResult.receipt, 2)

            assert.equal(notifications.length, 0, "an assessor could confirm")
        })

        it("should return the payment to the user", async () => {
            const balance = await UserRegistryInstance.balances.call(assessee.address)

            assert.equal(balance.toNumber(), assessee.balance.toNumber(), "payment wasn't returned")
        })

        it("should return payment to the assessors", async () => {
            const assessorBalance = await UserRegistryInstance.balances.call(assessors[0])
            assert.equal(assessorInitialBalance.toNumber(), assessorBalance.toNumber(), "stake wasn't returned")
        })
    })

})
