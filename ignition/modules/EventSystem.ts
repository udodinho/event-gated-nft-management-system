import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTContractAddress = "0xbBE47Ae8A360f9E22232cAFbAd2010ae5B4Be374"

const EventSystemModule = buildModule("EventSystemModule", (m) => {

  const nft = m.contract("EventSystem", [NFTContractAddress]);

  return { nft };
});

export default EventSystemModule;
