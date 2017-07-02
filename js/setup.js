accounts = web3.eth.accounts

var setup = [
    [0, [], [],[]],
    [1, [0], [accounts[0]],[100]],
    [2, [0], [],[]],
    [3, [2],[accounts[1], accounts[2]],[10, 10]]
];

module.exports = setup
