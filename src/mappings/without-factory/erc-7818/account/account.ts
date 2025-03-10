import { BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import {
  Account,
  AccountBalance,
  Token,
} from "../../../../../generated/schema";
import { ZERO, ONE } from "../../../../helpers/number";

export function getOrCreateAccount(accountAddress: Bytes): Account {
  let accountId = accountAddress.toHex();
  let account = Account.load(accountId);

  if (!account) {
    account = new Account(accountId);
    account.address = accountAddress;
    account.save();
  }

  return account;
}

export function increaseTotalTransactionTransfer(
  account: Account,
  token: Token
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, token);
  accountBal.totalTransactionTransferred =
    accountBal.totalTransactionTransferred.plus(ONE);
  return increaseTotalTransaction(accountBal);
}

export function increaseTotalTransactionReceive(
  account: Account,
  token: Token
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, token);
  accountBal.totalTransactionReceived =
    accountBal.totalTransactionReceived.plus(ONE);
  return increaseTotalTransaction(accountBal);
}

function increaseTotalTransaction(accountBal: AccountBalance): AccountBalance {
  accountBal.totalTransaction = accountBal.totalTransaction.plus(ONE);
  accountBal.save();
  return accountBal;
}

export function increaseAccountBalance(
  account: Account,
  amount: BigDecimal,
  token: Token
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, token);
  accountBal.balance = accountBal.balance.plus(amount);
  accountBal.totalTokenReceived = accountBal.totalTokenReceived.plus(amount);
  accountBal.save();
  return accountBal;
}

export function decreaseAccountBalance(
  account: Account,
  amount: BigDecimal,
  token: Token
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, token);
  accountBal.balance = accountBal.balance.minus(amount);
  accountBal.totalTokenTransferred =
    accountBal.totalTokenTransferred.plus(amount);
  accountBal.save();
  return accountBal;
}

export function getOrCreateAccountBalance(
  account: Account,
  token: Token
): AccountBalance {
  let balanceId = `${account.id}-${token.id}`;
  let accountBal = AccountBalance.load(balanceId);

  if (!accountBal) {
    accountBal = new AccountBalance(balanceId);
    accountBal.account = account.id;
    accountBal.token = token.id;
    accountBal.balance = ZERO.toBigDecimal();
    accountBal.totalTransaction = ZERO;
    accountBal.totalTransactionTransferred = ZERO;
    accountBal.totalTransactionReceived = ZERO;
    accountBal.totalTokenTransferred = ZERO.toBigDecimal();
    accountBal.totalTokenReceived = ZERO.toBigDecimal();
    accountBal.save();
  }

  return accountBal;
}
