const StringFunctions = artifacts.require("StringFunctions");
const StringFunctionsAssembly = artifacts.require("StringFunctionsAssembly");
const truffleAssert = require("truffle-assertions");

const logOutput = (...params) => {
  console.log("     ", ...params);
};

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const randomString = () => {
  const lengths = [Math.ceil(Math.random() * 32)];
  lengths.push(Math.ceil(Math.random() * (32 - lengths[0])));
  const result = ["", ""];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < lengths.length; i++) {
    for (var j = 0; j < lengths[i]; j++) {
      result[i] += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
  }
  return result;
};

const longString = new Array(100).fill("A").join("");

contract("StringFunctions + StringFunctionsAssembly", accounts => {
  let stringFunc;
  let stringAssem;

  before(async () => {
    stringFunc = await StringFunctions.deployed();
    stringAssem = await StringFunctionsAssembly.deployed();
  });

  it("deployment gas optimization correct", async () => {
    const funcGas = await StringFunctions.new();
    const assemGas = await StringFunctionsAssembly.new();

    const funcReceipt = await web3.eth.getTransactionReceipt(
      funcGas.transactionHash
    );
    const assemReceipt = await web3.eth.getTransactionReceipt(
      assemGas.transactionHash
    );

    logOutput(
      "Assembly:",
      assemReceipt.gasUsed,
      "Non-Assembly:",
      funcReceipt.gasUsed
    );
    assert.isBelow(
      assemReceipt.gasUsed,
      funcReceipt.gasUsed,
      "deployment gas consumption is less for assembly"
    );
  });

  it("concatenate() functions correctly", async () => {
    let str = randomString();
    while (str[0].length == 32) {
      str = randomString();
    }

    const comb0 = str[0].concat(str[1]);
    const comb1 = await stringFunc.concatenate(str[0], str[1]);
    const comb2 = await stringAssem.concatenate(str[0], str[1]);

    assert.equal(comb0, comb1, "JS concatenate = concatenate (no assembly)");
    assert.equal(comb0, comb2, "JS concatenate = concatenate (assembly)");

    truffleAssert.reverts(
      stringAssem.concatenate(comb1, comb2),
      null,
      "maximum 32 bytes"
    );
  });

  it("charAt() functions correctly", async () => {
    const str = randomString();
    const ind = Math.floor(Math.random() * str[0].length);

    const char0 = str[0][ind];
    const char1 = await stringFunc.charAt(str[0], ind);
    const char2 = await stringAssem.charAt(str[0], ind);

    assert.equal(char0, char1, "JS charAt = charAt (no assembly)");
    assert.equal(char0, char2, "JS charAt = charAt (assembly)");

    truffleAssert.reverts(
      stringFunc.charAt(str[0], str[0].length),
      null,
      "(func) indice is too large"
    );

    truffleAssert.reverts(
      stringAssem.charAt(longString, ind),
      null,
      "maximum 32 bytes"
    );
    truffleAssert.reverts(
      stringAssem.charAt(str[0], str[0].length),
      null,
      "(assem) indice is too large"
    );
  });

  it("replace() functions correctly", async () => {
    const str = randomString();
    const ind = Math.floor(Math.random() * str[0].length);
    const letter = str[1][0] || "A";

    let str0 = str[0].split("");
    str0[ind] = letter;
    str0 = str0.join("");
    const str1 = await stringFunc.replace(str[0], ind, letter);
    const str2 = await stringAssem.replace(str[0], ind, letter);

    assert.equal(str0, str1, "JS replace = replace (no assembly)");
    assert.equal(str0, str2, "JS replace = replace (assembly)");

    truffleAssert.reverts(
      stringFunc.replace(str[0], str[0].length, letter),
      null,
      "(func) indice is too large"
    );
    truffleAssert.reverts(
      stringFunc.replace(str[0], ind, "AB"),
      null,
      "(func) character is not single byte"
    );

    truffleAssert.reverts(
      stringAssem.replace(longString, ind, letter),
      null,
      "maximum 32 bytes"
    );
    truffleAssert.reverts(
      stringAssem.replace(str[0], str[0].length, letter),
      null,
      "(assem) indice is too large"
    );
    truffleAssert.reverts(
      stringAssem.replace(str[0], ind, "AB"),
      null,
      "(assem) character is not single byte"
    );
  });

  it("length() functions correctly", async () => {
    const str = randomString();

    const len0 = str[0].length;
    const len1 = await stringFunc.length(str[0]);
    const len2 = await stringAssem.length(str[0]);

    assert.equal(len0, len1, "JS length = length (no assembly)");
    assert.equal(len0, len2, "JS length = length (assembly)");
  });

  it("slice() with 3 inputs functions correctly", async () => {
    const str = randomString();
    const ind = [Math.floor(Math.random() * str[0].length)];
    ind.push(Math.ceil(Math.random() * (str[0].length - ind[0]) + ind[0]));

    const slice0 = str[0].slice(ind[0], ind[1]);
    const slice1 = await stringFunc.methods["slice(string,uint256,uint256)"](
      str[0],
      ind[0],
      ind[1]
    );
    const slice2 = await stringAssem.methods["slice(string,uint256,uint256)"](
      str[0],
      ind[0],
      ind[1]
    );

    assert.equal(slice0, slice1, "JS slice = slice (no assembly)");
    assert.equal(slice0, slice2, "JS slice = slice (assembly)");

    truffleAssert.reverts(
      stringFunc.methods["slice(string,uint256,uint256)"](
        str[0],
        ind[1] + 1,
        ind[1]
      ),
      null,
      "(func) incorrect indices"
    );

    truffleAssert.reverts(
      stringFunc.methods["slice(string,uint256,uint256)"](
        str[0],
        str[0].length,
        str[0].length + 2
      ),
      null,
      "(func) first index out of range"
    );

    truffleAssert.reverts(
      stringFunc.methods["slice(string,uint256,uint256)"](
        str[0],
        ind[0],
        str[0].length + 2
      ),
      null,
      "(func) second index out of range"
    );

    truffleAssert.reverts(
      stringAssem.methods["slice(string,uint256,uint256)"](
        str[0],
        ind[1] + 1,
        ind[1]
      ),
      null,
      "(assem) incorrect indices"
    );

    truffleAssert.reverts(
      stringAssem.methods["slice(string,uint256,uint256)"](
        str[0],
        str[0].length,
        str[0].length + 2
      ),
      null,
      "(assem) first index out of range"
    );

    truffleAssert.reverts(
      stringAssem.methods["slice(string,uint256,uint256)"](
        str[0],
        ind[0],
        str[0].length + 2
      ),
      null,
      "(assem) second index out of range"
    );
  });

  it("slice() with 2 inputs functions correctly", async () => {
    const str = randomString();
    const ind = Math.floor(Math.random() * str[0].length);

    const slice0 = str[0].slice(ind);
    const slice1 = await stringFunc.methods["slice(string,uint256)"](
      str[0],
      ind
    );
    const slice2 = await stringAssem.methods["slice(string,uint256)"](
      str[0],
      ind
    );

    assert.equal(slice0, slice1, "JS slice = slice (no assembly)");
    assert.equal(slice0, slice2, "JS slice = slice (assembly)");
  });
});
