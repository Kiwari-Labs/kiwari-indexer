import { FactoryERC7858, TokenERC7858 } from "../../../generated/schema";
import { ERC7858 } from "../../../generated/templates";
import { NewTokenContract } from "../../../generated/ERC7858Factory/TemplateERC7858Factory";
import { getOrCreateAccount } from "../account";
import { ONE, ZERO } from "../../helpers/number";

export function handleTokenDeployed(event: NewTokenContract): void {
  let factory = FactoryERC7858.load(event.address.toHex());

  let account = getOrCreateAccount(event.params.deployer);

  if (factory == null) {
    factory = new FactoryERC7858(event.address.toHex());
    factory.address = event.address;
    factory.totalContractCreated = ZERO;
    factory.save();
  }

  let token = new TokenERC7858(event.params.tokenAddress.toHex());
  token.address = event.params.tokenAddress;
  token.totalSupply = ZERO;
  token.totalTokenTransferred = ZERO;
  token.totalTokenMinted = ZERO;
  token.totalTokenBurned = ZERO;
  token.totalEvent = ZERO;
  token.totalEventTransfer = ZERO;
  token.totalEventMint = ZERO;
  token.totalEventBurn = ZERO;
  token.createdAt = event.block.timestamp;
  token.createdAtBlockNumber = event.block.number;
  token.factoryAddress = factory.address.toHex();
  token.creator = account.id;
  token.save();

  factory.totalContractCreated = factory.totalContractCreated!.plus(ONE);
  factory.save();

  // Start indexing the new ERC-721 token
  ERC7858.create(event.params.tokenAddress);
}
