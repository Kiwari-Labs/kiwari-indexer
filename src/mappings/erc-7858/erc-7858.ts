import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { TokenERC7858 } from "../../../generated/schema";
import { ONE, ZERO } from "../../helpers/number";

export function getOrCreateToken(tokenAddress: Bytes): TokenERC7858 {
  let tokenId = tokenAddress.toHex();
  let existingToken = TokenERC7858.load(tokenId);

  if (existingToken != null) {
    return existingToken as TokenERC7858;
  }

  let newtoken = new TokenERC7858(tokenId);
  newtoken.address = tokenAddress;
  newtoken.totalSupply = ZERO;
  newtoken.totalTokenTransferred = ZERO;
  newtoken.totalTokenMinted = ZERO;
  newtoken.totalTokenBurned = ZERO;
  newtoken.totalEvent = ZERO;
  newtoken.totalEventTransfer = ZERO;
  newtoken.totalEventMint = ZERO;
  newtoken.totalEventBurn = ZERO;

  newtoken.save();

  return newtoken;
}

export function incressTokenAndEvent(
  token: TokenERC7858,
  eventType: string
): TokenERC7858 {
  let existingToken = getOrCreateToken(token.address);
  existingToken.totalEvent = existingToken.totalEvent!.plus(ONE);

  if (eventType === "mint") {
    existingToken.totalEventMint = existingToken.totalEventMint!.plus(ONE);
    existingToken.totalTokenMinted = existingToken.totalTokenMinted!.plus(ONE);
  }

  if (eventType === "transfer") {
    existingToken.totalEventTransfer =
      existingToken.totalEventTransfer!.plus(ONE);

    existingToken.totalTokenTransferred =
      existingToken.totalTokenTransferred!.plus(ONE);
  }

  if (eventType === "burn") {
    existingToken.totalEventBurn = existingToken.totalEventBurn!.plus(ONE);

    existingToken.totalTokenBurned = existingToken.totalTokenBurned!.plus(ONE);
  }

  existingToken.save();

  return existingToken;
}
