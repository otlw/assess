var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var User = artifacts.require("User");
var Concept = artifacts.require("Concept");

//to create input for the proxycalls
var abi = require("ethjs-abi");
const UserRegistryABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"addBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"firstUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reciever","type":"address"}],"name":"remove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"addUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"conceptRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"subtractBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_conceptRegistry","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_userAddress","type":"address"}],"name":"UserCreation","type":"event"}]
const AssessmentABI = [{"constant":false,"inputs":[{"name":"seed","type":"uint256"},{"name":"_concept","type":"address"},{"name":"num","type":"uint256"}],"name":"setAssessorPool","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"notifyStart","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_data","type":"string"}],"name":"setData","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"score","type":"int8"},{"name":"salt","type":"bytes16"},{"name":"assessor","type":"address"}],"name":"reveal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancelAssessment","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"payout","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"calculateResult","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"assessor","type":"address"}],"name":"addAssessorToPool","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"data","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"commit","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"confirmAssessor","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_assessee","type":"address"},{"name":"_userRegistry","type":"address"},{"name":"_conceptRegistry","type":"address"},{"name":"_size","type":"uint256"},{"name":"_cost","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dataSetter","type":"address"},{"indexed":false,"name":"_index","type":"uint256"}],"name":"DataSet","type":"event"}]
const ConceptABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_child","type":"address"}],"name":"addChild","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"assessmentExists","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"addBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"reciever","type":"address"}],"name":"remove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"assessee","type":"address"},{"name":"weight","type":"uint256"}],"name":"addOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"addUser","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getParentsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"seed","type":"uint256"}],"name":"getRandomMember","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"currentScores","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"children","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"parents","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwnerLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"weights","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_parent","type":"address"}],"name":"addParent","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getChildrenLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"score","type":"int256"},{"name":"assessee","type":"address"},{"name":"assessment","type":"address"}],"name":"finishAssessment","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"subtractBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"cost","type":"uint256"},{"name":"size","type":"uint256"}],"name":"makeAssessment","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_parents","type":"address[]"},{"name":"_userRegistry","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_assessee","type":"address"},{"indexed":false,"name":"_score","type":"int256"},{"indexed":false,"name":"_assessment","type":"address"}],"name":"CompletedAssessment","type":"event"}]

contract('Assessment', function(accounts) {
    let userReg;
    let conceptReg;
    let userAddresses = [];
    let userContracts = [];
    let assessedConcept;
    let parentConcept;
    let user0;
    describe('UserRegistry', function(){
        it("should register 6 new users with nonzero balances", function(){
            return UserRegistry.deployed().then(function(instance){
                userReg = instance;
                return ConceptRegistry.deployed().then(function(instance){
                    conceptReg = instance;
                    //add the first user
                    return userReg.firstUser(accounts[0])
                }).then(function(result){
                    user0Address = result.logs[0].args["_userAddress"]
                    userAddresses.push(user0Address)
                    user0 = User.at(user0Address)
                }).then(function(){
                    // add 5 more users (5 accepting assessors, later maybe 1 declining)
                    for (i=1; i<6; i++) {
                        userReg.addUser(accounts[i], {from:accounts[i]})
                    }
                }).then(function(){
                    //get the addresses of the users, their contract-Objects and transfer tokens to them if they dont have any
                    return userReg.users.call(accounts[1])
                }).then(function(address){
                    userAddresses.push(address)
                    userContracts.push(User.at(address)) 
                    inputBytecode = abi.encodeMethod(UserRegistryABI[7], [address, 50]);
                    return user0.execute(userReg.address, 0, inputBytecode)
                }).then(function(){
                    return userReg.users.call(accounts[2])
                }).then(function(address){
                    userAddresses.push(address)
                    userContracts.push(User.at(address)) 
                    inputBytecode = abi.encodeMethod(UserRegistryABI[7], [address, 50]);
                    return user0.execute(userReg.address, 0, inputBytecode)
                }).then(function(){
                    return userReg.users.call(accounts[3])
                }).then(function(address){
                    userAddresses.push(address)
                    userContracts.push(User.at(address)) 
                    inputBytecode = abi.encodeMethod(UserRegistryABI[7], [address, 50]);
                    return user0.execute(userReg.address, 0, inputBytecode)
                }).then(function(){
                    return userReg.users.call(accounts[4])
                }).then(function(address){
                    userAddresses.push(address)
                    userContracts.push(User.at(address)) 
                    inputBytecode = abi.encodeMethod(UserRegistryABI[7], [address, 50]);
                    return user0.execute(userReg.address, 0, inputBytecode)
                }).then(function(){
                    return userReg.users.call(accounts[5])
                }).then(function(address){
                    userAddresses.push(address)
                    userContracts.push(User.at(address)) 
                    inputBytecode = abi.encodeMethod(UserRegistryABI[7], [address, 50]);
                    return user0.execute(userReg.address, 0, inputBytecode)
                }).then(function(){
                    return userReg.balances.call(userAddresses[0])
                }).then(function(balance0){
                    assert.equal(balance0.toNumber(), 1000-5*50, "not all users received money from user0")
                    return conceptReg.mewAddress.call()
                }).then(function(mewAddress){
                    mewConcept = Concept.at(mewAddress)
                    return mewConcept.getOwnerLength.call()
                }).then(function(mewOwners){
                    assert.equal(mewOwners.toNumber(), 6, "there are not 6 members registered")
                })
            })
        })
    });
    describe("Concept.sol", function(){
        it("should initiate an assessment", function(){
            // a new Concept is registered as child of mew
            return conceptReg.makeConcept([]).then(function(result){
                // create eventlistener to catch the notifications
                var eventK
                
                // User0 creates an assessment for the new concept
                createdConceptAddress = result.logs[0].args["_concept"]
                assessedConcept = Concept.at(createdConceptAddress) //create abstraction for the created Concept
                inputBytecode = abi.encodeMethod(ConceptABI[19], [20,5]) //makeAssessment(cost:20, size:5)
                return user0.execute(assessedConcept.address, 0, inputBytecode)
            }).then(function(result){
                console.log(user0.address)
                //now check that
                //   and his account got charged
                //   the assessment exists //-> requires the address of the assessment, which exists only in the notification triggered by makeAssessment
                //                        // -> how to listen to all events fired?
                //   and the user0 got notified:
                return userReg.balances.call(user0.address)
            }).then(function(balance0){
                assert.equal(balance0.toNumber(), 750-5*20, "user0 did not get charged for initiating the assessment")
            })
        });
    })
})

	
// Userregistry registers 7 new users
// User0 transfers funds to the other 6 users
// User0 registers a new Concept as child
// concept initiates an assessment

// Assessment creates a pool of assessors
//   - Users can confirm by calling confirmAssessor (including ether to stake) and decline do nothing
// Assessment should sent messages to notify Users of start
//  - Assessors commit hashed scores
// Assessment notifies Users >1/2 of the scores have been submitted
//  - and starts burning stakes 
// Assessment notifies users that commit phase is over /reveal phase begins
// Users (Assessors) reveal scores
// Assessment calculates Result
//   - Assessment pays out the winners
//   - Assessment adds assesse to ConceptOwner
