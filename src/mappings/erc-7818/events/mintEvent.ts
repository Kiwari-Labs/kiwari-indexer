import { Transfer } from "../../../../generated/ERC-7818/ERC7818";
import {
  AccountBalance,
  MintEvent7818,
  TokenERC7818,
} from "../../../../generated/schema";

export function createMintEvent(
  event: Transfer,
  minter: AccountBalance,
  destination: AccountBalance,
  token: TokenERC7818
): MintEvent7818 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let mintEvent = new MintEvent7818(eventId);

  mintEvent.minter = minter.id;
  mintEvent.destination = destination.id;
  mintEvent.block = event.block.number;
  mintEvent.timestamp = event.block.timestamp;
  mintEvent.transactionHash = event.transaction.hash;
  mintEvent.amount = event.params.value.toBigDecimal();
  mintEvent.token = token.id;

  mintEvent.save();

  return mintEvent;
}
