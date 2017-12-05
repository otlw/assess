var ConceptRegistry = artifacts.require("ConceptRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");
var fs = require('fs')
utils = require("../js/utils.js")

var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable
var nInitialUsers = deploymentScript.nInitialUsers

// NOTE:
// to run this copy it to ../assess/test
// Also these tests do not analyze whether the calling of assessors is meaningful
// but instead generate data that can be visualized.
// In order to do that, one should switch to a simpler distribution of initial members
// and weights in ../migrations/2_deploy_contracts.js (e.g. the uniformDistribution)
// and run ../pysim/visualize.py to look at the effect of weights on the call frequency.

contract("Calling Assessors:", function(accounts) {
    let assessedConcept;
    let assessedConceptID = 4; // use testrpc -a 110 when using uniform distribution
    let conceptReg;

    let cost = 15;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;

    let assessee = accounts[nInitialUsers + 1];

    let initialWeightsInMew;
    nAssessments = 1;

    assessorInfo = {}
    describe(nAssessments + " assessments are created ", async () => {

        it("and assessors called.", async () =>{
            distributor  = await Distributor.deployed()
            assessedConceptAddress = await distributor.conceptLookup.call(assessedConceptID)
            assessedConcept = await Concept.at(assessedConceptAddress)
            receipts = []
            for (i=0; i<nAssessments; i++){
                result = await assessedConcept.makeAssessment(cost, size, waitTime, timeLimit, {from: assessee})
                receipts.push(result.receipt)
            }
            for (rct of receipts) {
                calledAssessors = await utils.getCalledAssessors(rct)
                assessorInfo = await updateFrequencies(calledAssessors, assessorInfo, size*nAssessments, assessedConcept, accounts)
            }
            // console.log(assessorInfo)
        })

        //in line with their weight in the parentConcept
        it ("the assessor-frequencies are written to a file ", async () => {
            calls = "calls:,"
            weights = "weight:,"
            accountIndices = "accountIndex:,"
            for (let key in assessorInfo) {
                //write to ouputFile
                 calls += assessorInfo[key].calls + ','
                 weights += assessorInfo[key].weight + ','
                 accountIndices += assessorInfo[key].accountIdx + ','
            }
            fs.writeFileSync('tmp.csv',calls + '\n' + weights + '\n' + accountIndices + '\n' + ",N=" + nAssessments + ",")
        })
    })
})

async function updateFrequencies(calledAssessors, dict, n, assessedConcept, accounts){
    for (let ass of calledAssessors) {
        if (dict.hasOwnProperty(ass)) {
            dict[ass].calls += 1
        } else {
            w = (await assessedConcept.getWeight.call(ass)).toNumber()
            dict[ass] = {calls: 1, weight: w, accountIdx: accounts.indexOf(ass)}
        }
    }
    return dict
}
