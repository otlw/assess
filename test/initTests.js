var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");

var UserRegistryInstance;

var mewAddress;
var testConcept;

contract('Initialization', function(accounts) {
    describe("ContractRegistry", function() {
        it("should know the mew address", function(){
            return ConceptRegistry.deployed().then(function(instance) {
                return instance.mewAddress.call();
            }).then(function(address){
                mewAddress = address;
                return Concept.deployed().then(function(instance){
                    assert.equal(instance.address, mewAddress, "conceptRegistry doesn't know the mew address")
                })
            })
        });
        it("should set mew as the parent when not specified", function() {
            return ConceptRegistry.deployed().then(function(instance) {
                return instance.makeConcept([])
            }).then(function(){
                return Concept.deployed().then(function(instance){
                    return instance.getChildrenLength.call()
                }).then(function(length){
                    assert.isAbove(length.toNumber(), 0, "has no children")
                })
            })
        });
    })
    describe("UserRegistry", function(){
        it("should create firstUser", function(){
            return UserRegistry.deployed().then(function(instance){
                UserRegistryInstance = instance
                return instance.firstUser(accounts[0])
            }).catch(function(e){
                assert("there was an error!")
            })
        })
        describe("firstUser", function(){
            it("should have a balance of 1000", function(){
                return UserRegistryInstance.users.call(accounts[0]).then(function(address){
                    return UserRegistryInstance.balances.call(address);
                }).then(function(balance) {
                    assert.equal(balance.toNumber(), 1000, "the balance of the first user isn't 1000")
                })
            })
        })
   })
})
