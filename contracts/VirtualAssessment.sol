pragma solidity ^0.4.11;
import "./Math.sol";
/*
  A virtual Assessment that is used to do unit tests of the scoring
  and payout functions (test/scoring.js)
*/
contract VirtualAssessment {
    uint public stake;
    uint inflationRate;
    int[] public scores;

    uint public largestClusterSize;
    uint public mad;
    int public finalScore;
    uint[] public payouts;

    function init(int[] _scores, uint _stake){
        stake = _stake;
        inflationRate = 1;
        scores = _scores;
    }
    function reset(){
        delete payouts;
        delete mad;
        delete finalScore;
        delete largestClusterSize;
    }

    function calculateResult(){
        (finalScore, largestClusterSize, mad) = Math.getFinalScore(scores);
   }

   function payout() {
       for (uint i=0; i<scores.length; i++) {
           payouts.push(Math.getPayout(scores[i], finalScore, mad, stake, inflationRate));
       }
   }
}
