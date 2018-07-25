pragma solidity ^0.4.23;

contract ProxyData {
  address internal proxied;
}

contract Proxy is ProxyData {
  constructor(address _proxied) public {
    proxied = _proxied;
  }

  function () public payable {
    address addr = proxied;
    assembly {
      let freememstart := mload(0x40)
        calldatacopy(freememstart, 0, calldatasize())

        let success := delegatecall(not(0), addr, freememstart, calldatasize(), freememstart, 0)
        returndatacopy(freememstart, 0, returndatasize())
        switch success
          case 0 { revert(freememstart, returndatasize()) }
      default { return(freememstart, returndatasize()) }
    }
  }
}
