import { Transfer } from "../../../../generated/ERC-7858/ERC7858";
import {
  AccountBalance,
  TokenERC7858,
  TransferEvent7858,
} from "../../../../generated/schema";

export function createTransferEvent(
  event: Transfer,
  from: AccountBalance,
  to: AccountBalance,
  token: TokenERC7858
): TransferEvent7858 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let transferEvent = new TransferEvent7858(eventId);

  transferEvent.sender = from.id;
  transferEvent.receiver = to.id;
  transferEvent.block = event.block.number;
  transferEvent.timestamp = event.block.timestamp;
  transferEvent.transactionHash = event.transaction.hash;
  transferEvent.tokenId = event.params.tokenId;
  transferEvent.token = token.id;

  transferEvent.save();

  return transferEvent;
}
