import { Transfer } from "../../../../generated/ERC-7858/ERC7858";
import {
  AccountBalance,
  BurnEvent7858,
  TokenERC7858,
} from "../../../../generated/schema";

export function createBurnEvent(
  event: Transfer,
  burner: AccountBalance,
  destination: AccountBalance,
  token: TokenERC7858
): BurnEvent7858 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let burnEvent = new BurnEvent7858(eventId);

  burnEvent.burner = burner.id;
  burnEvent.destination = destination.id;
  burnEvent.block = event.block.number;
  burnEvent.timestamp = event.block.timestamp;
  burnEvent.transactionHash = event.transaction.hash;
  burnEvent.tokenId = event.params.tokenId;
  burnEvent.token = token.id;

  burnEvent.save();

  return burnEvent;
}
