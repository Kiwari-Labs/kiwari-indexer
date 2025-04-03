import {
  Account,
  HistoryERC7858,
  TokenERC7858,
} from "../../../../generated/schema";
import { Transfer } from "../../../../generated/ERC-7858/ERC7858";
import { getOrCreateAccountBalance } from "../../account";

export namespace TransactionType {
  export const SEND: string = "SEND";
  export const RECEIVE: string = "RECEIVE";
}

export function createHistory(
  owner: Account,
  interactor: Account,
  event: Transfer,
  token: TokenERC7858,
  type: string
): HistoryERC7858 {
  let historyId = `${
    owner.id
  }-${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let history = new HistoryERC7858(historyId);

  let ownerAccount = getOrCreateAccountBalance(owner, null, token);
  let interactorAccount = getOrCreateAccountBalance(interactor, null, token);

  history.block = event.block.number;
  history.timestamp = event.block.timestamp;
  history.sender =
    type === TransactionType.RECEIVE ? interactorAccount.id : ownerAccount.id;
  history.receiver =
    type === TransactionType.RECEIVE ? ownerAccount.id : interactorAccount.id;
  history.relatedBalance = ownerAccount.id;
  history.tokenId = event.params.tokenId;
  history.transactionHash = event.transaction.hash;
  history.token = token.id;

  return history;
}
