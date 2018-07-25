// This script deploys two concepts and creates an assessments on them.
// It uses the latest version of the fathom-network that has been deployed to the testnet by
// fetching the addresses of the relevant contracts from the build-folder.

// Usage: When executing this scrip provide the network as an argument (default
// the development network deployed by ganache-cli):
// Example: 'node create2concepts2assessments.js rinkeby'

let conceptRegArtifact = require('../build/contracts/ConceptRegistry.json')
let conceptArtifact = require('../build/contracts/Concept.json')
let fathomTokenArtifact = require('../build/contracts/FathomToken.json')

let conceptRegContract
let fathomTokenContract

let provider
const network = process.argv[2]
let printGasAnalysis = process.argv[2] === '--gas'

//variables for the two descriptions
let description1="we dem boiz";
let description2="Hol' up hol' up, Hol' up, we dem boyz Hol' up, we dem boyz Hol' up, hol' up, hol' up, we makin' noise Hol' up, hol' up, hol' up, hol' up, hol' up"
let ipfsHash1,ipfsHash2;

async function create () {
  // const Eth = require('ethjs');
  const Web3 = require('web3')

  // detect network and declare variables accordingly
  if (network === 'rinkeby') {
    let truffleConfig = await require('../truffle.js')
    provider = await truffleConfig.networks.rinkeby.provider
  } else if (network === 'kovan') {
    let truffleConfig = await require('../truffle.js')
    provider = await truffleConfig.networks.kovan.provider
  } else {
    // use Ganache by default (last deployed contract version)
    provider = 'http://localhost:8545'
  }
  const web3 = new Web3(provider)
  const eth = web3.eth

  console.log('\n### -- 1. Set Up -- ###\n')

  // log accounts
  let accounts = await eth.getAccounts()
  if (accounts.length === 0) {
    // if not on testnet
    const setup = require('../initialMembers.json')
    accounts = setup.accounts
  }
  console.log('++++++++++= accounts : ')
  console.log(accounts)
  // log network
  let net = await eth.net.getId()
  console.log('current network version')
  console.log(net)
  // log deployed contracts
  console.log('-- deployed version of concept reg on different networks -- :')
  console.log(conceptRegArtifact.networks)

  console.log('\n### -- 2. Instanciate Concept Registry -- ###\n')

  // set contract address from ABI
  let conceptRegAddress = conceptRegArtifact.networks[net].address
  console.log('Concept registery Address is : ' + conceptRegAddress)
  // instantiate contracts
  conceptRegContract = await new web3.eth.Contract(conceptRegArtifact.abi, conceptRegAddress, {from: accounts[0]})

  let mewAddress = await conceptRegContract.methods.mewAddress().call()
  console.log('MEW address is :')
  console.log(mewAddress)

  console.log('\n### -- 3. Creating Two Concepts -- ###\n')

  // deploy one concept
  console.log('Creating first concept....')
  // use ipfsHash for concept creation
  let txResultConcept1 = await conceptRegContract.methods.makeConcept([mewAddress], [500], 60 * 60 * 24, ipfsHash1, accounts[0]).send({from: accounts[0], gas: 3200000})
  // use the tx to get deployed concept address
  let concept1Address = txResultConcept1.events.ConceptCreation.returnValues._concept
  console.log('New concept created as child of mew concept at ' + concept1Address)
  let conceptContract1 = await new web3.eth.Contract(conceptArtifact.abi, concept1Address, {from: accounts[0]})
  console.log('Concept1 instantiated')

  // deploy a second concept
  console.log('Deploying second concept....')
  // use ipfsHash for concept creation
  let txResultConcept2 = await conceptRegContract.methods.makeConcept([mewAddress], [500], 60 * 60 * 24, ipfsHash2, accounts[0]).send({from: accounts[0], gas: 3200000})
  // use the tx to get deployed concept address
  let concept2Address = txResultConcept2.events.ConceptCreation.returnValues._concept
  console.log('New concept created as child of mew concept at ' + concept2Address)
  let conceptContract2 = await new web3.eth.Contract(conceptArtifact.abi, concept2Address, {from: accounts[0]})
  console.log('Concept2 instantiated')

  console.log('\n### -- 4. List Concepts created from this Registry -- ###\n')

  // list all conceptCreation Events
  console.log('getting all ConceptRegistery events...')
  let pastevents = await conceptRegContract.getPastEvents({fromBlock: 0, toBlock: 'latest'})
  pastevents.forEach((e) => {
    console.log('*****************\n' + e.event + '\n' + 'blockNumber: ' + e.blockNumber)
  })

  console.log('\n### -- 5. Create Assessments on those 2 Concepts -- ###\n')

  // define constants for assessments
  const cost = 10
  const size = 5
  const endTime = 1000000000000
  const startTime = 1000000000
  const assesseeAddress = accounts[0]

  // check balance of assessee
  fathomTokenContract = await new web3.eth.Contract(fathomTokenArtifact.abi, fathomTokenArtifact.networks[net].address, {from: assesseeAddress})
  let assesseeInitialBalance = await fathomTokenContract.methods.balanceOf(assesseeAddress).call()
  console.log('Account 0 is : ' + accounts[0])
  console.log('Assessee initial AHA balance ' + Number(assesseeInitialBalance))
  let assesseeEthBalance = await web3.eth.getBalance(assesseeAddress)
  console.log('Assessee initial ETH balance ' + Number(assesseeEthBalance))

  // deploy 1 assessment from concept 1
  console.log('Creating first assessment....')
  let txResultAssessment1 = await conceptContract1.methods.makeAssessment(cost, size, startTime, endTime).send({from: assesseeAddress, gas: 3200000})
  // use token events to get assessment address
  let events1 = await fathomTokenContract.getPastEvents({fromBlock: 0, toBlock: 'latest'})
  const assessmentAddress1 = events1[events1.length - 1].returnValues.sender
  console.log('New assessment created on concept1 at address:' + assessmentAddress1)

  // deploy an assessment from concept 2
  console.log('Creating second assessment....')
  const txResultAssessment2 = await conceptContract2.methods.makeAssessment(cost, size, startTime, endTime).send({from: assesseeAddress, gas: 3200000})
  // use token events to get assessment address
  let events2 = await fathomTokenContract.getPastEvents({fromBlock: 0, toBlock: 'latest'})
  const assessmentAddress2 = events2[events2.length - 1].returnValues.sender
  console.log('New assessment deployed from concept1 at ' + assessmentAddress2)

  if (printGasAnalysis) {
    console.log('Gas cost')
    let proxied = false
    let toUpdate = proxied ? 'postProxy' : 'preProxy'
    web3.eth.getGasPrice()
      .then(function (gasPrice) {
        // filling in values from proxied and unproxied contracts
        let costs = {
          makeAssessment: {
            preProxy: { gasUsed: 2177785, ether: 0.0021777850000000002, dollar: 0.9081363450000001 },
            postProxy: { gasUsed: 481456, ether: 0.000481456, dollar: 0.200767152 },
            gain: 4.52333131168788
          },
          createConcept: {
            preProxy: { gasUsed: 3168506, ether: 0.003168506, dollar: 1.3212670020000001 },
            postProxy: { gasUsed: 319011, ether: 0.000319011, dollar: 0.133027587 },
            gain: 9.93227819730354
          },
          etherPrice: 417, // as of july 17 2018
          gasPrice: 1000000000 // safe low cost from eth gas station july 17 2018
          // gasPrice: gasPrice // makes only sense when on testnet
        }
        // filling in new values for whatever should be updated (see lines 135 & 136)
        costs.createConcept[toUpdate].gasUsed = txResultConcept1.gasUsed
        costs.createConcept[toUpdate].ether = txResultConcept1.gasUsed * web3.utils.fromWei(costs.gasPrice.toString(), 'ether')
        costs.createConcept[toUpdate].dollar = costs.createConcept.preProxy.ether * costs.etherPrice
        costs.makeAssessment[toUpdate].gasUsed = txResultAssessment1.gasUsed
        costs.makeAssessment[toUpdate].ether = txResultAssessment1.gasUsed * web3.utils.fromWei(costs.gasPrice.toString(), 'ether')
        costs.makeAssessment[toUpdate].dollar = costs.makeAssessment.preProxy.ether * costs.etherPrice
        costs.createConcept.gain = costs.createConcept.preProxy.gasUsed / costs.createConcept.postProxy.gasUsed
        costs.makeAssessment.gain = costs.makeAssessment.preProxy.gasUsed / costs.makeAssessment.postProxy.gasUsed
        console.log(costs)
      })
  }

  // Instantiating the assessment contracts...
  // let assessmentArtifact = require('./build/contracts/Assessment.json')
  // instanciate assessment contract 1
  // let assessmentContract1 = await new web3.eth.Contract(assessmentArtifact.abi, assessmentAddress1)
  // console.log('assessment1 instanciated')

  // instanciate assessment contract 2
  // let assessmentContract2 = await new web3.eth.Contract(assessmentArtifact.abi, assessmentAddress2)
  // console.log('assessment2 instanciated')
}

//setup ipfs api
    const ipfsAPI = require('ipfs-api');
    const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});


async function uploadDescriptionToIPFS(string){
  console.log("\n-------------- Storing string on IPFS : --------------")
  try {
    //Use a Buffer to send the string
      var ifpsBuffer = Buffer.from(string);
      console.log("String to be stored on IPFS : ",string)
    //use ipfs-api to add file
      let response= await ipfs.add([ifpsBuffer], {pin:false})

    //log path of stored file
                  let path=response[0].path
                  console.log("path of description : ",path)
    //verify that description is correctly stord and log it
                  let verif=await ipfs.get(path)
                  let decoded=verif[0].content.toString() 
                  console.log("Decoded string from IPFS : ",decoded)

                  // return hash of description to be stored on contract
                  console.log("-------------- string stored on IPFS --------------\n")
                  return path;
  } catch (e) {
        console.log('Error while uploading to ipfs:', e)
  }
}

let stringifiedJson1=JSON.stringify({
  "name":"Hol up... ",
  "description":description1,
  "learnMore":"https://www.youtube.com/watch?v=UX6K7waag5Q"
})

let stringifiedJson2=JSON.stringify({
  "name":"Hol up !",
  "description":description2,
  "learnMore":"https://www.youtube.com/watch?v=UX6K7waag5Q"
})

async function execute(){
  ipfsHash1= await uploadDescriptionToIPFS(stringifiedJson1)
  ipfsHash2= await uploadDescriptionToIPFS(stringifiedJson2)
  await create()
  console.log("done !")
  process.exit()
}

execute()