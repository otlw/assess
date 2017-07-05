var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var UserRegistryInstance;

contract("ConceptRegistry", function() {
    var mewAddress;
    var createdConceptAddress;
    var ConceptRegistryInstance
    it("should have created the mew contract", function(){
        ConceptRegistry.deployed().then(function(instance) {
            ConceptRegistryInstance = instance
            return ConceptRegistryInstance.mewAddress.call();
        }).then(function(address){
            mewAddress = address
            return ConceptRegistryInstance.conceptExists(mewAddress)
        }).then(function(exists){
            assert.isTrue(exists, "mew doesn't exist")
        })
    })
    it("should set mew as the parent when not specified", function() {
        return ConceptRegistry.deployed().then(function(instance) {
            return instance.makeConcept([])
        }).then(function(result){
            createdConceptAddress = result.logs[0].args["_concept"]
            return Concept.at(mewAddress)
        }).then(function(mewInstance) {
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
    it("should have a balance of 100000", function(){
        return UserRegistry.deployed().then(function(instance) {
            return instance.balances.call(accounts[0])
        }).then(function(balance) {
            assert.equal(balance.toNumber(),10000000000)
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
