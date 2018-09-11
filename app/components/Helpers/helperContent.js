export const barTopic = Object.freeze({
  Staking: 'Staking',
  Committing: 'Committing',
  Revealing: 'Revealing',
  ConfirmedStake: 'ConfirmedStake',
  ConfirmedCommit: 'ConfirmedCommit',
  ConfirmedReveal: 'ConfirmedReveal',
  FirstTimeMeetingPointSet: 'FirstTimeMeetingPointSet',
  MeetingPointChanged: 'MeetingPointChanged',
  ChallengePeriodActive: 'ChallengePeriodActive',
  Smues: 'Smues'
})

export const takeOverTopic = Object.freeze({
  UnlockMetaMask: 'UnlockMetaMask',
  AssessmentProcess: 'AssessmentProcess',
  NoMetaMask: 'NoMetaMask',
  EducateAboutMetaMask: 'EducateAboutMetaMask',
  UndeployedNetwork: 'UndeployedNetwork',
  AssessmentCreation: 'AssessmentCreation'
})

// this functions delivers simple one-liner explanations on given topics + a keyWord under which more can
// be learned
export function helperText (topic) {
  switch (topic) {
    case barTopic.Staking:
      return {
        title: 'What\'s staking?',
        text: 'Staking is where each Assessor needs to pay a small fee to assess you. It’s done so that they have “skin in the game” and are more likely to assess you fairly.',
        followUp: {
          target: takeOverTopic.AssessmentProcess
        }
      }
    case barTopic.ConfirmedStake:
      // not sure that this is what we want to do, just wanted to test the feedback on immediate action
      return {
        title: 'Awesome!',
        text: 'Now you just need to wait until there are enough other assessors and the assessment starts. If you\'re curious you can learn already learn what you need to do in the next stage: The commit-stage.',
        followUp: {
          target: barTopic.Committing
        }
      }
    case barTopic.Committing:
      return {
        title: 'What\'s committing?',
        text: 'This is were you rate the assessee. Give him 100 points if you think he is smüs.',
        followUp: {
          linkText: 'What the hell is "smüs"?',
          target: barTopic.Smues
        }
      }
    case barTopic.Smues:
      return {
        title: 'You\'re a curious person. Cool!',
        text: 'That\'s best explained by an example. Take this totally smüs sentence: "Is it smüs how saying sentences backwards creates backwards sentences saying how smüs it is? \n',
        followUp: {
          target: false
        }
      }
    default:
      if (topic) console.log('no helperText defined for topic', topic)
      return false
  }
}
