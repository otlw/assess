// This function aims at testing deployed concepts and assessments 
// and to deploy 2 new concepts and 2 new assessments on the current deployed concept Registry.
// Those will be useful examples to develop our apps.

// when calling, this function, provide the network name to use it on another network than ganache-cli:
// ex: 'node create2concepts2assessments.js rinkeby'

//specify network as first argument

let conceptRegABI=require('./build/contracts/ConceptRegistry.json');
let conceptRegAddress
let conceptRegContract

let conceptABI=require('./build/contracts/Concept.json');
let conceptAddress
let conceptContract

let assessmentABI=require('./build/contracts/Assessment.json');

let ahaABI=require('./build/contracts/FathomToken.json');
let ahaAddress
let ahaContract

let provider

const network=process.argv[2]




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

    console.log("\n### -- 1. Set Up -- ###\n")


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

    console.log("\n### -- 2. Instanciate Concept Registry -- ###\n")

    //set contract address from ABI
    conceptRegAddress=conceptRegABI.networks[net].address
    console.log("Concept registery Address is : "+conceptRegAddress)
    //instantiate contracts
    conceptRegContract = await new web3.eth.Contract(conceptRegABI.abi,conceptRegAddress,{from:accounts[0]})

    let mewAddress=await conceptRegContract.methods.mewAddress().call()
    console.log("MEW address is :")
    console.log(mewAddress)


    console.log("\n### -- 3. Deploy 2 Concepts -- ###\n")

    //deploy one concept
    console.log("deploying first concept....")
    //encode a title for this concept
    const msg = '0x' + (Buffer.from("hello, hellooooo", 'utf8')).toString('hex')
    let txResultConcept1 = await conceptRegContract.methods.makeConcept([mewAddress],[500],60*60*24,msg,accounts[0]).send({from:accounts[0],gas: 3200000})
    //use the tx to get deployed concept address
    let concept1Address=txResultConcept1.events.ConceptCreation.returnValues._concept
    console.log("New concept deployed from mew concept at "+concept1Address)
    conceptContract1=await new web3.eth.Contract(conceptABI.abi,concept1Address,{from:accounts[0]})
    console.log("concept1 instanciated")

    //deploy a second concept
    console.log("deploying second concept....")
    let txResultConcept2 = await conceptRegContract.methods.makeConcept([mewAddress],[500],60*60*24,"0x42",accounts[0]).send({from:accounts[0],gas: 3200000})
    //use the tx to get deployed concept address
    let concept2Address=txResultConcept2.events.ConceptCreation.returnValues._concept
    console.log("New concept deployed from mew concept at "+concept2Address)
    conceptContract2=await new web3.eth.Contract(conceptABI.abi,concept2Address,{from:accounts[0]})
    console.log("concept2 instanciated")

    console.log("\n### -- 4. List Concepts Created from this Registry -- ###\n")

    //list all conceptCreation Events
    console.log("getting all ConceptRegistery events...")
    let pastevents=await conceptRegContract.getPastEvents({fromBlock: 0,toBlock:"latest"})
    pastevents.forEach((e)=>{
        console.log("*****************\n"+e.event+"\n"+"blockNumber: "+e.blockNumber)
    })

    console.log("\n### -- 5. Deploy 2 Assessments from those 2 Concepts -- ###\n")

    //define constants for assessments  
    const cost = 10;
    const size = 5;
    const endTime = 1000000000000;
    const startTime = 1000000000;
    const assesseeAddress=accounts[0]

    //check balance of assessee
    const ahaContract = await new web3.eth.Contract(ahaABI.abi,ahaABI.networks[net].address,{from:accounts[0]})
    assesseeInitialBalance =  await ahaContract.methods.balanceOf(assesseeAddress).call()
    console.log("account 0 is : "+accounts[0])
    console.log("Assessee initial AHA balance "+Number(assesseeInitialBalance))
    let assesseeEthBalance =await web3.eth.getBalance(assesseeAddress)
    console.log("Assessee initial ETH balance "+Number(assesseeEthBalance))

    //deploy 1 assessment from concept 1
    console.log("deploying first assessment....")
    const txResultAssessment1 = await conceptContract1.methods.makeAssessment(cost, size, startTime, endTime).send({from:accounts[0],gas: 3200000}) 
    //use token events to get assessment address
    let events1=await ahaContract.getPastEvents({fromBlock: 0,toBlock:"latest"})
    const assessmentAddress1=events1[events1.length-1].returnValues.sender
    console.log("New assessment deployed from concept1 at "+assessmentAddress1)
    //instanciate assessment contract
    let assessmentContract1= await new web3.eth.Contract(assessmentABI.abi,assessmentAddress1)
    console.log("assessment1 instanciated")

    //deploy an assessment from concept 2
    console.log("deploying second assessment....")
    const txResultAssessment2 = await conceptContract2.methods.makeAssessment(cost, size, startTime, endTime).send({from:accounts[0],gas: 3200000}) 
    //use token events to get assessment address
    let events2=await ahaContract.getPastEvents({fromBlock: 0,toBlock:"latest"})
    const assessmentAddress2=events2[events2.length-1].returnValues.sender
    console.log("New assessment deployed from concept1 at "+assessmentAddress2)
    //instanciate assessment contract
    let assessmentContract2= await new web3.eth.Contract(assessmentABI.abi,assessmentAddress2)
    console.log("assessment2 instanciated")
}
test()

