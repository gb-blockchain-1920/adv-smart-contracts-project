pragma solidity ^0.6.0;

contract StringFunctionsAssembly {

    function concatenate(string memory A, string memory B) public pure returns (string memory output) {
        assembly{
            if gt(add(mload(A), mload(B)), 32) {revert(0,0)} //can't handle more than 32 bytes for total
            let size := add(mload(A), mload(B))
            output := mload(0x40)
            mstore(0x40, add(output, and(add(add(size, 0x20), 0x1f), not(0x1f))))
            mstore(output, size)
            //shift bytes for B over by the length of A, and then add them together to combine strings
            mstore(add(output, 0x20), add(mload(0xa0), div(mload(0xe0), exp(2,mul(mload(A), 8)))))
        }
    }


    function charAt(string memory A, uint256 ii) public pure returns (string memory output) {
        assembly {
            if gt(mload(A), 32) {revert(0,0)} //can't handle more than 32 bytes for total
            if gt(ii, sub(mload(A), 1)) {revert(0,0)}

            output := mload(0x40)
            mstore(0x40, add(output, and(add(add(1, 0x20), 0x1f), not(0x1f))))
            mstore(output, 1)
            //math used to shift bits over
            mstore(add(output, 0x20), mul(shr(0xf8, mload(add(0xa0, ii))), exp(2, sub(256, 8))))
        }
    }

    function replace(string memory A, uint256 ii, string memory B) public pure returns (string memory output){
        assembly {
            if gt(ii, sub(mload(A), 1)) {revert(0,0)}
            if eq(1, mod(1, mload(B))) {revert(0,0)}

            output := mload(0x40)
            mstore(0x40, add(output, and(add(add(mload(A), 0x20), 0x1f), not(0x1f))))
            mstore(output, mload(A))
            mstore(add(output, 0x20), add(and(mload(0xa0), not(shl(sub(256, mul(8, add(ii, 1))), sub(exp(2, 8), 1)))), shr(mul(8, ii), mload(0xe0))))
        }
    }


    function length(string memory A) public pure returns (uint256 strlen) {
        assembly {
           strlen := mload(A)
        }
    }

    function slice(string memory A, uint256 ii, uint256 jj) public pure returns (string memory output) {
        assembly {
            if gt(ii, jj) {revert(0,0)}
            let len := mload(A)
            if gt(ii, sub(len, 1)) {revert(0,0)}
            if gt(jj, len) {revert(0,0)}

            output := mload(0x40)
            mstore(0x40, add(output, and(add(add(sub(jj,ii), 0x20), 0x1f), not(0x1f))))
            mstore(output, sub(jj,ii))
            //clips the front instances by shifting shift bytes forward by ii bytes and then takes the first jj-ii bytes using masking
            mstore(add(output, 0x20), and(mload(add(0xa0, ii)), shl(sub(256, mul(8, sub(jj,ii))), sub(exp(2, mul(8, sub(jj, ii))), 1))))
        }
    }

    function slice(string memory A, uint256 ii) public pure returns (string memory) {
        return slice(A, ii, bytes(A).length);
    }
}
