module.exports = async (network, web3, toBeAddedToMew) => {
  let initialAccounts;
  switch (network) {
    case 'rinkeby':
      initialAccounts = require('../initialMembers.json')
      return initialAccounts
    case 'ropsten':
    case 'mainnet':
    case 'kovan':
      initialAccounts = require('../initialMembers.json')
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
