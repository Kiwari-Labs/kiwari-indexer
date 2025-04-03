import { BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Account,
  AccountBalance,
  TokenERC7818,
  TokenERC7858,
} from "../../../generated/schema";
import { ZERO, ONE } from "../../helpers/number";

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
  erc7818: TokenERC7818 | null,
  erc7858: TokenERC7858 | null
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, erc7818, erc7858);
  accountBal.totalTransactionTransferred =
    accountBal.totalTransactionTransferred.plus(ONE);
  return increaseTotalTransaction(accountBal);
}

export function increaseTotalTransactionReceive(
  account: Account,
  erc7818: TokenERC7818 | null,
  erc7858: TokenERC7858 | null
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, erc7818, erc7858);
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
  amount: BigDecimal | null,
  tokenId: BigInt | null,
  erc7818: TokenERC7818 | null,
  erc7858: TokenERC7858 | null
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, erc7818, erc7858);

  if (erc7818 && amount) {
    accountBal.balance = accountBal.balance.plus(amount);
    accountBal.totalTokenReceived = accountBal.totalTokenReceived.plus(amount);
    accountBal.save();
    return accountBal;
  } else {
    let updatedTokenIds = new Array<BigInt>();

    accountBal.balance = accountBal.balance.plus(BigDecimal.fromString("1"));
    accountBal.totalTokenReceived = accountBal.totalTokenReceived.plus(
      BigDecimal.fromString("1")
    );

    if (accountBal.tokenIds !== null) {
      // Ensure tokenIds is not null
      let tokenIds = accountBal.tokenIds as BigInt[]; // Cast to BigInt[]

      for (let i = 0; i < tokenIds.length; i++) {
        let currentTokenId = tokenIds[i];
        updatedTokenIds.push(currentTokenId);
      }
    }

    updatedTokenIds.push(tokenId as BigInt);

    accountBal.tokenIds = updatedTokenIds;

    accountBal.save();
    return accountBal;
  }
}

export function decreaseAccountBalance(
  account: Account,
  amount: BigDecimal | null,
  tokenId: BigInt | null,
  erc7818: TokenERC7818 | null,
  erc7858: TokenERC7858 | null
): AccountBalance {
  let accountBal = getOrCreateAccountBalance(account, erc7818, erc7858);

  if (erc7818 && amount) {
    accountBal.balance = accountBal.balance.minus(amount);
    accountBal.totalTokenTransferred =
      accountBal.totalTokenTransferred.plus(amount);
    accountBal.save();
    return accountBal;
  } else {
    accountBal.balance = accountBal.balance.minus(BigDecimal.fromString("1"));
    accountBal.totalTokenTransferred = accountBal.totalTokenTransferred.plus(
      BigDecimal.fromString("1")
    );

    let updatedTokenIds = new Array<BigInt>();
    let tokenIds = accountBal.tokenIds;

    if (tokenIds !== null) {
      // Ensure tokenIds is not null
      for (let i = 0; i < tokenIds.length; i++) {
        if (tokenIds[i] != tokenId!) {
          // Remove tokenId
          updatedTokenIds.push(tokenIds[i]);
        }
      }
    }

    accountBal.tokenIds = updatedTokenIds;

    accountBal.save();

    return accountBal;
  }
}

export function getOrCreateAccountBalance(
  account: Account,
  erc7818: TokenERC7818 | null,
  erc7858: TokenERC7858 | null
): AccountBalance {
  if (!erc7818 && !erc7858) {
    throw new Error("At least one token type must be provided");
  }

  let balanceId = erc7818
    ? `${account.id}-${erc7818.id}`
    : `${account.id}-${erc7858!.id}`;

  let accountBal = AccountBalance.load(balanceId);

  if (!accountBal) {
    accountBal = new AccountBalance(balanceId);
    accountBal.account = account.id;
    accountBal.balance = ZERO.toBigDecimal();
    accountBal.totalTransaction = ZERO;
    accountBal.totalTransactionTransferred = ZERO;
    accountBal.totalTransactionReceived = ZERO;
    accountBal.totalTokenTransferred = ZERO.toBigDecimal();
    accountBal.totalTokenReceived = ZERO.toBigDecimal();
    accountBal.tokenIds = erc7818 ? null : [];
    accountBal.save();
  }

  return accountBal;
}
