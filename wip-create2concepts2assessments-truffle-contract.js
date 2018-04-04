// this is an atempt to use truffle-contract module. Still WIP...

// specify network as first argument

let conceptRegABI = require('./build/contracts/ConceptRegistry.json')
let conceptRegAddress
let conceptRegContract

let conceptABI = require('./build/contracts/Concept.json')
let conceptAddress
let conceptContract

let ahaABI = require('./build/contracts/FathomToken.json')
let ahaAddress
let ahaContract

let provider

const network = process.argv[2]

const contract = require('truffle-contract')

async function test () {
  // const Eth = require('ethjs');
  const Web3 = require('web3')

  // detect network and declare variables accordingly
  if (network == 'rinkeby') {
    // use rinkeby
    let truffleConfig = await require('./truffle.js')
    provider = await truffleConfig.networks.rinkeby.provider // new Web3.providers.HttpProvider('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')//await truffleConfig.networks.rinkeby.provider //'https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7' //new Eth.HttpProvider('https://rinkeby.infura.io')
  } else {
    // use Ganache by default (last deployed contract version)
    let networkValues = Object.values(conceptRegABI.networks)
    let networkKeys = Object.keys(conceptRegABI.networks)
    provider = 'http://localhost:8545' // new Web3.HttpProvider('http://localhost:8545')
  }
  // const eth = new Eth(provider);
  const web3 = new Web3(provider)
  const eth = web3.eth

  var nInitialUsers = 6
  var gasPrice = 1000000000 // safe low cost
  var etherPrice = 460 // as of 11/17

  // log accounts
  let accounts = await eth.getAccounts()
  if (accounts.length === 0) {
    // if not on testnet
    const setup = require('./initialMembers.json')
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
  console.log(conceptRegABI.networks)
  // set contract address from ABI
  conceptRegAddress = conceptRegABI.networks[net].address
  console.log('Concept registery Address is : ' + conceptRegAddress)
  // instantiate contracts
  let conceptreginstance = await contract(conceptRegABI.abi)
  conceptreginstance.setProvider(provider)
  console.log('instanciated concept reg')
  conceptRegContract = await conceptreginstance.deployed() // .at(conceptRegAddress) //await new web3.eth.Contract(conceptRegABI.abi,conceptRegAddress,{from:accounts[0]})
  console.log('deployed() success')
  let mewAddress = await conceptRegContract.mewAddress()
  console.log('MEW address is :')
  console.log(mewAddress)

  // deploy one concept
  let txResultConcept1 = await conceptRegContract.methods.makeConcept([mewAddress], [500], 60 * 60 * 24, '0x', accounts[0]).send({from: accounts[0], gas: 3200000})
  console.log('txResultConcept1')
  let concept1Address = txResultConcept1.events.ConceptCreation.address
  console.log('New concept deployed from mew concept at ' + concept1Address)
  conceptContract1 = await new web3.eth.Contract(conceptABI.abi, concept1Address, {from: accounts[0]})
  console.log('concept1 instanciated')

  // deploy a second concept
  let txResultConcept2 = await conceptRegContract.methods.makeConcept([mewAddress], [500], 60 * 60 * 24, '0x', accounts[0]).send({from: accounts[0], gas: 3200000})
  let concept2Address = txResultConcept2.events.ConceptCreation.address
  console.log('New concept deployed from mew concept at ' + concept2Address)
  conceptContract2 = await new web3.eth.Contract(conceptABI.abi, concept2Address, {from: accounts[0]})
  console.log('concept2 instanciated')

  // define constants for assessments
  const cost = 10
  const size = 6
  const endTime = 1000000000000
  const startTime = 1000000000
  const assesseeAddress = accounts[size]

  // check balance of assessee
  const ahaContract = await new web3.eth.Contract(ahaABI.abi, ahaABI.networks[net].address, {from: accounts[0]})
  assesseeInitialBalance = await ahaContract.methods.balanceOf(assesseeAddress).call()
  console.log('Assessee initial AHA balance ' + Number(assesseeInitialBalance))
  let assesseeEthBalance = await web3.eth.getBalance(assesseeAddress)
  console.log('Assessee initial ETH balance ' + Number(assesseeEthBalance))

  // deploy 1 assessment from concept 1 ---- 150000 6 100 10000 { from: '0xd6edda2a82fa51ac605e263a6c39394a59091de2' }
  const txResultAssessment1 = await conceptContract1.methods.makeAssessment(cost, size, startTime, endTime).send({from: assesseeAddress, gas: 3200000})
  console.log(txResultAssessment1.events)
}
test()

// ETHJS-CONTRACT
// var EthContract = require("ethjs-contract");
// const contract = new EthContract(w3.eth);
// var contractModel=await contract(metaAbi.abi)
// var contractInstance=await contractModel.at(contractAddress)
// console.log("ethjs contract instanciated")

// truffle-contract
// var contract = require("truffle-contract");
// var contractModel=await contract(metaAbi)
// await contractModel.setProvider(w3.currentProvider)
// var contractInstance=await contractModel.at(contractAddress)
