const StringFunctions = artifacts.require("StringFunctions");
const StringFunctionsAssembly = artifacts.require("StringFunctionsAssembly");

// Springboard contract is a factory of wallet contracts
contract("StringFunctions", accounts => {
  let stringFunc;
  let stringAssem;
  before(async () => {
      stringFunc = await StringFunctions.deployed();
      stringAssem = await StringFunctionsAssembly.deployed();
  });

  it("test case", async () => {
    assert.equal(true, true, "");
  });
});
