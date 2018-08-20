let options = {}
options['-s'] = {
  'stage until to run the assessment': ['stake', 'commit', 'reveal (default)'],
  scores: 'a comma-separated string: e.g. 80,80,80,90,100 (default scores are all 100s)'
}
options['-a'] = 'assessment address to be used'
options['-c'] = 'concept on which to create the assessment'
let examples = {}
examples['node completeAssessment.js'] = 'creates and runs an assessment of size 5 until the end with all assessors scoring 1000'
examples['node completeAssessment.js -c 0x34... -s commit 0,0,0,0,60,60,60'] = 'will create a an assessment on the concept 0x34... of size 7 and run until the commit stage with the first four assessors commiting zero and the other three 60s '
examples['node completeAssessment.js -a 0x34... -s stake'] = 'will use the existing assessment at address 0x34... and make the needed number of assessors stake '

// if no scores are passed as args, a defualt score of 100 will be used by every assessor
// Currently, this only works for the testnet!
var ethereumjsABI = require('ethereumjs-abi')
let {ConceptRegistry, Assessment, Concept, FathomToken} = require('fathom-contracts')

let Stage = Object.freeze({
  create: 0,
  stake: 1,
  commit: 2,
  reveal: 3
})

let runUntil = Stage.reveal
let conceptAddress
let assessmentAddress
let size = 5
let scores
let validArgs = true

// process command line args:
if (process.argv.length > 2) {
  for (let i = 2; i <= 3; i += 2) {
    switch (process.argv[i]) {
      case ('-s'):
        switch (process.argv[i + 1]) {
          case ('stake'):
            runUntil = Stage.stake
            break
          case ('commit'):
            runUntil = Stage.commit
            if (process.argv[i + 2]) {
              scores = process.argv[i + 2].split(',').filter(word => word !== '').map(x => Number(x))
              size = scores.length
            }
            break
          default:
            runUntil = Stage.reveal
            if (process.argv[i + 2]) {
              scores = process.argv[i + 2].split(',').filter(word => word !== '').map(x => Number(x))
              size = scores.length
            }
        }
        break
      default:
        console.log('Error: Unrecognized option. ', process.argv[i])
        console.log('Valid options are:', options)
        console.log('Examples:\n', examples)
        validArgs = false
    }
  }
}

function evmIncreaseTime (web3, seconds) {
  return new Promise(function (resolve, reject) {
    return web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: new Date().getTime()
    }, function (error, result) {
      return error ? reject(error) : resolve(result.result)
    })
  })
}

function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

//setup ipfs api
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

async function uploadDescriptionToIPFS (string) {
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

async function test () {
  let conceptRegContract
  let fathomTokenContract
  let assessmentContract
  let conceptContract
  let provider
  // const Eth = require('ethjs');
  const Web3 = require('web3')

  // detect network and declare variables accordingly
  provider = 'http://localhost:8545'
  const web3 = new Web3(provider)
  const eth = web3.eth

  let accounts = await eth.getAccounts()
  let net = await eth.net.getId()
  // log deployed contracts

  // Instanciate Concept Registry
  let conceptRegAddress = ConceptRegistry.networks[net].address
  conceptRegContract = await new web3.eth.Contract(ConceptRegistry.abi, conceptRegAddress, {from: accounts[0]})

  let mewAddress = await conceptRegContract.methods.mewAddress().call()

  // check whether to create a concept or not
  console.log('Creating new concept....')
  // stringify data for this concept
  const stringifiedJson = JSON.stringify({
    name:"Monkeying",
    description:"just foolin around...",
    learnMore:"https://www.youtube.com/watch?v=b6m-XlOxjbk"
  })
  const conceptDataHash= await uploadDescriptionToIPFS(stringifiedJson)
  let encryptedHash = '0x' + (Buffer.from(conceptDataHash, 'utf8')).toString('hex')
  let txResultConcept1 = await conceptRegContract.methods.makeConcept([mewAddress], [500], 60 * 60 * 24, encryptedHash, accounts[0]).send({from: accounts[0], gas: 3200000})
  // use the tx to get deployed concept address
  conceptAddress = txResultConcept1.events.ConceptCreation.returnValues._concept
  console.log('New concept created as child of mew concept at ' + conceptAddress)

  // Create assessments on concept
  conceptContract = await new web3.eth.Contract(Concept.abi, conceptAddress, {from: accounts[0]})
  // define constants for assessments
  console.log('Creating assessment....')
  const cost = 1e9
  const endTime = 7 * 24 * 3600
  const startTime = 3 * 24 * 3600
  let assessee = accounts[0]

  // create an assessment on concept
  await conceptContract.methods.makeAssessment(cost, size, startTime, endTime).send({from: assessee, gas: 3200000})
  // use token events to get assessment address
  fathomTokenContract = await new web3.eth.Contract(FathomToken.abi, FathomToken.networks[net].address, {from: accounts[0]})
  let events = await fathomTokenContract.getPastEvents({fromBlock: 0, toBlock: 'latest'})
  assessmentAddress = events[events.length - 1].returnValues.sender
  console.log('New assessment with size', size, 'and cost', cost, ' created at address: ' + assessmentAddress)


  // run assessment
  assessmentContract = await new web3.eth.Contract(Assessment.abi, assessmentAddress, {from: accounts[0]})
  // console.log('assessmentContract ', assessmentContract )
  let assessors = accounts.slice(1, size + 1)

  // confirm
  if (runUntil >= Stage.stake) {
    try {
      for (let i in assessors) {
        await assessmentContract.methods.confirmAssessor().send({from: assessors[i], gas: 3200000})
      }
      console.log('staked...')
    } catch (e) {
      console.log('Staking failed:', e.toString().substring(0, 200), '...')
    }
  } else {
    console.log('assessors 0 ', assessors[0], ' does confirm, but then the rest fails!')
    await assessmentContract.methods.confirmAssessor().send({from: assessors[0], gas: 3200000})
    console.log('travelling in time: to the future!!!')
    evmIncreaseTime(web3, startTime * 2)
  }

  // commit
  if (runUntil >= Stage.commit) {
    await evmIncreaseTime(web3, 60)
    if (!scores) {
      scores = new Array(size).fill(100)
    }
    try {
      for (let i in assessors) {
        await assessmentContract.methods.commit(hashScoreAndSalt(scores[i], 'hihi')).send({from: assessors[i], gas: 3200000})
      }
      console.log('committed with scores', scores, ' ...')
    } catch (e) {
      console.log('Committing failed:', e.toString().substring(0, 200), '...')
    }
  } else {
    console.log('assessor 0 ', assessors[0], ' does commit, but then the rest fails!')
    let tx = await assessmentContract.methods.commit(hashScoreAndSalt(80, 'hihi')).send({from: assessors[0], gas: 3200000})
    console.log('tx', tx)
    console.log('travelling in time: to the future!!!')
    evmIncreaseTime(web3, (endTime + startTime) * 2)
  }

  // reveal
  if (runUntil >= Stage.reveal) {
    await evmIncreaseTime(web3, 60 * 60 * 13) // let 12h challenge period pass
    try {
      for (let i in assessors) {
        await assessmentContract.methods.reveal(scores[i], 'hihi').send({from: assessors[i], gas: 3200000})
      }
      console.log('revealed...')
    } catch (e) {
      console.log('Revealing failed:', e.toString().substring(0, 200), '...')
    }
  } else {
    console.log('assessors 0 ', assessors[0], ' does reveal, but then the rest fails!')
    console.log('travelling in time: to the future!!!')
    evmIncreaseTime(web3, (endTime + startTime) * 2)
  }

  let finalScore = await assessmentContract.methods.finalScore().call()
  console.log('finalScore: ', runUntil >= Stage.reveal ? finalScore : 'TBD')
}
if (validArgs) {
  test()
}
