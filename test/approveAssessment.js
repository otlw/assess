var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable
var nInitialUsers = deploymentScript.nInitialUsers

contract("Make Assessment For:", function(accounts){
    let userReg;

    let assessedConceptID = 2;
    let assessedConcept;
    let cost = 1500;
    let size = 5;
    let waitTime = 600
    let timeLimit = 1200

    let assessee = accounts[nInitialUsers + 1];
    let outsideUser = accounts[nInitialUsers + 2];
    let tutor = accounts[nInitialUsers + 3];

    describe ("The User", function(){
        it("should approve the external account in the concept", async () => {
            assessedConceptAddress = await (await Distributor.deployed()).conceptLookup.call(assessedConceptID)
            assessedConcept = Concept.at(assessedConceptAddress)
            assert.isTrue(await assessedConcept.approve.call(tutor, cost*size, {from:assessee}), "tutor can't be approved")
            await assessedConcept.approve(tutor, cost*size, {from:assessee})
        })
    })

    describe("The external account", function(){
        let txResult;
        it("should get billed", async () => {
            userReg = await UserRegistry.deployed()
            balanceBefore = await userReg.balances.call(assessee)
            txResult = await assessedConcept.makeAssessmentFrom(assessee, cost, size, waitTime, timeLimit, {from: tutor})
            balanceAfter = await userReg.balances.call(assessee)
            assert.equal(balanceAfter.toNumber(), balanceBefore.toNumber() - cost * size, "the assessee did not get charged")
        })

        it("and start the assessment", async () => {
            startEvent = utils.getNotificationArgsFromReceipt(txResult.receipt, 0)
            assert.equal(startEvent.length, 1, "no assessment got started")
        })
    })
})
