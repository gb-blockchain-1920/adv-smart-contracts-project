const StringFunctions = artifacts.require("StringFunctions");
const StringFunctionsAssembly = artifacts.require("StringFunctionsAssembly");
const truffleAssert = require("truffle-assertions");

const logOutput = (...params) => {
  console.log("     ", ...params);
};

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const randomString = length => {
  console.log(length);
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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

  it("concatenate functions correctly", async () => {
    const string0 = randomString(Math.ceil(Math.random() * 32));
    const string1 = randomString(Math.ceil(Math.random()*(32 - string0.length)));

    const comb0 = string0.concat(string1);
    const comb1 = await stringFunc.concatenate(string0, string1);
    const comb2 = await stringAssem.concatenate(string0, string1);

    console.log(comb0, comb0.length, comb1, comb1.length, comb2, comb2.length);
    assert.equal(comb0, comb1, "JS concatenate = concatenate (no assembly)")
    assert.equal(comb0, comb2, "JS concatenate = concatenate (assembly)")
  });
});
