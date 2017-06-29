var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var UserRegistryInstance;

//to create input for the proxycalls
//var abi = require("ethjs-abi");
//const UserRegistryABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"addBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"firstUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reciever","type":"address"}],"name":"remove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"addUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"conceptRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"subtractBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_conceptRegistry","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_userAddress","type":"address"}],"name":"UserCreation","type":"event"}]

//const AssessmentABI

contract("ConceptRegistry", function() {
    var mewAddress;
    var createdConceptAddress;
    it("should know the mew address", function(){
        ConceptRegistry.deployed().then(function(instance) {
            return instance.mewAddress.call();
        }).then(function(address){
            mewAddress = address
            return Concept.deployed()
        }).then(function(mewInstance){
            assert.equal(mewInstance.address, mewAddress, "conceptRegistry doesn't know the mew address")
        })
    })
    it("should set mew as the parent when not specified", function() {
        return ConceptRegistry.deployed().then(function(instance) {
            return instance.makeConcept([])
        }).then(function(result){
            createdConceptAddress = result.logs[0].args["_concept"]
            return Concept.at(mewAddress)
        }).then(function(mewInstance) {
            return mewInstance.getChildrenLength.call()
        }).then(function(length){
            assert.isAbove(length.toNumber(), 0, "has no children")
        }).then(function() {
            return Concept.at(createdConceptAddress)
        }).then(function(conceptInstance){
            return conceptInstance.parents.call(0)
        }).then(function(parentAddress){
            assert.equal(parentAddress, mewAddress)
        })
    });
    it("should set the parents if specified", function() {
        var childConceptAddress

        return ConceptRegistry.deployed().then(function(instance) {
            //create a 2nd concept to be a child of mew
            parentAddress = createdConceptAddress
            return instance.makeConcept([parentAddress])
        }).then(function(result){ //catch transaction result
            //fetch the address of the created contract from the Event-log
            childConceptAddress = result.logs[0].args["_concept"]
            childConcept = Concept.at(childConceptAddress); //create abstraction for the created Concept
            //check that the parent is linked to the child-concept
            return Concept.at(createdConceptAddress)
        }).then(function(createdConceptInstance) {
            return createdConceptInstance.children.call(0)
        }).then(function(childAddress){
            assert.equal(childAddress, childConceptAddress, "Parent concept does not know its child")
            //check that the child-concept is linked to the parent
            return childConcept.parents.call(0)
        }).then(function(parentAddressFromChild){
            assert.equal(parentAddressFromChild, parentAddress, "Child concept does not know its parent")
        })
    });
    it("should throw if parent doesn't exist", function(){
        return ConceptRegistry.deployed().then(function(instance) {
            return instance.makeConcept(["0x123"])
        }).then(function (result) {
            assert(false, "transaction should fail")
        }).catch(function(e){
            if(e.toString().indexOf('invalid opcode') > 0) {
                assert(true)
            }
            else {
                assert(false, e.toString())
            }
        })
    })
})

contract("Initial User", function(accounts){
    it("should own the mew-concept", function(){
        return Concept.deployed().then(function(instance) {
            return instance.weights.call(accounts[0])
        }).then(function(weight) {
            assert.equal(weight.toNumber(), 100)
        })
    })
    it("should have a balance of 1000", function(){
        return UserRegistry.deployed().then(function(instance) {
            return instance.balances.call(accounts[0])
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 100)
        })
    });
})

contract("token transfers", function(accounts) {
    it("Should modify balances correctly", function(){
        var account1InitialBalance;
        var account2InitialBalance;
        var amount = 50;
        return UserRegistry.deployed().then(function(instance){
            UserRegistryInstance = instance
            return UserRegistryInstance.balances.call(accounts[0])
        }).then(function(balance){
            account1InitialBalance = balance
            return UserRegistryInstance.balances.call(accounts[1])
        }).then(function(balance) {
            account2InitialBalance = balance
            return UserRegistryInstance.transfer(accounts[1], amount, {from: accounts[0]})
        }).then(function() {
            return UserRegistryInstance.balances.call(accounts[0])
        }).then(function(balance) {
            assert.equal(account1InitialBalance - balance.toNumber(), amount, "User1 didn't lose tokens")
            return UserRegistryInstance.balances.call(accounts[1])
        }).then(function(balance) {
            assert.equal(balance.toNumber() - account2InitialBalance, amount, "User2 didn't gain tokens")
        })
   })
})
