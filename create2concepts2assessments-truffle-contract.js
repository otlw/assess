//specify network as first argument

let conceptRegABI=require('./build/contracts/ConceptRegistry.json');
let conceptRegAddress
let conceptRegContract

let conceptABI=require('./build/contracts/Concept.json');
let conceptAddress
let conceptContract

let ahaABI=require('./build/contracts/FathomToken.json');
let ahaAddress
let ahaContract

let provider

const network=process.argv[2]


const contract=require('truffle-contract')

async function test(){

    //const Eth = require('ethjs');
    const Web3=require("web3")

    //detect network and declare variables accordingly
    if (network=="rinkeby"){
        //use rinkeby   
        let truffleConfig=await require("./truffle.js")
        provider=await truffleConfig.networks.rinkeby.provider //new Web3.providers.HttpProvider('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')//await truffleConfig.networks.rinkeby.provider //'https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7' //new Eth.HttpProvider('https://rinkeby.infura.io')
    } else {
        //use Ganache by default (last deployed contract version)
        let networkValues=Object.values(conceptRegABI.networks)
        let networkKeys=Object.keys(conceptRegABI.networks)
        provider='http://localhost:8545' //new Web3.HttpProvider('http://localhost:8545')
    }
    //const eth = new Eth(provider);
    const web3=new Web3(provider)
    const eth=web3.eth

    var nInitialUsers = 6
    var gasPrice = 1000000000; //safe low cost
    var etherPrice = 460 // as of 11/17

    //log accounts
    let accounts= await eth.getAccounts()
    if (accounts.length===0){
        //if not on testnet
        const setup = require("./initialMembers.json")
        accounts=setup.accounts
    }
    console.log("++++++++++= accounts : ")
    console.log(accounts)
    //log network
    let net= await eth.net.getId()
    console.log("current network version")
    console.log(net)
    //log deployed contracts
    console.log("-- deployed version of concept reg on different networks -- :")
    console.log(conceptRegABI.networks)
    //set contract address from ABI
    conceptRegAddress=conceptRegABI.networks[net].address
    console.log("Concept registery Address is : "+conceptRegAddress)
    //instantiate contracts
    let conceptreginstance=await contract(conceptRegABI.abi)
    conceptreginstance.setProvider(provider)
    console.log("instanciated concept reg")
    conceptRegContract =await conceptreginstance.deployed() //.at(conceptRegAddress) //await new web3.eth.Contract(conceptRegABI.abi,conceptRegAddress,{from:accounts[0]})
    console.log("deployed() success")
    let mewAddress=await conceptRegContract.mewAddress()
    console.log("MEW address is :")
    console.log(mewAddress)

    //deploy one concept
    let txResultConcept1 = await conceptRegContract.methods.makeConcept([mewAddress],[500],60*60*24,"0x",accounts[0]).send({from:accounts[0],gas: 3200000})
    console.log("txResultConcept1")
    let concept1Address=txResultConcept1.events.ConceptCreation.address
    console.log("New concept deployed from mew concept at "+concept1Address)
    conceptContract1=await new web3.eth.Contract(conceptABI.abi,concept1Address,{from:accounts[0]})
    console.log("concept1 instanciated")

    //deploy a second concept
    let txResultConcept2 = await conceptRegContract.methods.makeConcept([mewAddress],[500],60*60*24,"0x",accounts[0]).send({from:accounts[0],gas: 3200000})
    let concept2Address=txResultConcept2.events.ConceptCreation.address
    console.log("New concept deployed from mew concept at "+concept2Address)
    conceptContract2=await new web3.eth.Contract(conceptABI.abi,concept2Address,{from:accounts[0]})
    console.log("concept2 instanciated")

    //define constants for assessments  
    const cost = 10;
    const size = 6;
    const endTime = 1000000000000;
    const startTime = 1000000000;
    const assesseeAddress=accounts[size]

    //check balance of assessee
    const ahaContract = await new web3.eth.Contract(ahaABI.abi,ahaABI.networks[net].address,{from:accounts[0]})
    assesseeInitialBalance =  await ahaContract.methods.balanceOf(assesseeAddress).call()
    console.log("Assessee initial AHA balance "+Number(assesseeInitialBalance))
    let assesseeEthBalance =await web3.eth.getBalance(assesseeAddress)
    console.log("Assessee initial ETH balance "+Number(assesseeEthBalance))

    //deploy 1 assessment from concept 1 ---- 150000 6 100 10000 { from: '0xd6edda2a82fa51ac605e263a6c39394a59091de2' }
    const txResultAssessment1 = await conceptContract1.methods.makeAssessment(cost, size, startTime, endTime).send({from:assesseeAddress,gas: 3200000}) 
    console.log(txResultAssessment1.events)
}
test()

//web3.setProvider(Ganache.provider());
//console.log(web3.eth.getAccounts)
//web3.eth.getAccounts((accounts)=>{console.log(accounts)})

// conceptRegContract = contract(conceptReg);
// conceptRegDeployed = conceptRegContract.deployed().then(function(instance){console.log(instance)})
            //let txResult = await conceptRegDeployed.makeConcept(([await conceptRegDeployed.mewAddress()]),[500],60*60*24,"","0x0")
            //assessedConcept = await Concept.at(txResult.logs[0].args["_concept"])

// contract('Assessment', function(accounts) {
//     let aha;
//     let conceptReg;

//     let assessedConcept;
//     let assessmentContract;
//     let assessmentData;

//     let cost = 10000000;
//     let size = 5;
//     let timeLimit = 100000000;
//     let waitTime = 100;

//     let calledAssessors = [];
//     let confirmedAssessors = [];
//     let assesseeIdx = nInitialUsers + 1
//     let assessee = accounts[assesseeIdx];
//     let assesseeInitialBalance;
//     let outsideUser = accounts[nInitialUsers + 2];

//     let score = 1000;
//     let scores = [];
//     let salts = [];
//     let hashes = [];

//     for (i=0; i<nInitialUsers; i++){
//         scores.push(score)
//         salts.push(i.toString())
//         hashes.push(utils.hashScoreAndSalt(scores[i], salts[i]))
//     }

//     let receiptFromMakeAssessment;
//     var ethBalancesBefore;
//     var gasCosts = [];

//     describe('Before the assessment', function(){
//         it('A concept is created', async () => {
//             conceptReg = await ConceptRegistry.deployed()
//             let txResult = await conceptReg.makeConcept(([await conceptReg.mewAddress()]),[500],60*60*24,"","0x0")
//             assessedConcept = await Concept.at(txResult.logs[0].args["_concept"])

//             assert.isTrue( await conceptReg.conceptExists.call(assessedConcept.address))
//         })

//         it("users should have enough tokens", async() => {
//             aha = await FathomToken.deployed()
//             assesseeInitialBalance =  await aha.balanceOf.call(assessee)

//             assert.isAbove(assesseeInitialBalance.toNumber(), cost*size)
//         })
//     })

//     describe('Concept', function() {
//         it("should initiate an assessment", async () => {
//             ethBalancesBefore = utils.getEthBalances(accounts.slice(0,nInitialUsers + 2))

//             assessmentData = await chain.makeAssessment(assessedConcept.address, assessee, cost, size, waitTime, timeLimit)
//             receiptFromMakeAssessment = assessmentData.txResult.receipt

//             gasCosts.push({function: "makeAssessment",
//                            cost: {
//                                ether:web3.fromWei(receiptFromMakeAssessment.gasUsed * gasPrice, "ether"),
//                                $: utils.weiToDollar(receiptFromMakeAssessment.gasUsed * gasPrice, etherPrice)
//                            }})

//             assessmentContract = Assessment.at(assessmentData.address)

//             assert.isTrue(await assessedConcept.assessmentExists.call(assessmentContract.address), "the assessment hasn't been created")
//         })

//         it("should charge the assessee", async() => {
//             const balance = await aha.balanceOf.call(assessee)
//             assert.equal(balance.toNumber(), assesseeInitialBalance - cost*size, "the assessee did not get charged correctly")
//             })
//         })

//     describe('In assessment stage', function() {
//         let receiptFromLastReveal;

//         describe('Called', function() {
//             it("should call the assessors", async() => {
//                 calledAssessors = assessmentData.calledAssessors
//                 assert.isAtLeast(calledAssessors.length, size , "not enough assesssors got added to the pool")
//             })

//             describe("When assessors confirm", async () => {
//                 let receiptFromConfirm;
//                 it("they should be rejected if they have not been called", async() => {
//                     balanceBefore = await aha.balanceOf.call(outsideUser)
//                     await assessmentContract.confirmAssessor({from: outsideUser})
//                     balanceAfter = await aha.balanceOf.call(outsideUser)

//                     assert.equal(balanceBefore.toNumber(), balanceAfter.toNumber(), "an uncalled assessor could stake")
//                 })

//                 it("they should be charged", async () => {
//                     confirmedAssessors = calledAssessors.slice(0, size)
//                     assessorInitialBalance = await aha.balanceOf.call(confirmedAssessors[0])
//                     await chain.confirmAssessors(confirmedAssessors, assessmentContract)
//                     balanceAfter = await aha.balanceOf.call(confirmedAssessors[0])

//                     assert.equal(balanceAfter, assessorInitialBalance - cost)
//                 })

//                 it("should move to the called stage if enough confirmed", async () => {
//                     let assessmentStage = await assessmentContract.assessmentStage.call()
//                     assert.equal(assessmentStage , 2, "the assessment", "the assessment did not enter called stage")
//                 })

//                 it("should wait some time", function(){
//                     return utils.evmIncreaseTime(2000)
//                 })
//             })
//         })

//         describe("Confirmed", function() {
//             let receiptFromLastCommit;

//             it("commits from non-assessors should be rejected", async () => {
//                 let doneBefore = await assessmentContract.done.call()
//                 await assessmentContract.commit(web3.sha3("random"), {from: outsideUser}) 
//                 let doneAfter = await assessmentContract.done.call()

//                 assert.equal(doneBefore.toNumber(), doneAfter.toNumber(), "an unconfirmed assessor could commit")
//                 assert.equal(doneAfter.toNumber(), 0, "done was increased")
//             })

//             it("should accept commits from confirmed assessors", async () => {
//                 await chain.commitAssessors(confirmedAssessors.slice(1), hashes.slice(1), assessmentContract)
//                 let doneAfter = await assessmentContract.done.call()
//                 assert.equal(doneAfter.toNumber(), confirmedAssessors.length - 1, "a confirmed assessor couldn't commit")
//             })

//             it("should move to committed stage when all commited", async () => {
//                 txResult = await assessmentContract.commit(hashes[0], {from: confirmedAssessors[0]})
//                 receiptFromLastCommit = txResult.receipt
//                 gasCosts.push({function: "commit",
//                                cost: {
//                                    ether:web3.fromWei(receiptFromLastCommit.gasUsed * gasPrice, "ether"),
//                                    $: utils.weiToDollar(receiptFromLastCommit.gasUsed * gasPrice, etherPrice)
//                                }
//                               })

//                 stage = await assessmentContract.assessmentStage.call()
//                 assert.equal(stage.toNumber(), 3, "assessment did not enter commit stage")

//                 let done = await assessmentContract.done.call()
//                 assert.equal(done.toNumber(), 0, "done wasn't reset")
//             })
//         })

//         describe("Committed", function() {
//             it("committed assessors can reveal their scores", async () => {
//                 await utils.evmIncreaseTime(60*60*13) // let 12h challenge period pass
//                 nAssessors = confirmedAssessors.length

//                 await chain.revealAssessors(confirmedAssessors.slice(1, nAssessors),
//                                              scores.slice(1, nAssessors),
//                                              salts.slice(1, nAssessors),
//                                              assessmentContract)

//                 let done = await assessmentContract.done.call()
//                 assert.equal(done.toNumber(), nAssessors-1, "at least one assessors couldn't reveal")
//             })

//             it("should move to the done stage when all assessors have revealed", async() => {
//                 let result = await assessmentContract.reveal(scores[0],
//                                                 salts[0],
//                                                  {from: confirmedAssessors[0]})

//                 receiptFromLastReveal = result.receipt
//                 gasCosts.push({function: "last Reveal + calculate + payout",
//                                cost: {
//                                    ether:web3.fromWei(receiptFromLastReveal.gasUsed * gasPrice, "ether"),
//                                    $: utils.weiToDollar(receiptFromLastReveal.gasUsed * gasPrice, etherPrice)
//                                }
//                               })

//                 stage = await assessmentContract.assessmentStage.call()
//                 assert.equal(stage.toNumber(), 4, "assessment did not enter done stage")
//             })
//         })

//         describe("Done", function() {
//             it("should calculate the assessee's score", async() => {
//                 let finalScore = await assessmentContract.finalScore.call()
//                 assert.equal(finalScore.toNumber(), score, "score not calculated correctly")
//             })

//             describe("The assessee", function(){
//                 let weight;

//                 it("is added to the concept", async () => {
//                     weightInConcept = await assessedConcept.getWeight.call(assessee)
//                     weight = weightInConcept.toNumber()
//                     assert.isAbove(weight, 0, "the assesee doesn't have a weight in the concept")
//                 })

//                 it("is added to the parent at half weight", async () => {
//                     parentConcept = await Concept.at( await assessedConcept.parents.call(0))
//                     weightInParent = await parentConcept.getWeight.call(assessee)

//                     assert.isAbove(weightInParent.toNumber(), 0, "the assesse doesn't have a weight in the parent")
//                     assert.equal(weight/2, weightInParent.toNumber(), "the assessee didn't have half weight in parent")
//                 })
//             })

//             describe("The Assessor", function(){
//                 it("should be paid", async () => {
//                     balanceAfter = await aha.balanceOf.call(confirmedAssessors[0])
//                     assert.equal(balanceAfter.toNumber(), assessorInitialBalance.toNumber() + cost, "assessor didn't get paid")
//                 })
//             })

//             describe("Gast costs", function() {
//                 it("Analysis:", async () => {
//                     stage = await assessmentContract.assessmentStage.call()
//                     assert.equal(stage.toNumber(), 4, "gas measured before assessment is done")
//                     console.log('Assuming GasPrice: ' + gasPrice + "  and 1 ether = $" + etherPrice);
//                     console.log('gasCosts: ', gasCosts);
//                 })
//             })
//         })
//     })
// })
