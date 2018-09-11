import h from 'react-hyperscript'
import { takeOverTopic } from './helperContent.js'

export const HelperTakeOver = (props) => {
  console.log('redning takeover to topic',props.topic)
  switch (props.topic) {
    case takeOverTopic.UnlockMetaMask:
      return h('p', 'You need to unlock Metamask by entering your password.\n')

    case takeOverTopic.NoMetaMask:
      return h('p', "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface")

    case takeOverTopic.educateAboutMetaMask:
      return h('p', 'There is this cool thing called Metamask, we need so you can be safe and foxxy.')

    case takeOverTopic.UndeployedNetwork:
      return h('p', "You are connected to a network on which you haven't deployed contracts. Please use an appropriate script")

    case takeOverTopic.AssessmentProcess:
      return h('div', 'Here are some cool graphs and texts that show you how an assessment works')

    default:
      return h('div', 'OOOpsi, this topic', props.topic, '  has not been defined yet...')
  }
}

export default HelperTakeOver
