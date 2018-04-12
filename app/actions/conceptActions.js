
export function confirmAssessor (address) {
	return async (dispatch, getState) => {
	  let w3 = getState().connect.web3
	  let userAddress = getState().connect.userAddress
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
