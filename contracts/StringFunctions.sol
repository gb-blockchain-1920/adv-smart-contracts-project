pragma solidity ^0.6.0;

contract StringFunctions {

    function concatenate(string memory A, string memory B) public pure returns (string memory) {
        bytes memory _A = bytes(A);
        bytes memory _B = bytes(B);
        bytes memory output = new bytes(_A.length + _B.length);

        uint256 i;
        for (uint256 ii; ii < _A.length; ii++) {
            output[i] = _A[ii];
            i++;
        }

        for (uint256 jj; jj < _B.length; jj++) {
            output[i] = _B[jj];
            i++;
        }

        return string(output);
    }

    function charAt(string memory A, uint256 ii) public pure returns (string memory){

    }

    function replace(string memory A, uint256 ii, string memory B) public pure returns (string memory) {

    }

    function length(string memory A) public pure returns (uint256) {

    }

    function slice(string memory A, uint256 ii, uint256 jj) public pure returns (string memory) {

    }

    function slice(string memory A, uint256 ii) public pure returns (string memory) {

    }


}
