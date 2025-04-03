import {
  Account,
  HistoryERC7818,
  TokenERC7818,
} from "../../../../generated/schema";
import { Transfer } from "../../../../generated/ERC-7818/ERC20";
import { getOrCreateAccountBalance } from "../../account";

export namespace TransactionType {
  export const SEND: string = "SEND";
  export const RECEIVE: string = "RECEIVE";
}

export function createHistory(
  owner: Account,
  interactor: Account,
  event: Transfer,
  token: TokenERC7818,
  type: string
): HistoryERC7818 {
  let historyId = `${
    owner.id
  }-${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let history = new HistoryERC7818(historyId);

  let ownerAccount = getOrCreateAccountBalance(owner, token, null);
  let interactorAccount = getOrCreateAccountBalance(interactor, token, null);

  history.block = event.block.number;
  history.timestamp = event.block.timestamp;
  history.sender =
    type === TransactionType.RECEIVE ? interactorAccount.id : ownerAccount.id;
  history.receiver =
    type === TransactionType.RECEIVE ? ownerAccount.id : interactorAccount.id;
  history.relatedBalance = ownerAccount.id;
  history.amount = event.params.value.toBigDecimal();
  history.transactionHash = event.transaction.hash;
  history.token = token.id;

  return history;
}
