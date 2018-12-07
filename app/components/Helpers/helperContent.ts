import { ModalTopics, helperBarTopic } from '../../store/navigation/reducer'

export const modalTopic = Object.freeze({
  UnlockMetaMask: 'UnlockMetaMask',
  AssessmentProcess: 'AssessmentProcess',
  NoMetaMask: 'NoMetaMask',
  EducateAboutMetaMask: 'EducateAboutMetaMask',
  UndeployedNetwork: 'UndeployedNetwork',
  AssessmentCreation: 'AssessmentCreation',
  AssessmentCreationFailed: 'AssessmentCreationFailed'
})

type helperBarTopics={
  Staking: helperBarTopic,
  Committing: helperBarTopic,
  Revealing: helperBarTopic,
  ConfirmedStake: helperBarTopic,
  ConfirmedCommit: helperBarTopic,
  ConfirmedReveal: helperBarTopic,
  FirstTimeMeetingPointSet: helperBarTopic,
  MeetingPointChanged: helperBarTopic,
  ChallengePeriodActive: helperBarTopic,
  Smues: helperBarTopic
}

export const helperBarTopic:helperBarTopics = Object.freeze({
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

type Modal = {
  title: string
  text: string
  followUp?: {
    target: ModalTopics
  }
}

type helperBar = {
  title: string
  text: string
  learnMore?: {
    target: ModalTopics
  }
}

// this functions delivers simple one-liner explanations on given topics + a keyWord under which more can be learned
export function modalText (topic: ModalTopics): Modal | null {
  switch (topic) {
  case 'UnlockMetaMask':
    return {
      title: 'MetaMask is locked',
      text: 'Please unlock Metamask by entering your password.\n',
      followUp: {
        target: 'EducateAboutMetaMask' // again, this is just to test the link funcitonality
      }
    }
  case 'NoMetaMask':
    return {
      title: topic,
      text: "You don't have the MetaMask.\n Please download it from https://metamask.io/ to continue."
    }
  case 'EducateAboutMetaMask':
    return {
      title: topic,
      text: 'MetaMask is a digital wallet that allows you to use Ethereum. We use MetaMask to create your assessments for you. You can learn more about it at their website: https://metamask.io/'
    }
  case 'UndeployedNetwork':
    return {
      title: topic,
      text: "You're connected to a network on which you haven't deployed contracts. Please use an appropriate script."
    }
  case 'AssessmentProcess':
    return {
      title: topic,
      text: 'Here are some cool graphs and texts that show you how an assessment works'
    }
  case 'AssessmentCreation':
    return {
      title: topic,
      text: 'Success! Your assessment has been created.'
    }
  case 'AssessmentCreationFailed':
    return {
      title: topic,
      text: 'Your assessment has failed.'
    }
  case 'Smues':
    return {
      title: 'You want to know what smüs means?',
      text: 'That\'s best explained by an example. Take this totally smüs sentence: "Is it smüs how saying sentences backwards creates backwards sentences saying how smüs it is? \n'
    }
  case null:
    return null
  default:
    if (topic) console.log('no modalText defined for topic', topic)
    return {
      title: 'Error 404',
      text: "You should'nt have got here!"
    }
  }
}

export function helperBarText (topic: helperBarTopics): helperBar {
  switch (topic) {
  case 'Staking':
    return {
      title: 'Staking',
      text: ' is where each Assessor needs to pay a small fee to assess you.',
      learnMore: {
        target: 'AssessmentProcess'
      }
    }
  case 'ConfirmedStake':
    // not sure that this is what we want to do, just want to test the feedback on immediate action
    return {
      title: 'Great',
      text: ',now we need 5 assessors to stake for the assessment to start.',
      learnMore: {
        target: 'AssessmentProcess'
      }
    }
  case 'Committing':
    return {
      title: 'Committing',
      text: 'is when you commit your score of the assessee out of 100.',
      learnMore: {
        target: 'Smues'
      }
    }
  case 'FirstTimeMeetingPointSet':
    return {
      title: 'You set a meeting point!',
      text: 'Great, now you are all set to get started and meet your assessors.'
    }
  case 'MeetingPointChanged':
    return {
      title: 'You changed the meeting point!',
      text: 'Remember to leave a note at your previous meeting point about it.'
    }
  default:
    if (topic) console.log('no helperBarText defined for topic', topic)
    return {
      title: 'Error 404 Kinda',
      text: "You should'nt have got here"
    }
  }
}
