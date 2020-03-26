pragma solidity ^0.6.0;

contract StringFunctionsAssembly {

    function concatenate(string memory A, string memory B) public pure returns (string memory) {
        return string(abi.encode(_concatenate(A, B)));//convert to bytes memory then to string memory
    }

    function _concatenate(string memory A, string memory B) private pure returns (bytes32 output) {
        assembly{
            if gt(mload(A), 16) {revert(0,0)} //can't handle moer than 16 bytes for each string
            if gt(mload(B), 16) {revert(0,0)}
            output := add(mload(0xa0), div(mload(0xe0), exp(2,mul(mload(A), 8)))) //shift bytes for B over by the length of A, and then add them together to combine string
        }
    }


    function charAt(string memory A, uint256 ii) public pure returns (string memory) {
        return string(abi.encode(_charAt(A,ii))); //convert to bytes memory then to string memory
    }

    function _charAt(string memory A, uint256 ii) private pure returns (bytes1 char) {
        assembly {
            if gt(ii, sub(mload(A), 1)) {revert(0,0)}

            //math used to shift bits over
            char := mul(shr(0xf8, mload(add(0xa0, ii))), exp(2, sub(256, 8))) //slightly more efficient than previous line (commands in ethereum stack)
        }
    }


    function replace(string memory A, uint256 ii, string memory B) public pure returns (string memory) {
        return string(abi.encode(_replace(A, ii, B)));
    }

    function _replace(string memory A, uint256 ii, string memory B) private pure returns (bytes32 output){
        assembly {
            if gt(ii, sub(mload(A), 1)) {revert(0,0)}
            if eq(1, mod(1 ,mload(B))) {revert(0,0)}

            output := add(and(mload(0xa0), not(shl(sub(256, mul(8, add(ii, 1))), sub(exp(2, 8), 1)))), shr(mul(8, ii), mload(0xe0)))
        }
    }

    function length(string memory A) public pure returns (uint256 strlen) {
        assembly {
           strlen := mload(A)
        }
    }

    function slice(string memory A, uint256 ii, uint256 jj) public pure returns (string memory) {
        return string(abi.encode(_slice(A, ii, jj)));
    }

    function _slice(string memory A, uint256 ii, uint256 jj) private pure returns (bytes32 output) {
        assembly {
            if gt(ii, jj) {revert(0,0)}
            let len := mload(A)
            if gt(ii, sub(len, 1)) {revert(0,0)}
            if gt(jj, len) {revert(0,0)}

            //clips the front instances by shifting shift bytes forward by ii bytes and then takes the first jj-ii bytes using masking
            output := and(mload(add(0xa0, ii)), shl(sub(256, mul(8, sub(jj,ii))), sub(exp(2, mul(8, sub(jj, ii))), 1)))
            //how to mask
        }
    }

    function slice(string memory A, uint256 ii) public pure returns (string memory) {
        return slice(A, ii, bytes(A).length);
    }
}
