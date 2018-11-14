import { Stage, TimeOutReasons, StageDisplayNames, networkName, CompletedStages } from './constants'
let { Assessment, Concept, FathomToken, ConceptRegistry } = require('fathom-contracts')

function getContractInstance (web3, abi, contractAddress) {
  return new web3.eth.Contract(abi, contractAddress)
}

export const convertDate = (unixTimestamp) => {
  let date = new Date(unixTimestamp * 1000) // input in milliseconds
  // return date.toDateString()
  return date.toLocaleString()
}

export const getBlockDeployedAt = {

  fathomToken: async (state) => {
    let networkID = await state.ethereum.web3.eth.net.getId()
    let deployTx = FathomToken.networks[networkID].transactionHash
    let tx = await state.ethereum.web3.eth.getTransaction(deployTx)
    return tx.blockNumber
  },

  conceptRegistry: async (state) => {
    let networkID = await state.ethereum.web3.eth.net.getId()
    let deployTx = ConceptRegistry.networks[networkID].transactionHash
    let tx = await state.ethereum.web3.eth.getTransaction(deployTx)
    return tx.blockNumber
  }
}

export const getInstance = {

  assessment: (state, contractAddress) => getContractInstance(state.ethereum.web3, Assessment.abi, contractAddress),

  concept: (state, contractAddress) => getContractInstance(state.ethereum.web3, Concept.abi, contractAddress),

  fathomToken: (state) => {
    if (FathomToken.networks[state.ethereum.networkID] && FathomToken.networks[state.ethereum.networkID].address) {
      return getContractInstance(
        state.ethereum.web3,
        FathomToken.abi,
        FathomToken.networks[state.ethereum.networkID].address
      )
    } else {
      return {error: true}
    }
  },

  conceptRegistry: (state) => {
    return getContractInstance(
      state.ethereum.web3,
      ConceptRegistry.abi,
      ConceptRegistry.networks[state.ethereum.networkID].address
    )
  }
}

export function hmmmToAha (aha) {
  return Math.round(Number(aha) / 1e9)
}

// convert score UI/SmartContracts

export function convertFromOnChainScoreToUIScore (x) {
  return (x + 100) / 2
}

export function convertFromUIScoreToOnChainScore (x) {
  return (x * 2) - 100
}

// This function takes an assessment object and returns the status of the user (what is required to do)

export function userStatus (assessment) {
  let status = 'Stake'

  // First let's determine if the assessment failed
  if (assessment.violation) {
    let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned
    status = userFault ? 'Closed' : assessment.refunded ? 'Refunded' : 'Refund'

    // Else, let's use the assessment stages to determine what to display
  } else if (assessment.userStage === Stage.None) {
    // this is when the user is assessee is not required to take actions on the assessment
    status = 'View'
  } else if (assessment.stage < Stage.Done && assessment.userStage === assessment.stage) {
    // 'Active' status: this means the user is required to take an action
    status = StageDisplayNames[assessment.stage]
  } else {
    // 'Completed' stages : user is waiting for other assessors to take action to move on to the next stage (assessment.userStage > assessment.stage)
    status = CompletedStages[assessment.stage]
  }
  return status
}

/*
returns the message to be displayed on the assessment Card and DetailView, which is different depending on
whether the user needs to be active, the assessment was cancelled and the phase of the assessment
*/
export function statusMessage (isAssessee, assessment, transactions = []) {
  let actionRequired = assessment.stage === assessment.userStage && assessment.stage !== Stage.Done
  let nOtherAssessorsToBeActive = assessment.size - (assessment.stage === Stage.Called ? assessment.assessors.length : assessment.done) - (actionRequired ? 1 : 0)
  let status = ''
  console.log()
  // assessment Failed?
  if (assessment.violation) {
    if (assessment.userStage >= Stage.Confirmed && actionRequired) {
      status += 'The assessment failed because you didn\'t ' + StageDisplayNames[assessment.stage] + '. Your fee has been burned.'
    } else {
      // other assessors are at fault
      let nFailedAssessors = assessment.size ? (assessment.size - assessment.done).toString() : 'some'
      status += 'The assessment failed because '
      if (assessment.violation === TimeOutReasons.NotEnoughAssessors) {
        status += 'less than 5 assessors staked.'
      } else if (assessment.violation === TimeOutReasons.NotEnoughCommits) {
        status += nFailedAssessors + ' assessors didn\'t commit in time.'
      } else {
        status += nFailedAssessors + ' assessors didn\'t reveal their scores.'
      }
      if (assessment.refunded && (assessment.userStage > Stage.Called || isAssessee)) {
        status += ' Your fee has been refunded.'
      }
    }
  } else {
    // assessment is completed ?
    if (assessment.stage === Stage.Done) {
      // display payout (or score)?
      if (!isAssessee) {
        let gain = assessment.payout - assessment.cost
        status = 'You risked ' + assessment.cost + ' and earned ' + (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA'
      } else {
        // user is assessee -> display score
        status += 'You finished with a score of ' + assessment.finalScore + ' %'
      }
    } else if (!actionRequired) {
      // assessment not done, but user must not do something
      status += `Waiting for ${nOtherAssessorsToBeActive} remaining assessors to ${StageDisplayNames[assessment.stage]}.`
    } else {
      // assessment not done because user (and others) need to do something
      // user must do something (or has done something which is awaiting confirmation)
      // no idea why the commented out comparison in the next line is failing,
      // but we don't really need it as when the tx is confirmed this else clause will not be reached
      let txToChangeState = transactions.filter(x => x.data === assessment.stage) // && x.status === 'Tx Published' )
      if (txToChangeState.length > 0) {
        status = 'Awaiting confirmation...'
      } else {
        status += 'Waiting for you and ' + nOtherAssessorsToBeActive + ' assessors to ' + StageDisplayNames[assessment.stage]
      }
    }
  }
  return status
}

// map assessment stage (range [0,5] , cf constant.js file) to ProgressDots steps (range[1,4] for assessments)
export function mapAssessmentStageToStep (assessmentStage) {
  if (assessmentStage === 0 || assessmentStage === 1) {
    return 1
  } else {
    return assessmentStage
  }
}

export const getLocalStorageKey = (networkID, userAddress, web3) => {
  // the address of the FathomToken is appended so that redeployments on a local
  // testnet do not show assessment from earlier migrations
  return 'State' + networkName(networkID) + userAddress + FathomToken.networks[networkID].address
}

// Infura related

// jlm's token for the fathom-app
const appInfuraToken = '9eb575d245744c979ba3530967d0e787'

export function infuraEndpoint (networkID) {
  switch (networkID) {
    case 1:
      return 'wss://mainnet.infura.io/ws/' + appInfuraToken
    case 3:
      return 'wss://ropsten.infura.io/ws/' + appInfuraToken
    case 4:
      return 'wss://rinkeby.infura.io/ws/' + appInfuraToken
    case 42:
      return 'wss://kovan.infura.io/ws/' + appInfuraToken
    default:
      return 'ws://localhost:8545/'
  }
}
