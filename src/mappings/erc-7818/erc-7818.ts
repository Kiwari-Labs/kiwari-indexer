import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Token } from "../../../generated/schema";
import { ONE, ZERO } from "../../helpers/number";

export function getOrCreateToken(tokenAddress: Bytes): Token {
  let tokenId = tokenAddress.toHex();
  let existingToken = Token.load(tokenId);

  if (existingToken != null) {
    return existingToken as Token;
  }

  let newtoken = new Token(tokenId);
  newtoken.address = tokenAddress;
  newtoken.totalSupply = ZERO.toBigDecimal();
  newtoken.totalTokenTransferred = ZERO.toBigDecimal();
  newtoken.totalTokenMinted = ZERO.toBigDecimal();
  newtoken.totalTokenBurned = ZERO.toBigDecimal();
  newtoken.totalEvent = ZERO;
  newtoken.totalEventTransfer = ZERO;
  newtoken.totalEventMint = ZERO;
  newtoken.totalEventBurn = ZERO;

  newtoken.save();

  return newtoken;
}

export function incressTokenAndEvent(
  token: Token,
  amount: BigDecimal,
  eventType: string
): Token {
  let existingToken = getOrCreateToken(token.address);
  existingToken.totalEvent = existingToken.totalEvent!.plus(ONE);

  if (eventType === "mint") {
    existingToken.totalEventMint = existingToken.totalEventMint!.plus(ONE);
    existingToken.totalTokenMinted =
      existingToken.totalTokenMinted!.plus(amount);
  }

  if (eventType === "transfer") {
    existingToken.totalEventTransfer =
      existingToken.totalEventTransfer!.plus(ONE);

    existingToken.totalTokenTransferred =
      existingToken.totalTokenTransferred!.plus(amount);
  }

  if (eventType === "burn") {
    existingToken.totalEventBurn = existingToken.totalEventBurn!.plus(ONE);

    existingToken.totalTokenBurned =
      existingToken.totalTokenBurned!.plus(amount);
  }

  existingToken.save();

  return existingToken;
}
