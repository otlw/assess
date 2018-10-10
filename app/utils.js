import { Stage, TimeOutReasons, StageDisplayNames, networkName } from './constants'
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

// maps (assessmentStage, userStage, violation, step) => status (active,complete,inactive,canceled)
// TODO use this function in assessmentCard & assessmentView
export function mapAssessmentStageToStatus (assessmentStage, userStage, violation, step) {
  let actionRequired = assessmentStage === userStage && assessmentStage !== Stage.Done

  // check whether the assessment was aborted
  if ((violation === TimeOutReasons.NotEnoughAssessors && step === Stage.Called) ||
      (violation === TimeOutReasons.NotEnoughCommits && step === Stage.Confirmed) ||
      (violation === TimeOutReasons.NotEnoughReveals && step === Stage.Committed)) {
    return 'failed'
  }
  // it was not a violation! see whether the step has been completed:
  if (assessmentStage > step || assessmentStage === Stage.Done) {
    return 'complete'
  }
  // see whether the stage is still ongoing and requires user input:
  if (assessmentStage === step && actionRequired) {
    return 'active'
  }
  // or whether the stage is the last one -> no user action required
  if (assessmentStage === Stage.Done) {
    return 'complete'
  }
  // DEFAULT: the step is on, but the user must no longer do anything
  return 'inactive'
}

export const getLocalStorageKey = (networkID, userAddress, web3) => {
  // the address of the FathomToken is appended so that redeployments on a local
  // testnet do not show assessment from earlier migrations
  return 'State' + networkName(networkID) + userAddress + FathomToken.networks[networkID].address
}

export const saveState = (state) => {
  if (state.ethereum.isConnected) {
    try {
      let stateToSave = {
        assessments: state.assessments,
        concepts: state.concepts,
        lastUpdatedAt: state.ethereum.lastUpdatedAt,
        deployedConceptRegistryAt: state.ethereum.deployedConceptRegistryAt,
        deployedFathomTokenAt: state.ethereum.deployedFathomTokenAt
      }
      let key = getLocalStorageKey(state.ethereum.networkID, state.ethereum.userAddress, state.ethereum.web3)
      const serializedState = JSON.stringify(stateToSave)
      localStorage.setItem(key, serializedState) // eslint-disable-line no-undef
    } catch (err) {
      console.log('error saving state', err)
    }
  } else {
    console.log('do not store Store yet')
  }
}
