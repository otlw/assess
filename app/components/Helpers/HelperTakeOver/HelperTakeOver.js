import h from 'react-hyperscript'
import { Component } from 'react'
import { takeOverTopic } from '../helperContent.js'
import {Link} from 'react-router-dom'

export class HelperTakeOver extends Component {
  closeScreen () {
    this.props.updateHelperScreen('closeTakeOver')
  }

  render () {
    let topic = typeof this.props.topic === 'object' ? this.props.topic.topic : this.props.topic
    switch (topic) {
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

      case takeOverTopic.AssessmentCreation:
        if (this.props.topic.params.success) {
          console.log('topic', this.props)
          return (
            h('div', [
              h('span', 'Success! Your assessment has been created. Click '),
              h(Link, {
                to: '/assessment/' + this.props.topic.params.assessmentId,
                onClick: this.closeScreen.bind(this)
              }, 'here'),
              h('span', ' to view the assessment details.')
            ])
          )
        } else {
          console.log('failed due to ', this.props.topic.error)
          return h('div', 'assesmsnet creation failed!')
        }

      default:
        return h('div', 'OOOpsi, this topic has not been defined yet...')
    }
  }
}

export default HelperTakeOver
