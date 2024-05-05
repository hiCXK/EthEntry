const hre = require("hardhat")
const ethers = hre.ethers; 

// const tokens = (n) => {
//   return ethers.utils.parseUints(n.toString(), 'ether')
// }

async function main() {

  const [deployer] = await ethers.getSigners()
  const NAME = "ethEntry"
  const SYMBOL = "ENT"

  const ethEntry = await ethers.getContractFactory("ethEntry");
  const EthEntry = await ethEntry.deploy(NAME, SYMBOL);
  await EthEntry.getDeployedCode();

 console.log(`Deployed EthEntry Contract at: ${EthEntry.target}\n`) 

 const Eves = [
    {
      name: "SunBurn Goa",
      cost: 3,
      tickets: 2000,
      date: "May 31",
      time: "6:00PM EST",
      location: "Vastara Beech ,Goa"
    },
    {
      name: "CSK vs RCB(IPL)",
      cost: 1,
      tickets: 1250,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Chepauk Stadium,Chennai"
    },
    {
      name: "Arjit's Concert",
      cost: 4,
      tickets: 2000,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Bangalore, India"
    },
    {
      name: "EthIndia",
      cost: 5,
      tickets: 400,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "Jaipur , Rajasthan"
    },
  ]

  for (var i = 0; i < 4; i++) {
    const transaction = await EthEntry.connect(deployer).createEves(
      Eves[i].name,
      Eves[i].cost,
      Eves[i].tickets,
      Eves[i].date,
      Eves[i].time,
      Eves[i].location,
    )

    await transaction.wait()

    console.log(`Listed Eves ${i + 1}: ${Eves[i].name}`)
  }
  
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
