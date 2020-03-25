pragma solidity ^0.6.0;

contract StringFunctionsAssembly {

    function concatenate(string memory A, string memory B) public pure returns (string memory) {
        uint256 A_len = length(A);
        uint256 B_len = length(B);
        bytes memory output = new bytes(A_len + B_len);

        uint256 i;
        for (uint256 ii; ii < A_len; ii++) {
            output[i] = _charAt(A, ii);
            i++;
        }

        for (uint256 jj; jj < B_len; jj++) {
            output[i] = _charAt(B, jj);
            i++;
        }

        i = 0;

        return string(output);
    }


    function charAt(string memory A, uint256 ii) public pure returns (string memory) {
        //convert to a string (too difficult to convert using assembly)
        bytes memory output = new bytes(1);
        output[0] = _charAt(A, ii);
        return string(output);
    }

    function _charAt(string memory A, uint256 ii) private pure returns (bytes1 char) {
        assembly {
            if gt(ii, sub(mload(A), 1)) {revert(0,0)}
            // char := byte(ii, mload(0xa0))

            //math used to shift bits over
            char := mul(shr(0xf8, mload(add(0xa0, ii))), exp(2, sub(256, 8))) //slightly more efficient than previous line (commands in ethereum stack)
        }
    }

    function replace(string memory A, uint256 ii, string memory B) public pure returns (string memory) {
        bytes memory _A = bytes(A);
        require(ii < _A.length, "index out of range");
        bytes memory _B = bytes(B);
        require(_B.length == 1, "incorrect replacement size");
        _A[ii] = _B[0];
        return string(_A);
    }

    function length(string memory A) public pure returns (uint256 strlen) {
        assembly {
           strlen := mload(A)
        }
    }

    function slice(string memory A, uint256 ii, uint256 jj) public pure returns (string memory) {
        require(ii < jj, "incorrect indices");
        bytes memory _A = bytes(A);
        require(ii < _A.length, "first index out of range");
        require(jj <= _A.length, "second index out of range");

        bytes memory output = new bytes(jj-ii);

        for (uint256 kk; kk < jj-ii; kk++){
            output[kk] = _A[kk+ii];
        }

        return string(output);
    }

    function slice(string memory A, uint256 ii) public pure returns (string memory) {
        return slice(A, ii, bytes(A).length);
    }
}
