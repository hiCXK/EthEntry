const { expect } = require("chai")

const NAME = "EthEntry"
const SYMBOL = "ENT"

const EVES_NAME = "SunBurn Goa"
const EVES_COST = ethers.utils.parseUints('1', 'ether')
const EVES_MAX_TICKETS = 100
const EVES_DATE = "Apr 27"
const EVES_TIME = "10:00AM CST"
const EVES_LOCATION = "Austin, Texas"

describe("ethEntry", () => {
  let EthEntry
  let deployer, buyer

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners()
    const ethEntry = await ethers.getContractFactory("ethEntry")
    EthEntry = await ethEntry.deploy(NAME, SYMBOL)

    const transaction = await EthEntry.connect(deployer).list(
      EVES_NAME,
      EVES_COST,
      EVES_MAX_TICKETS,
      EVES_DATE,
      EVES_TIME,
      EVES_LOCATION
    )

    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await EthEntry.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      expect(await EthEntry.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      expect(await EthEntry.owner()).to.equal(deployer.address)
    })
  })

  describe("Eves", () => {
    it('Returns Eves attributes', async () => {
      const Eves = await EthEntry.getEves(1)
      expect(Eves.id).to.be.equal(1)
      expect(Eves.name).to.be.equal(EVES_NAME)
      expect(Eves.cost).to.be.equal(EVES_COST)
      expect(Eves.tickets).to.be.equal(EVES_MAX_TICKETS)
      expect(Eves.date).to.be.equal(EVES_DATE)
      expect(Eves.time).to.be.equal(EVES_TIME)
      expect(Eves.location).to.be.equal(EVES_LOCATION)
    })

    it('Updates Evess count', async () => {
      const totalOccasions = await EthEntry.totalOccasions()
      expect(totalOccasions).to.be.equal(1)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('1', 'ether')

    beforeEach(async () => {
      const transaction = await EthEntry.connect(buyer).buyTicket(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates ticket count', async () => {
      const Eves = await EthEntry.retEves(1)
      expect(Eves.tickets).to.be.equal(EVES_MAX_TICKETS - 1)
    })

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(EthEntry.address)
      expect(balance).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits("1", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await EthEntry.connect(buyer).buyTicket(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await EthEntry.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(EthEntry.address)
      expect(balance).to.equal(0)
    })
  })
})