var ethereumjsABI = require('ethereumjs-abi')

export function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

export function confirmAssessor (address) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // / this is were a status should be set to "pending...""
	  let tx = await assessmentInstance.methods.confirmAssessor().send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}

export function commit (address, score, salt) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // this is were a status should be set to "pending...""
    // also salt should be saved in state
	  let tx = await assessmentInstance.methods.commit(
      hashScoreAndSalt(score, salt)
    ).send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}

export function reveal (address, score, salt) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // / this is were a status should be set to "pending...""
	  let tx = await assessmentInstance.methods.reveal(score, salt).send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}
