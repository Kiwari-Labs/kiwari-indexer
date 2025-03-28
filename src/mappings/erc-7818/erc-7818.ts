import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { TokenERC7818 } from "../../../generated/schema";
import { ONE, ZERO } from "../../helpers/number";

export function getOrCreateToken(tokenAddress: Bytes): TokenERC7818 {
  let tokenId = tokenAddress.toHex();
  let existingToken = TokenERC7818.load(tokenId);

  if (existingToken != null) {
    return existingToken as TokenERC7818;
  }

  let newtoken = new TokenERC7818(tokenId);
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
  token: TokenERC7818,
  amount: BigDecimal,
  eventType: string
): TokenERC7818 {
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
