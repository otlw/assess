var ConceptRegistry = artifacts.require("ConceptRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");
var fs = require('fs')
utils = require("../js/utils.js")

var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable
var nInitialUsers = deploymentScript.nInitialUsers


contract("Calling Assessors:", function(accounts) {
    let assessedConcept;
    let assessedConceptID = 0; //uniform distribution
    let conceptReg;

    let cost = 15;
    let size = 5;
    let timeLimit = 10000;
    let waitTime = 100;
 
    let assessee = accounts[nInitialUsers + 1];

    let initialWeightsInMew;
    nAssessments = 3;

    assessorInfo = {}
    describe(nAssessments + " assessments are created ", async () => {

        it("and assessors called.", async () =>{
            distributor  = await Distributor.deployed()
            assessedConceptAddress = await distributor.conceptLookup.call(assessedConceptID)
            assessedConcept = Concept.at(assessedConceptAddress)
            receipts = []
            for (i=0; i<nAssessments; i++){
                result = await assessedConcept.makeAssessment(cost, size, waitTime, timeLimit, {from: assessee})
                receipts.push(result.receipt)
            }
            for (rct of receipts) {
                // console.log(rct )
                calledAssessors = await utils.getCalledAssessors(rct)
                assessorInfo = await updateFrequencies(calledAssessors, assessorInfo, size*nAssessments, assessedConcept)
            }
            console.log(assessorInfo)
        })

        //in line with their weight in the parentConcept
        it ("the assessor-frequencies are written to a file ", async () => {
            calls = ""
            weights = ""
            for (let key in assessorInfo) {
                //write to ouputFile
                 calls += assessorInfo[key].calls + ','
                 weights += assessorInfo[key].weightMew + ','
            }
            fs.writeFileSync('tmp.csv',calls + '\n' + weights)
        })
    })
})

async function updateFrequencies(calledAssessors, dict, n, assessedConcept){
    for (let ass of calledAssessors) {
        if (dict.hasOwnProperty(ass)) {
            dict[ass].calls += 1/n
        } else {
            w = await assessedConcept.getWeight.call(ass)
            dict[ass] = {calls: 1/n, weightMew: w.toNumber()}
        }
    }
    return dict
}
