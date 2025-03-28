import { FactoryERC7818, TokenERC7818 } from "../../../generated/schema";
import { ERC7818 } from "../../../generated/templates";
import { NewTokenContract } from "../../../generated/ERC7818Factory/TemplateERC20Factory";
import { getOrCreateAccount } from "../erc-7818/account";
import { ONE, ZERO } from "../../helpers/number";

export function handleTokenDeployed(event: NewTokenContract): void {
  let factory = FactoryERC7818.load(event.address.toHex());

  let account = getOrCreateAccount(event.params.deployer);

  if (factory == null) {
    factory = new FactoryERC7818(event.address.toHex());
    factory.address = event.address;
    factory.totalContractCreated = ZERO;
    factory.save();
  }

  let token = new TokenERC7818(event.params.tokenAddress.toHex());
  token.address = event.params.tokenAddress;
  token.totalSupply = ZERO.toBigDecimal();
  token.totalTokenTransferred = ZERO.toBigDecimal();
  token.totalTokenMinted = ZERO.toBigDecimal();
  token.totalTokenBurned = ZERO.toBigDecimal();
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

  // Start indexing the new ERC-20 token
  ERC7818.create(event.params.tokenAddress);
}
