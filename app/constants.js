export const StageDisplayNames = Object.freeze({
  0: 'Open',
  1: 'Stake',
  2: 'Commit',
  3: 'Reveal',
  4: 'Done',
  5: 'Burned'
})

export const PassiveStageDisplayNames = Object.freeze({
  1: 'Staked',
  2: 'Committed',
  3: 'Revealed',
  4: 'Done',
  5: 'Burned'
})

export const Stage = Object.freeze({
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
})

export const LoadingStage = Object.freeze({
  None: 0,
  Loading: 1,
  Error: 3,
  Done: 4
})

export function networkName (id) {
  switch (id) {
    case 1:
      return 'Mainnet'
    case 3:
      return 'Ropsten'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return id.toString()
  }
}

export const NotificationTopic = Object.freeze({
  AssessmentCreated: 0,
  CalledAsAssessor: 1,
  ConfirmedAsAssessor: 2,
  AssessmentCancelled: 3,
  AssessmentStarted: 4,
  RevealScore: 5,
  TokensPaidOut: 6,
  AssessmentFinished: 7
})

export function helperScreens (topic) {
  switch (topic) {
    case 'Staking':
      return {
        title: 'What\'s staking?',
        text: 'Staking is where each Assessor needs to pay a small fee to assess you. It’s done so that they have “skin in the game” and are more likely to assess you fairly.',
        followUp: {
          linkText: 'And after that?',
          target: 'AfterStaking'
        }
      }
    case 'AfterStaking':
      return {
        title: 'After staking, you will be assessed',
        text: 'You designate a Meeting Point, like a chatroom and a time and date. Then, you & the Assessors meet. It looks like you haven’t set one yet, lets do it now, we’ll help you!',
        followUp: 'SetMeetingPoint'
      }
    case 'Committing':
      return {
        title: 'What\'s committing?',
        text: 'This is were you rate the assessee. Give him 100 points if you think he is smüs.',
        followUp: {
          linkText: 'What the hell is "smüs"?',
          target: 'smues'
        }
      }
    case 'smues':
      return {
        title: 'You\'re a curious person. Cool!',
        text: 'That\'s best explained by an example. Take this totally smüs sentence: "Is it smüs how saying sentences backwards creates backwards sentences saying how smüs it is? \n',
        followUp: {
          linkText: 'Oh, I see. totally smüs indeed...',
          target: false
        }
      }
    default:
      return false
  }
}
