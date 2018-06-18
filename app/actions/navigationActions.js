export const SET_DASHBOARD_TAB = 'SET_DASHBOARD_TAB'
export const SET_MAIN_DISPLAY = 'SET_MAIN_DISPLAY'

export function setDashboardTab (tab) {
  if (tab === 'Past' ||
    tab === 'Current' ||
    tab === 'Potential') {
    return {
      type: SET_DASHBOARD_TAB,
      tab
    }
  } else {
    throw Error('Invalid dashboard tab selected: ', tab)
  }
}

export function setMainDisplay (mainDisplay) {
    return {
      type: SET_MAIN_DISPLAY,
      mainDisplay
    }
}
