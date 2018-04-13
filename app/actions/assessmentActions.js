import {receiveVariable} from './async.js'

export function updateAssessmentsAndNotificationsFromFathomToken () {
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
    // NB: maybe we should add a condition to only update stage to a higher number, since notifications could come in the wrong order (could they?)
    pastNotifications.forEach((notification) => {
      switch (notification.returnValues.topic) {
        case '0':
          assessments[notification.returnValues.sender] = {assessee: userAddress, role: 'assessee', stage: 0}
          break
        case '1':
          assessments[notification.returnValues.sender] = {potAssessor: [userAddress], role: 'potAssessor', stage: 1}
          break
        case '2':
          assessments[notification.returnValues.sender] = {assessor: [userAddress], role: 'assessor', stage: 2}
          break
        case '3':
          assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender], stage: 3}
          break
        case '4':
          assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender], stage: 4}
          break
        case '5':
          assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender], stage: 5}
          break
        case '6':
          assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender], stage: 6}
          break
        case '7':
          assessments[notification.returnValues.sender] = {...assessments[notification.returnValues.sender], stage: 7}
          break
        default:
          break
      }
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
    let oldAssessments = getState().assessments

    var assessmentArtifact = require('../../build/contracts/Assessment.json')
    var conceptArtifact = require('../../build/contracts/Concept.json')
    let assessments = Object.assign({}, oldAssessments)

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

      // should this be necessary for the filtervIew? (we already have assessee knowledge IF the user is the assessee)
      // let assessee = await assessmentInstance.methods.assessee().call()

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
