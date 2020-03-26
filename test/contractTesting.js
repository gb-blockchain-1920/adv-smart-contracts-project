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
    const str = randomString();

    const comb0 = str[0].concat(str[1]);
    const comb1 = await stringFunc.concatenate(str[0], str[1]);
    const comb2 = await stringAssem.concatenate(str[0], str[1]);

    assert.equal(comb0, comb1, "JS concatenate = concatenate (no assembly)");
    assert.equal(comb0, comb2, "JS concatenate = concatenate (assembly)");
  });
});
