// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// returns the ethers balance of the given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ethers balance for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses){
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

  // Check balance before purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("==Start==");
  await printBalances(addresses);

  // Buy the owner a few coffees
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Hamza", "Nice Nice", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Maheera", "Wowwww", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Danial", "Achaaaa", tip);

  console.log("==Coffee Bought==");
  await printBalances(addresses);

  //Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  console.log("== After Withdraw ==");
  await printBalances(addresses);

  // Print Memos
  console.log("== Memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
