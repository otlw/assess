import { NavigationState, VisitState } from './reducer'

export type Action =
  ReturnType<typeof setDashboardTab> |
  ReturnType<typeof setModal> |
  ReturnType<typeof setHelperBar> |
  ReturnType<typeof setInputBar> |
  ReturnType<typeof toggleHidden> |
  ReturnType<typeof addVisit> |
  ReturnType<typeof receiveVisitHistory>
  // ReturnType<typeof saveProgression>


export function setDashboardTab (dashboardTab: NavigationState['dashboardTab']) {
  let type: 'SET_DASHBOARD_TAB' = 'SET_DASHBOARD_TAB'
  return {
    type,
    dashboardTab
  }
}

export function setModal (modal: NavigationState["modal"]) {
  let type:'SET_MODAL' = 'SET_MODAL'
  return {
    type,
    modal
  }
}

export function setHelperBar (helperBar: NavigationState["helperBar"]) {
  let type:'SET_HELPERBAR' = 'SET_HELPERBAR'
  return {
    type,
    helperBar
  }
}

export function setInputBar (inputBar: NavigationState['inputBar']) {
  let type:'SET_INPUT_BAR' = 'SET_INPUT_BAR'
  return {
    type,
    inputBar
  }
}

export function toggleHidden() {
  let type: 'TOGGLE_HIDDEN_CARDS' = 'TOGGLE_HIDDEN_CARDS'
  return {type}
}

export function addVisit() {
    let type:'ADD_VISIT' = 'ADD_VISIT'
    return {
        type
    }
}

export function receiveVisitHistory (visits:VisitState) {
  let type:'RECEIVE_VISIT_HISTORY' = 'RECEIVE_VISIT_HISTORY'
  return {
    type,
    visits
  }
}

// export function saveProgression (role:string, stage:) {
//     let type:'SAVE_PROGRESSSION' = 'SAVE_PROGRESSSION'
//     return {
//         type,
//         role,
//         stage
//     }
// }
