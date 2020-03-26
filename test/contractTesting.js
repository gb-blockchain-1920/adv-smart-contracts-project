const StringFunctions = artifacts.require("StringFunctions");
const StringFunctionsAssembly = artifacts.require("StringFunctionsAssembly");

const logOutput = (...params) => {
  console.log("     ", ...params);
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
});
