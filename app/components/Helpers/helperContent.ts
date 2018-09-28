import {ModalTopics} from '../../store/navigation/reducer'

export const modalTopic = Object.freeze({
  UnlockMetaMask: 'UnlockMetaMask',
  AssessmentProcess: 'AssessmentProcess',
  NoMetaMask: 'NoMetaMask',
  EducateAboutMetaMask: 'EducateAboutMetaMask',
  UndeployedNetwork: 'UndeployedNetwork',
  AssessmentCreation: 'AssessmentCreation'
})

type Modal = {
  title: string
  text: string
  followUp?: {
    target: ModalTopics
  }
}
// this functions delivers simple one-liner explanations on given topics + a keyWord under which more can
// be learned
// @params: topic can be a string OR an object with keys: topic and params (e.g. when one needs to create an assessment)
export function helperText (topic: ModalTopics):Modal {
  switch (topic) {
    case "UnlockMetaMask":
      return {
        title: 'MetaMask is locked',
        text: 'Please unlock Metamask by entering your password.\n',
        followUp: {
          target: "EducateAboutMetaMask" // again, this is just to test the link funcitonality
        }
      }
    case "NoMetaMask":
      return {
        title: topic,
        text: "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface"
      }
    case "EducateAboutMetaMask":
      return {
        title: topic,
        text: 'There is this cool thing called Metamask, we need so you can be safe and foxxy.'
      }
    case "UndeployedNetwork":
      return {
        title: topic,
        text: "You're connected to a network on which you haven't deployed contracts. Please use an appropriate script."
      }
    case "AssessmentProcess":
      return {
        title: topic,
        text: 'Here are some cool graphs and texts that show you how an assessment works'
      }
    case "AssessmentCreation":
      return {
        title: topic,
        text: 'Success! Your assessment has been created. Click this link (TODO) to view the details.'
      }
    case "AssessmentCreationFailed":
      return {
        title: topic,
        text: 'Ooopsi'
      }
    default:
      if (topic) console.log('no helperText defined for topic', topic)
      return {
        title: 'Error 404 Kinda',
        text: "You should'nt have got here"
      }
  }
}

// export const barTopic = Object.freeze({
//   Staking: 'Staking',
//   Committing: 'Committing',
//   Revealing: 'Revealing',
//   ConfirmedStake: 'ConfirmedStake',
//   ConfirmedCommit: 'ConfirmedCommit',
//   ConfirmedReveal: 'ConfirmedReveal',
//   FirstTimeMeetingPointSet: 'FirstTimeMeetingPointSet',
//   MeetingPointChanged: 'MeetingPointChanged',
//   ChallengePeriodActive: 'ChallengePeriodActive',
//   Smues: 'Smues'
// })

// // topics for the helperBar
//     case barTopic.Staking:
//       return {
//         title: 'What\'s staking?',
//         text: 'Staking is where each Assessor needs to pay a small fee to assess you. It’s done so that they have “skin in the game” and are more likely to assess you fairly.',
//         followUp: {
//           target: modalTopic.AssessmentProcess
//         }
//       }
//     case barTopic.ConfirmedStake:
//       // not sure that this is what we want to do, just wanted to test the feedback on immediate action
//       return {
//         title: 'Awesome!',
//         text: 'Now you just need to wait until there are enough other assessors and the assessment starts. If you\'re curious you can learn already learn what you need to do in the next stage: The commit-stage.',
//         followUp: {
//           target: barTopic.Committing
//         }
//       }
//     case barTopic.Committing:
//       return {
//         title: 'What\'s committing?',
//         text: 'This is were you rate the assessee. Give him 100 points if you think he is smüs.',
//         followUp: {
//           linkText: 'What the hell is "smüs"?',
//           target: barTopic.Smues
//         }
//       }
//     case barTopic.Smues:
//       return {
//         title: 'You\'re a curious person. Cool!',
//         text: 'That\'s best explained by an example. Take this totally smüs sentence: "Is it smüs how saying sentences backwards creates backwards sentences saying how smüs it is? \n'
//       }
