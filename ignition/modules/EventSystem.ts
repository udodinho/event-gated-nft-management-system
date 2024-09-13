import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTContractAddress = ""

const EventSystemModule = buildModule("EventSystemModule", (m) => {

  const nft = m.contract("EventSystem", [NFTContractAddress]);

  return { nft };
});

export default EventSystemModule;
