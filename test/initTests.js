var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");
var UserRegistryInstance;

//to create input for the proxycalls
var abi = require("ethjs-abi");
//const UserRegistryABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"addBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"firstUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reciever","type":"address"}],"name":"remove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"addUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"conceptRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"subtractBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_conceptRegistry","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_userAddress","type":"address"}],"name":"UserCreation","type":"event"}]

//const AssessmentABI

var mewAddress;
var mewConcept;
var otherConcept;

contract('Initialization', function(accounts) {
    describe("ConceptRegistry", function() {
        it("should know the mew address", function(){
            return ConceptRegistry.deployed().then(function(instance) {
                return instance.mewAddress.call();
            }).then(function(address){
                mewAddress = address;
                return Concept.deployed().then(function(instance){
                    mewConcept = instance;
                    assert.equal(mewConcept.address, mewAddress, "conceptRegistry doesn't know the mew address")
                })
            })
        });
        it("should set mew as the parent when not specified", function() {
            return ConceptRegistry.deployed().then(function(instance) {
                return instance.makeConcept([])
            }).then(function(result){
                //safe created concept for follow-up tests
                //console.log(result) //display transaction results on command line
                createdConceptAddress = result.logs[0].args["_concept"]
                otherConcept = Concept.at(createdConceptAddress) //create abstraction for the created Concept
                //check if the mewConcept has a child
                return mewConcept.getChildrenLength.call()
            }).then(function(length){
                assert.isAbove(length.toNumber(), 0, "has no children")
            })
        });
        it("should set the parents if specified", function() {
            return ConceptRegistry.deployed().then(function(instance) {
                ConReg = instance;
                //create a 2nd concept to be a child of mew
                parentAddress = otherConcept.address
                return ConReg.makeConcept([parentAddress])
            }).then(function(result){ //catch transaction result
                //fetch the address of the created contract from the Event-log
                childConceptAddress = result.logs[0].args["_concept"]
                childConcept = Concept.at(childConceptAddress); //create abstraction for the created Concept
                //check that the parent is linked to the child-concept
                return otherConcept.children.call(0)
            }).then(function(childAddress){
                //console.log(childAddress);
                assert.equal(childAddress, childConceptAddress, "Parent concept does not know its child")
                //check that the child-concept is linked to the parent
                return childConcept.parents.call(0)
            }).then(function(parentAddressFromChild){
                assert.equal(parentAddressFromChild, parentAddress, "Child concept does not know its parent")
            })
        });
    })
    describe("UserRegistry", function(){
        it("should initiate first account", function(){
            return UserRegistry.deployed().then(function(instance){
                UserRegistryInstance = instance
                return instance.firstUser(accounts[0], {from: accounts[0]})
            }).catch(function(e){
                assert("there was an error!")
            })
        })
        it("should own the mew-concept", function(){
            return mewConcept.weights.call(accounts[0]).then(function(weight){
                assert.equal(weight.toNumber(), 100)
            })
        })
        it("should have a balance of 1000", function(){
            return UserRegistryInstance.balances.call(accounts[0]).then(function(balance) {
                assert.equal(balance.toNumber(), 1000)
            })
        })
    })

    describe("tokenTransfers", function(){
        it("should transfer token between users", function(){
            return UserRegistry.deployed().then(function(instance){
                UserRegistryInstance = instance
                //get address of User-contracts
                console.log("test")
                return UserRegistryInstance.transfer(accounts[1], 200, {from: accounts[0]}).then(function(){
                    UserRegistryInstance.balances.call(accounts[0]).then(function(balance) {
                        assert.equal(balance.toNumber(), 800)
                    })
                }).then(function(){
                    UserRegistryInstance.balances.call(accounts[1]).then(function(balance){
                        assert.equal(balance.toNumber(), 200)
                    })
                })
            })
        });
    })
})
