import { Transfer } from "../../../../generated/ERC-7818/ERC20";
import {
  AccountBalance,
  TokenERC7818,
  TransferEvent7818,
} from "../../../../generated/schema";

export function createTransferEvent(
  event: Transfer,
  from: AccountBalance,
  to: AccountBalance,
  token: TokenERC7818
): TransferEvent7818 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let transferEvent = new TransferEvent7818(eventId);

  transferEvent.sender = from.id;
  transferEvent.receiver = to.id;
  transferEvent.block = event.block.number;
  transferEvent.timestamp = event.block.timestamp;
  transferEvent.transactionHash = event.transaction.hash;
  transferEvent.amount = event.params.value.toBigDecimal();
  transferEvent.token = token.id;

  transferEvent.save();

  return transferEvent;
}
