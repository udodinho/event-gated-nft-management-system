import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

 const EventNFTModule = buildModule("EventNFTModule", (m) => {

  const nft = m.contract("EventNFT", []);
  
  return { nft };
});

export default EventNFTModule;
