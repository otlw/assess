import { Stage } from './constants.js'
let { Assessment, Concept, FathomToken, ConceptRegistry } = require('fathom-contracts')

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

// define whether or not a helper Screen should be chosen and if so, which one.
// TODO define more cases that return a key and their correspondant texts in constans.js
export function showScreen (currentScreen, visits, location, params) {
  // when visiting the assessmentView from another place / the first time on the page
  if (location === 'assessmentView') {
    if (visits.site === 0) {
      // e.g.
      // if (params.assessment.assessee === params.userAddress) return 'FirstTimeAsAssessee'
      if (params.assessment.userStage === Stage.Called) return 'Staking'
    } else {
      return 'none'
    }
    // when completing a stage action
  } else if (location === 'Staked') return 'none'
  else if (location === 'Committed') return 'none'
  else if (location === 'Revealed') return 'none'
  // when setting a meeting point
  else if (location === 'StoredMeetingPoint') {
    // for the first time
    if (params.previousMeetingPointExisted) return 'none'
    // or updating it
    else return 'none'
  // default case
  } else return 'none'
}
