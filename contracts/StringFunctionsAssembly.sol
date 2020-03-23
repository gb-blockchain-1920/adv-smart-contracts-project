pragma solidity ^0.6.0;

contract StringFunctions {

    function concatenate(string memory A, string memory B) public pure returns (string memory) {

    }

    function charAt(string memory A, uint256 ii) public pure returns (string memory) {

    }

    function replace(string memory A, uint256 ii, string memory B) public pure returns (string memory) {

    }

    function length(string memory A) public pure returns (uint256) {

    }

    function slice(string memory A, uint256 ii, uint256 jj) public pure returns (string memory) {

    }

    function slice(string memory A, uint256 ii) public pure returns (string memory) {
        return slice(A, ii, bytes(A).length);
    }
}
