import { Transfer } from "../../../../generated/ERC-7858/ERC7858";
import {
  AccountBalance,
  MintEvent7858,
  TokenERC7858,
} from "../../../../generated/schema";

export function createMintEvent(
  event: Transfer,
  minter: AccountBalance,
  destination: AccountBalance,
  token: TokenERC7858
): MintEvent7858 {
  let eventId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let mintEvent = new MintEvent7858(eventId);

  mintEvent.minter = minter.id;
  mintEvent.destination = destination.id;
  mintEvent.block = event.block.number;
  mintEvent.timestamp = event.block.timestamp;
  mintEvent.transactionHash = event.transaction.hash;
  mintEvent.tokenId = event.params.tokenId;
  mintEvent.token = token.id;

  mintEvent.save();

  return mintEvent;
}
