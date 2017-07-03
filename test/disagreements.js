var ConceptRegistry = artifacts.require("ConceptRegistry");
var UserRegistry = artifacts.require("UserRegistry");
var Concept = artifacts.require("Concept");
var Assessment = artifacts.require("Assessment");
var Distributor = artifacts.require("Distributor");

utils = require("../js/utils.js")
chain = require("../js/assessmentFunctions.js")

var deploymentScript = require("../migrations/2_deploy_contracts.js")
var setup = deploymentScript.setupVariable
var nInitialUsers = deploymentScript.nInitialUsers

contract("Assessment", function(accounts){
    describe("When not enough assessors can be found for an assessment",  function(){
        it("the assessment can be cancelled by anyone", function(){
        })
        it("and everyone with a stake in it is refunded", function(){
        })
    })
    describe("When assessors fail to make an assessment", function(){
        it("their stake is burned according to time passed", function(){
        })
        it("and the assessment eventually starts without him", function(){
        })
    })
    describe("When an assessor fails to keep his score a secret", function(){
        it("someone else can steal his stake by revealing his score", function(){
        })
        it("and he is removed from the assessment", function(){
        })
    })
    describe("When Assessors disagree on the result of asssessment, they are paid", function(){
        it("their stake plus a proportion if they are in the in the schelling cluster", function(){
        })
        it("their stake minus a proportion if they are outside of it", function(){
        })
    })
