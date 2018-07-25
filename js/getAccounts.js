module.exports = async (network, web3, toBeAddedToMew) => {
  switch (network) {
    case 'rinkeby':
    case 'ropsten':
    case 'mainnet':
    case 'kovan':
      let initialAccounts = require('../initialMembers.json')
      return initialAccounts
    case 'development':
      let accounts = (await web3.eth.accounts)
      if (toBeAddedToMew) {
        return accounts.slice(0, 6)
      }
      return accounts
    case 'default':
      throw Error('Unknown network! Please update getAccounts file or check your network')
  }
}
