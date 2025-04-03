import { Transfer } from "../../../../generated/ERC-7818/ERC7818";
import {
  AccountBalance,
  BurnEvent7818,
  TokenERC7818,
} from "../../../../generated/schema";

export function createBurnEvent(
  event: Transfer,
  burner: AccountBalance,
  destination: AccountBalance,
  token: TokenERC7818
): BurnEvent7818 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let burnEvent = new BurnEvent7818(eventId);

  burnEvent.burner = burner.id;
  burnEvent.destination = destination.id;
  burnEvent.block = event.block.number;
  burnEvent.timestamp = event.block.timestamp;
  burnEvent.transactionHash = event.transaction.hash;
  burnEvent.amount = event.params.value.toBigDecimal();
  burnEvent.token = token.id;

  burnEvent.save();

  return burnEvent;
}
