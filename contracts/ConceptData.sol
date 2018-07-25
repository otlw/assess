pragma solidity ^0.4.23;

import "./FathomToken.sol";
import "./ConceptRegistry.sol";
import "./Assessment.sol";
import "./Math.sol";
import "./Proxy.sol";

contract ConceptData is ProxyData {
  address[] public parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
  bytes public data;
  address public owner;
  FathomToken public fathomToken;
  ConceptRegistry conceptRegistry;
  uint public lifetime;
  mapping (address => bool) public assessmentExists;

  uint[] propagationRates;

  address[] public availableMembers;
  mapping (address => MemberData) public memberData;

  struct MemberData {
    address recentAssessment;
    uint index;
    ComponentWeight[] weights;
    mapping(address => uint) componentWeightIndex;
  }

  struct ComponentWeight {
    uint weight;
    uint date;
  }
}

contract ConceptDataInternal is ProxyData {
  address[] internal parents; //The concepts that this concept is child to (ie: Calculus is child to Math)
  bytes internal data;
  address internal owner;
  FathomToken internal fathomToken;
  ConceptRegistry internal conceptRegistry;
  uint internal lifetime;
  mapping (address => bool) internal assessmentExists;

  uint[] internal propagationRates;

  address[] internal availableMembers;
  mapping (address => MemberData) internal memberData;

  struct MemberData {
    address recentAssessment;
    uint index;
    ComponentWeight[] weights;
    mapping(address => uint) componentWeightIndex;
  }

  struct ComponentWeight {
    uint weight;
    uint date;
    }
}
