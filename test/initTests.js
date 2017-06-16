var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");
var UserRegistryInstance;

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
        var otherUser;
        it("should create firstUser", function(){
            return UserRegistry.deployed().then(function(instance){
                UserRegistryInstance = instance
                return instance.firstUser(accounts[0])
            }).catch(function(e){
                assert("there was an error!")
            })
                });
        describe("firstUser", function(){
            it("should have a balance of 1000", function(){
                return UserRegistryInstance.users.call(accounts[0]).then(function(address){
                    return UserRegistryInstance.balances.call(address);
                }).then(function(balance) {
                    assert.equal(balance.toNumber(), 1000, "the balance of the first user isn't 1000")
                })
            });
            it("should own the mew-concept", function(){
                return UserRegistryInstance.users.call(accounts[0]).then(function(address){
                    firstUserAddress=address;
                    firstUser = User.at(firstUserAddress)
                    return mewConcept.owners.call(0)
                }).then(function(firstOwnerOfMew) {
                    assert.equal(firstOwnerOfMew, firstUserAddress, "the mewConcept does not know it is owned by a user")
                    //also check whether the owner can prove he owns the mew-concept
                    return firstUser.conceptPassed.call(mewAddress)
                }).then(function(firstUserOwnsMew) {
                    assert.equal(firstUserOwnsMew, true, "firstUser does not know she owns mew")
                })
            });
        })
        it("should add another user", function(){
            return UserRegistry.deployed().then(function(instance){
                UserRegistryInstance = instance
                return UserRegistryInstance.addUser(accounts[1], {from:accounts[1]})
            }).then(function(result){
                userAddress = result.logs[0].args["_userAddress"]
                otherUser = User.at(userAddress)
                return UserRegistryInstance.users.call(accounts[1])
            }).then(function(userContractByRegistry){
                assert.equal(userContractByRegistry, userAddress, "the address of otherUser's wallet is not correctly stored") 
            }) 
        });
        describe("the other user", function(){
            it("should have a balance of 0", function(){
                return UserRegistryInstance.users.call(accounts[1]).then(function(address){
                    return UserRegistryInstance.balances.call(address);
                }).then(function(balance) {
                    assert.equal(balance.toNumber(), 0, "the balance of otherUser user isn't 0")
                })
            });
            it("should also own the mew-concept", function(){
                return mewConcept.owners.call(1).then(function(secondOwnerOfMew){
                    assert.equal(secondOwnerOfMew, otherUser.address, "mew does not know it is owned by otherUser")
                    return otherUser.conceptPassed.call(mewAddress)
                }).then(function(mewOwnage){
                    assert.equal(mewOwnage, true, "otherUser does not know she owns the mew-Concept")
                })
            });
        })
    })
})
