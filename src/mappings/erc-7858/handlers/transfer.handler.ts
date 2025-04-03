import { GENESIS_ADDRESS } from "../../../constants";
import {
  increaseAccountBalance,
  decreaseAccountBalance,
  increaseTotalTransactionReceive,
  increaseTotalTransactionTransfer,
  getOrCreateAccount,
} from "../../account";
import { Transfer } from "../../../../generated/ERC-7858/ERC7858";
import { getOrCreateToken, incressTokenAndEvent } from "./../erc-7858";
import { TransactionType, createHistory } from "./../history";
import {
  Account,
  AccountBalance,
  TokenERC7858,
} from "../../../../generated/schema";
import { BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { createTransferEvent } from "../events/transferEvent";
import { createMintEvent } from "../events/mintEvent";
import { createBurnEvent } from "../events/burnEvent";

export function transferHandler(event: Transfer): void {
  let transactionAction =
    event.params.to.toHex() == GENESIS_ADDRESS
      ? "burn"
      : event.params.from.toHex() == GENESIS_ADDRESS
        ? "mint"
        : "transfer";

  let fromAccount = getOrCreateAccount(event.params.from);
  let toAccount = getOrCreateAccount(event.params.to);
  let token = getOrCreateToken(event.address);
  let tokenId = event.params.tokenId;

  handleTransfer(
    event,
    fromAccount,
    toAccount,
    token,
    tokenId,
    transactionAction
  );
}

function handleTransfer(
  event: Transfer,
  fromAccount: Account,
  toAccount: Account,
  token: TokenERC7858,
  tokenId: BigInt,
  transactionAction: string
): void {
  let senderAccountBal = updateSenderAccount(
    event,
    fromAccount,
    token,
    tokenId
  );
  let receiverAccountBal = updateReceiverAccount(
    event,
    toAccount,
    token,
    tokenId
  );

  if (transactionAction === "burn") {
    createBurnEvent(event, senderAccountBal, receiverAccountBal, token);
    incressTokenAndEvent(token, transactionAction);
  } else if (transactionAction === "mint") {
    createMintEvent(event, senderAccountBal, receiverAccountBal, token);
    incressTokenAndEvent(token, transactionAction);
  } else {
    createTransferEvent(event, senderAccountBal, receiverAccountBal, token);
    incressTokenAndEvent(token, transactionAction);
  }
}

function updateSenderAccount(
  event: Transfer,
  account: Account,
  token: TokenERC7858,
  tokenId: BigInt
): AccountBalance {
  let accountBalance = decreaseAccountBalance(
    account,
    null,
    tokenId,
    null,
    token
  );
  accountBalance = increaseTotalTransactionTransfer(account, null, token);

  accountBalance.block = event.block.number;
  accountBalance.latestTransactionHash = event.transaction.hash;
  accountBalance.latestTransactionTimestamp = event.block.timestamp;

  createAndSaveHistory(
    account,
    event.params.to,
    event,
    token,
    TransactionType.SEND
  );

  account.save();
  accountBalance.save();

  return accountBalance;
}

function updateReceiverAccount(
  event: Transfer,
  account: Account,
  token: TokenERC7858,
  tokenId: BigInt
): AccountBalance {
  let accountBalance = increaseAccountBalance(
    account,
    null,
    tokenId,
    null,
    token
  );
  accountBalance = increaseTotalTransactionReceive(account, null, token);

  accountBalance.block = event.block.number;
  accountBalance.latestTransactionHash = event.transaction.hash;
  accountBalance.latestTransactionTimestamp = event.block.timestamp;

  createAndSaveHistory(
    account,
    event.params.from,
    event,
    token,
    TransactionType.RECEIVE
  );

  account.save();
  accountBalance.save();

  return accountBalance;
}

function createAndSaveHistory(
  sender: Account,
  receiver: Bytes,
  event: Transfer,
  token: TokenERC7858,
  transactionType: string
): void {
  let interactor = getOrCreateAccount(receiver);

  let history = createHistory(
    sender,
    interactor,
    event,
    token,
    transactionType
  );
  history.save();
}
