import {receiveVariable} from './async.js'

export function fetchAssessmentsAndNotificationsFromFathomToken () {
  return async (dispatch, getState) => {
    // get State data
    let w3 = getState().web3
    let userAddress = getState().userAddress
    let networkID = await getState().networkID
    let assessments = getState().assessments

    // get notification events from fathomToken contract
    const fathomTokenArtifact = require('../../build/contracts/FathomToken.json')
    const abi = fathomTokenArtifact.abi
    let fathomTokenAddress = fathomTokenArtifact.networks[networkID].address

    // instanciate Concept registery Contract
    const fathomTokenInstance = await new w3.eth.Contract(abi, fathomTokenAddress)
    // filter notifications meant for the user
    let pastNotifications = await fathomTokenInstance.getPastEvents('Notification', {filter: {user: userAddress}, fromBlock: 0, toBlock: 'latest'})

    // update assessment object acording to notification 'topic', ie stage (see FathomToken.sol in contracts folder)
    pastNotifications.forEach((notification) => {
      //fetch old version of the assessment, if it exists
      let stage=Number(notification.returnValues.topic)
      let role=""
      if (assessments[notification.returnValues.sender]){
        stage=assessments[notification.returnValues.sender].stage
        role=assessments[notification.returnValues.sender].role
      }

      //update user role if relevant
      if (notification.returnValues.topic==="0"){
        role="assessee"
      } else if ((notification.returnValues.topic==="1")&&notification.returnValues.role!=="assessor"){
        role="potAssessor"
      } else if (notification.returnValues.topic==="2"){
        role="assessor"
      }

      //update stage if bigger than the current one
      if (Number(notification.returnValues.topic)>stage){
        stage=Number(notification.returnValues.topic)
      }

      //assign all new fields to the assessments object
      assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender],role, stage}
    })
    dispatch(receiveVariable('assessments', assessments))
    // this is for when we need to show more than just the address
    dispatch(getAssessmentDataFromContracts())
  }
}

export function getAssessmentDataFromContracts () {
  return async (dispatch, getState) => {
    // get necessary data
    let w3 = getState().web3
    let assessments = Object.assign({}, getState().assessments)

    var assessmentArtifact = require('../../build/contracts/Assessment.json')
    var conceptArtifact = require('../../build/contracts/Concept.json')

    // get all assessment addresses
    let listOfAssessmentAddresses = Object.keys(assessments)

    // process them
    let count = 0
    listOfAssessmentAddresses.forEach(async (address) => {
      // get info from assessment
      let assessmentInstance = new w3.eth.Contract(assessmentArtifact.abi, address)
      let cost = await assessmentInstance.methods.cost().call()
      let size = await assessmentInstance.methods.size().call()
      let startTime = await assessmentInstance.methods.checkpoint().call()
      let endTime = await assessmentInstance.methods.endTime().call()
      let conceptAddress = await assessmentInstance.methods.concept().call()

      // get data from associated concept
      let conceptInstance = new w3.eth.Contract(conceptArtifact.abi, conceptAddress)
      let conceptData = await conceptInstance.methods.data().call()
      if (conceptData) {
        conceptData = Buffer.from(conceptData.slice(2), 'hex').toString('utf8')
      } else {
        conceptData = 'No Data in this Concept'
      }

      // push the final object
      assessments[address] = {...assessments[address],
        address,
        cost,
        size,
        startTime,
        endTime,
        conceptAddress,
        conceptData
      }

      // the count could be replaced by a Promise.all : what do you prefer?
      count++
      if (listOfAssessmentAddresses.length === count) {
        dispatch(receiveVariable('assessments', assessments))
      }
    })
  }
}
