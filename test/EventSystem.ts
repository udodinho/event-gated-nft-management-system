import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";
  
  describe("EventSystem", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployNFT() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const erc721NFT = await hre.ethers.getContractFactory("EventNFT");
      const nft = await erc721NFT.deploy();
  
      return { nft };
    }
  
    async function deployEventSystem() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const { nft } = await loadFixture(deployNFT)
  
      const eventNFT = await hre.ethers.getContractFactory("EventSystem");
      const event = await eventNFT.deploy(nft);
  
      return { event, owner, otherAccount, nft };
    }
  
    describe("Deployment", function () {
      it("Should check if nft contract address is correct", async function () {
        const { event, nft } = await loadFixture(deployEventSystem);
  
        expect(await event.nftContractAddress()).to.equal(nft);
      });
    });
  
    describe("CreateEvent", function () {
      it("Should check if event is greater than 10", async function () {
        const { event, owner } = await loadFixture(deployEventSystem);

    const name = "Conference";
    const description = "Lagos conference";
    const duration = 2

    for(let i = 0; i < 10; i++) {
        await event.connect(owner).createEvent(duration, name, description);
    }

    await expect(event.connect(owner).createEvent(duration, name, description)).to.be.revertedWith("Maximum event created");
      });
  
      it("Should emit an event after event creation is successful ", async function () {
        const { event, owner } = await loadFixture(deployEventSystem);
  
        const name = "Conference";
        const description = "Lagos conference";
        const duration = 2;
        const eventCount = 1

        await expect(event.connect(owner).createEvent(duration, name, description)).to.emit(event, "EventCreatedSuccessfully")
        .withArgs(eventCount, name);
      });
    });
  
  
    describe("RegisterForEvent", function () {
      it("Should fail if user does not own an nft", async function () {
        const { nft, otherAccount } = await loadFixture(deployEventSystem);
        
        expect(await nft.balanceOf(otherAccount)).to.be.revertedWith("You must own an NFT to register");
      });

      it("Should fail if event id does not exist", async function () {
        const { event, nft, owner } = await loadFixture(deployEventSystem);
  
        const name = "Conference";
        const description = "Lagos conference";
        const duration = 2;
        
        const user = "James"
        const email = "james@gmail.com"
        const url = "vvxgvjlkcubs"
        
        await nft.connect(owner).mintNFT(url);

        await event.connect(owner).createEvent(duration, name, description);

        await expect(event.connect(owner).registerForEvent(2, user, email)).to.be.revertedWith("Invalid event ID");
      });

      it("Should register user for the event", async function () {
        const { event, nft, owner } = await loadFixture(deployEventSystem);
  
        const name = "Conference";
        const description = "Lagos conference";
        const duration = 2;
        
        const user = "James"
        const email = "james@gmail.com"
        const url = "vvxgvjlkcubs"

        await nft.connect(owner).mintNFT(url);

        await event.connect(owner).createEvent(duration, name, description);

        await expect(event.connect(owner).registerForEvent(1, user, email))
        .to.emit(event, "UserRegistrationSuccessful")
        .withArgs(1, user, email);
      });

      it("Should fail if user already registered for the event", async function () {
        const { event, nft, owner } = await loadFixture(deployEventSystem);
  
        const name = "Conference";
        const description = "Lagos conference";
        const duration = 2;
        
        const user = "James"
        const email = "james@gmail.com"
        const url = "vvxgvjlkcubs"
        
        await nft.connect(owner).mintNFT(url);

        await event.connect(owner).createEvent(duration, name, description);

        await event.connect(owner).registerForEvent(1, user, email);

        await expect(event.connect(owner).registerForEvent(1, user, email)).to.be.revertedWith("Already registered for the event");
      });


    });








  });
  