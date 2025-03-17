import { Transfer } from "../../../../generated/ERC-7818/ERC20";
import { AccountBalance, MintEvent, Token } from "../../../../generated/schema";

export function createMintEvent(
  event: Transfer,
  minter: AccountBalance,
  destination: AccountBalance,
  token: Token
): MintEvent {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let mintEvent = new MintEvent(eventId);

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
