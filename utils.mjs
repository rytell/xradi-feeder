
import { BigNumber } from "ethers";

export function getTransactionDeadline() {
  return BigNumber.from(new Date().getTime() + 100000)
}

const allExports = {
  getTransactionDeadline,
}

export default allExports