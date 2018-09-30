import {ModalTopics} from '../../store/navigation/reducer'

export const modalTopic = Object.freeze({
  UnlockMetaMask: 'UnlockMetaMask',
  AssessmentProcess: 'AssessmentProcess',
  NoMetaMask: 'NoMetaMask',
  EducateAboutMetaMask: 'EducateAboutMetaMask',
  UndeployedNetwork: 'UndeployedNetwork',
  AssessmentCreation: 'AssessmentCreation',
  WelcomeAsAssessor: 'WelcomeAsAssessor',
  HowToBeAssessor1: 'HowToBeAssessor1,'
  HowToBeAssessor2: 'HowToBeAssessor2,'
  FailedStake: 'FailedStake',
  FailedStakeAssessor: 'FailedStakeAssessor',
  FailedStakeWhy: 'FailedStakeWhy',
  FailedCommit: 'FailedCommit',
  FailedCommitAssessor: 'FailedCommitAssessor',
  FailedCommitWhy: 'FailedCommitWhy'
  FailedReveal: 'FailedReveal',
  FailedRevealAssessor: 'FailedRevealAssessor',
  FailedRevealWhy: 'FailedRevealWhy'
  InvalidOutcome: 'InvalidOutcome',
  InvalidOutcomeWhy : 'InvalidOutcomeWhy'
})

type Modal = {
  title: string
  text: string
  followUp?: {
    target: ModalTopics,
    linkText: string
  }
}
// this functions delivers simple one-liner explanations on given topics + a keyWord under which more can
// be learned
// @params: topic can be a string OR an object with keys: topic and params (e.g. when one needs to create an assessment)
export function helperText (topic: ModalTopics):Modal {
  switch (topic) {
    case "UnlockMetaMask":
      return {
        title: 'Unlock MetaMask to continue',
        text: 'Fathom requires you to unlock MetaMask before we can continue. Please click on the MetaMask icon and enter your password to proceed.'
        followUp: {
          target: "EducateAboutMetaMask"
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
        text: 'Congratulations! Your first assessment has been created. Next we \'ll select 5 anonymous, qualified assessors to help fairly assess your knowledge.'
      }
    case "AssessmentCreationFailed":
      return {
        title: topic,
        text: 'It looks like Ethereum couldn’t complete the creation of the assessment. This shouldn\'t have happened. Please look at your Metamask or the browser-console (F12) to learn why.'
      }
    case "WelcomeAsAssessor":
      return {
        title: topic,
        text: 'Thank you. Assessors help the world of Fathom to continue spinning. We have a few tips to help you fairly assess others. Shall we get started? ',
        target: "HowToBeAssessor1"
      }
    case "HowToBeAssessor1":
      return {
        title: topic,
        text: 'First, don’t be a jerk! Next, just assess them fairly surely you can figure it out you model citizen...you..company man!',
        target: "HowToBeAssessor2"
      }
    case "HowToBeAssessor2":
      return {
        title: topic,
        text: 'be smuuues'
      }
    // Screens shown to the assessee
    case "FailedStake":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'We couldn’t get 5 assessors to join your assessment. It happens occasionally, and isn’t your fault. Let’s recreate your assessment and try again.'
        followUp: {
          target: "FailedStakeWhy",
          linkText: 'Why?'
        }
      }
    case "FailedStakeWhy":
      return {
        title: 'Why couldn\'t my assessment continue?',
        text: 'To assess you fairly, Fathom randomly selects 5 qualified assessors from a total pool.\n \n Each assessor needs to Stake, i.e. pay to join the assessment. This is done to ensure they have an incentive to assess you fairly.\n\n This time, we weren’t able to find 5 assessors to Stake and join your assessment. Let’s try again by clicking the button below.'
      }
    case "FailedCommit":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Not all assessors were able to commit their scores by the deadline. We’ve had to cancel your assessment as a precaution.',
        followUp: {
          target: "FailedCommitWhy",
          linkText: 'Why?'
        }
      }
    case "FailedCommitWhy":
      return {
        title: 'Why couldn\'t my assessment continue?',
        text: 'In order to reduce collusion between assessors, and encourage assessments to be completed swiftly, Fathom sets deadlines for each stage of the assessment.\n\n In this case, one or more assessors didn’t commit their scores after assessing you.\n\n We know this can be frustrating, so we’re here to help you create a new assessment. Just click below. (TODO)',
      }
    case "FailedReveal":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Not all assessors were able to reveal their scores by the deadline. We’ve had to cancel your assessment as a precaution. WHY?',
        followUp: {
          target: "FailedRevealWhy",
          linkText: 'Why?'
        }
      }
    case "FailedRevealWhy":
      return {
        title: 'Why couldn\'t my assessment continue?',
        text: 'In order to reduce collusion between assessors, and encourage assessments to be completed swiftly, Fathom sets deadlines for each stage of the assessment.\n\n In this case, one or more assessors didn’t reveal their scores after assessing you.\n\n We know this can be frustrating, so we’re here to help you create a new assessment. Just click below. (TODO)',
      }
    case "InvalidOutcome":
      return {
        title: 'Why couldn\'t my assessment continue?',
        text: 'All your assessors committed their scores, but they varied too much, rendering the assessment invalid.',
        followUp: {
          target: "InvalidOutComeWhy",
          linkText: 'Why?'
        }
      }
    case "InvalidOutcomeWhy":
      return {
        title: 'Why couldn\'t my assessment continue?',
        text: 'Fathom works by combining the scores committed by each assessor into a single average that you’re awarded. \n\n This time, the assessors scores varied so much that the final score would be too inaccurate and unfair to award to you. \n\n We know this can be frustrating, so we’re here to help you create a new assessment. Just click below.'
      }
   // screens shown to the assessor
    case "FailedStakeAssessor":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Thank you for joining this assessment. Unfortunately, we couldn’t get 5 assessors to stake in time. \n\n Your stake has been refunded.'
      }
    case "FailedCommitAssessor":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Thank you for joining this assessment. Unfortunately, not all assessors committed their scores in time.\n\n Your stake has been refunded.'
      }
    case "FailedRevealAssessor":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Thank you for joining this assessment. Unfortunately, not all assessors revealed their scores in time.\n\n Your stake has been refunded.'
      }
    case "InvalidOutcomeAssessor":
      return {
        title: 'Your assessment couldn\'t continue',
        text: 'Thank you for joining this assessment.Unfortunately, the scores varied too widely and the assessment has been declared invalid.'
      }
    default:
      if (topic) console.log('no helperText defined for topic', topic)
      return {
        title: 'Error 404 Kinda',
        text: "You should'nt have got here"
      }
  }
}

// ModalTexts = Object.freeze({
//   HowToBeAssessor: {
//     title: "HowToBeAssessor1",
//     text: 'First, don’t be a jerk! Next, just assess them fairly surely you can figure it out you model citizen...you..company man!',
//     target: "HowToBeAssessor2"
//   },
//   HowToBeAssessor2: {
//     title: "HowToBeAssessor2",
//   }

// }
                          )
