# Solidity String Operations - Advanced Smart Contracts Project
Aaron Lu - 101278524

### High-Level Design
Using assembly to implement various string operations that are not possible in normal solidity.

Five functions: ([discussed here](https://hackernoon.com/working-with-strings-in-solidity-c4ff6d5f8008))
- Determining the string’s length
- Reading the character at a given location in the string
- Changing the character at a given location in the string
- Joining two strings
- Extracting part of a string

<!-- - Other functions (if time permitting - [JS string documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)):
- toLowercase
- toUppercase
- includes -->

### Implementation Details
Two methods of implementation for gas cost comparison:
- String operations implemented using standard Solidity commands and type conversions
- String operations implemented using Solidity assembly commands

String operation functions:
- `concatenate` - combine two strings into one string
- `charAt` - return character at specific index of string
- `replace` - replace character at specific index of string
- `length` - return the length of the string
- `slice` - basic implementation of the JavaScript `slice()` command with function overloading to handle different input parameters

Implementation without assembly:
- Typically involved converting the `string memory` type to `bytes memory` because `bytes` has access to more functions such as length, indexing, etc
- Loops were used when multiple bytes need to be assigned to a `bytes` array

Implementation with assembly:
- Typically involved a private function that would return a `bytes32` output and then it would converted to a `string memory` output using `abi.encode()`
- Bit operations were used to manipulate bytes to accomplish functions purpose

### Gas Cost Optimizations
The gas optimization is based on a comparison between the without assembly and with assembly implementations.
- Avoiding loops when using assembly
- Helper functions are private
- Assembly commands are written in a single line rather than assigned to variables (pushes less information to the stack)

### Security Considerations
Overall, these functions do not have many security needs because helper functions are always `private`, and restricted to `pure`.

However, there are always possible exploitations:
- Memory overflow - if the strings were larger than 32 bytes, the user may be able to access other parts of memory

### Current Limitations
For assembly implementation:
- Strings must be less than 32 bytes for most functions
- Strings must be less than 16 bytes for `concatenate`

### Additional/Possible Implementations
- Converting the contracts to libraries and being able to use it with other contracts.
  - _Not Implemented_
  - Not necessary in this use case. It would be more inefficient to need to create an additional contract to test the functions.
- CI/CD in Github for automatically running test cases
  - _Not Implemented_
- Test cases for comparing functionality between JavaScript, the contract without assembly, and the contract with assembly
  - _Implemented_
  - Using `truffle test` and `truffle run coverage`

### Resources
- [Solidity assembly](https://solidity.readthedocs.io/en/v0.5.12/assembly.html)
- [Bitwise operators](https://medium.com/@imolfar/bitwise-operations-and-bit-manipulation-in-solidity-ethereum-1751f3d2e216)
- [bytes32 to bytes](https://ethereum.stackexchange.com/questions/40920/convert-bytes32-to-bytes)
