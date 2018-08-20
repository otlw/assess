let { Assessment, Concept, FathomToken, ConceptRegistry } = require('fathom-contracts')
import { Stage, TimeOutReasons, StageDisplayNames } from './constants.js'
import h from 'react-hyperscript'

function getContractInstance (web3, abi, address) {
  return new web3.eth.Contract(abi, address)
}

export const convertDate = (unixTimestamp) => {
  let date = new Date(unixTimestamp * 1000) // input in milliseconds
  return date.toDateString()
}

export const getInstance = {
  assessment: (state, address) => getContractInstance(state.ethereum.web3, Assessment.abi, address),
  concept: (state, address) => getContractInstance(state.ethereum.web3, Concept.abi, address),
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
export function statusMessage (isAssessee, assessment) {
  let actionRequired = assessment.stage === assessment.userStage && assessment.stage !== Stage.Done
  let status = ''
  console.log()
  // assessment Failed?
  if (assessment.violation) {
    if (assessment.userStage >= Stage.Confirmed && actionRequired) {
      status += 'The assessment failed because you didn\'t ' + StageDisplayNames[assessment.stage] + '. Your fee has been burned.'
    } else {
      // other assessors are at fault
      let nFailedAssessors = (assessment.size - assessment.done).toString()
      status += 'The assessment failed because '
      if (assessment.violation === TimeOutReasons.NotEnoughAssessors) {
        status += 'less than 5 assessors staked.'
      } else if (assessment.violation === TimeOutReasons.NotEnoughCommits) {
        status += nFailedAssessors + ' assessors didn\'t commit in time.'
      } else {
        status += nFailedAssessors + ' assessors didn\'t reveal their scores.'
      }
      if (assessment.refunded) {
        status += ' Your fee has been refunded.'
      }
    }
  } else {
    // assessment is completed ?
    if (assessment.stage === Stage.Done) {
      // display payout (or score)?
      if (!isAssessee) {
        let gain = assessment.payout - assessment.cost
        status = h('div', [
          h('div', 'Payout :'),
          h('div', (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
        ])
      } else {
        // user is assessee -> display score
        status = h('div', [
          h('div', 'Score :'),
          h('div', assessment.finalScore + ' %')
        ])
      }
    } else if (!actionRequired) {
      // assessment not done, but user must not do something
      status += 'Waiting...'
    } else {
      // assessment not done because user (and others) need to do something
      let nOtherAssessorsToBeActive = assessment.size - assessment.done - (actionRequired ? 1 : 0)
      // user must do something
      status += 'Waiting for you and ' + nOtherAssessorsToBeActive + ' assessors to ' + StageDisplayNames[assessment.stage]
    }
  }
  return status
}

