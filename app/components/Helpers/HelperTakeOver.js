import h from 'react-hyperscript'

export const HelperTakeOver = (props) => {
  switch (props.topic) {
    case 'UnlockMetaMask':
      return h('p', 'You need to unlock Metamask by entering your password.\n')

    case 'NoMetaMask':
      return h('p', "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface")

    case 'educateAboutMetaMask':
      return h('p', 'There is this cool thing called Metamask, we need so you can be safe and foxxy.')

    case 'UndeployedNetwork':
      return h('p', "You are connected to a network on which you haven't deployed contracts. Please use an appropriate script")

    default:
      return h('div', 'OOOpsi, this case was not caught...')
  }
}

export default HelperTakeOver
