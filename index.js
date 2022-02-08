import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import Web3 from "web3";
import dotenv from "dotenv";
import { BigNumber } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import utils from "./utils.mjs";
//import { ERC20_ABI } from "./constants.js";
import { pairsToExchange } from "./graphql/tokensToTrade.js";

const { getTransactionDeadline } = utils;
dotenv.config();

const RPC_API = {
  AVALANCHE: "https://api.avax.network/ext/bc/C/rpc",
  FUJI: "https://api.avax-test.network/ext/bc/C/rpc",
};

const chainId = {
  AVALANCHE: 43114,
  FUJI: 43113,
};

const ROUTER_ADDRESS = {
  AVALANCHE: "0xa333EEBa817519B7F9C8B074b19Af7b6F8076e71",
  FUJI: "0xd0f172F6EeEeB2490fAC02dED056C6CBde07127C",
};

const RADI_STAKING_POOL = {
  FUJI: "0x6DCF1696755311e80B658d419a45BF7F7a7d7CC6",
  AVALANCHE: "0x3EE96FD99f38EB26fF1F019B4f68976952ceEa03",
};

async function swapExactTokensForTokens({
  router,
  web3,
  networkId,
  address,
  privateKey,
  amountInput, // in wei
  amountOutputMin, // in wei
  path, // address[]
  to, // receiver address
  deadline, // timestamp
}) {
  console.log(": BEGAN SWAPPING");
  const swapExactTokensForTokensTx = router.methods.swapExactTokensForTokens(
    amountInput,
    amountOutputMin,
    path,
    to,
    deadline
  );
  try {
    const gas = await swapExactTokensForTokensTx.estimateGas({ from: address });
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const data = swapExactTokensForTokensTx.encodeABI();
      const nonce = await web3.eth.getTransactionCount(address);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: router.options.address,
          data,
          gas,
          gasPrice,
          nonce,
          chainId: networkId,
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(receipt, ": RECEIPT");
      return;
    } catch (error) {
      console.log(error, ": ERROR SENDING");
      throw new Error("ERROR SENDING: SWAP EXACT TOKENS FOR TOKENS");
    }
  } catch (error) {
    console.log(error, ": ERROR ESTIMATING");
    throw new Error("ERROR ESTIMATING: SWAP EXACT TOKENS FOR TOKENS");
  }
}

async function letRouterSpendOurTokens({
  tokenContract,
  router,
  web3,
  networkId,
  address,
  privateKey,
}) {
  const approveTx = tokenContract.methods.approve(
    router.options.address,
    MaxUint256
  );
  try {
    const gas = await approveTx.estimateGas({ from: address });
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const data = approveTx.encodeABI();
      const nonce = await web3.eth.getTransactionCount(address);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: tokenContract.options.address,
          data,
          gas,
          gasPrice,
          nonce,
          chainId: networkId,
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(receipt, ": RECEIPT");
      return;
    } catch (error) {
      console.log(error, ": ERROR SENDING");
      throw new Error("ERROR SENDING: APPROVE");
    }
  } catch (error) {
    console.log(error, ": ERROR ESTIMATING");
    throw new Error("ERROR ESTIMATING: APPROVE");
  }
}

async function retryLetRouterSpendOurTokens({
  tokenContract,
  router,
  web3,
  networkId,
  address,
  privateKey,
}) {
  try {
    console.log("BEGINNING APPROVE: ", tokenContract.options.address);
    await letRouterSpendOurTokens({
      tokenContract,
      router,
      web3,
      networkId,
      address,
      privateKey,
    });
    console.log("FINISHED: ", tokenContract.options.address);
  } catch (error) {
    console.log("RETRIED APPROVE");
    await retryLetRouterSpendOurTokens({
      tokenContract,
      router,
      web3,
      networkId,
      address,
      privateKey,
    });
  }
}

async function approvePathContracts({
  router,
  web3,
  networkId,
  address,
  privateKey,
  tokenContracts,
}) {
  await Promise.all(
    tokenContracts.map(async (tokenContract) => {
      await retryLetRouterSpendOurTokens({
        tokenContract,
        router,
        web3,
        networkId,
        address,
        privateKey,
      });

      return {};
    })
  );
  console.log("FINISHED APPROVING PATH");
  return;
}

async function main() {

  const pairListToExchange = pairsToExchange();
  
  const {
    abi: RouterABI,
  } = require("@rytell/exchange-contracts/artifacts/contracts/periphery/RytellRouter.sol/RytellRouter.json");

  const address = process.env.ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;

  const {
    user: { liquidityPositions },
  } = await client.request(userLiquidity, {}, {});

  console.log(liquidityPositions, ": Result");

  // TODO removeLiquidityAVAXWithPermit
  // TODO removeLiquidityWithPermit

  const web3 = new Web3(
    new Web3.providers.HttpProvider(RPC_API[process.env.NETWORK])
  );
  const networkId = chainId[process.env.NETWORK];
  const router = new web3.eth.Contract(
    RouterABI,
    ROUTER_ADDRESS[process.env.NETWORK]
  );

  const path = [
    "0xA84b0D75cF0cb4515abcC7737544075C02A851Bd", // RADI
    "0x600615234c0a427834A4344D10fEaCA374B2dfCB", // RIORE
  ];

  const tokenContracts = path.map(
    (tokenAddress) => new web3.eth.Contract(ERC20_ABI, tokenAddress)
  );

  await approvePathContracts({
    tokenContracts,
    web3,
    networkId,
    address,
    privateKey,
    router,
  });

  console.log(": FINISHED APPROVING");

  const amountInput = BigNumber.from("1000000000000000000");
  const amountOutputMin = BigNumber.from("1");
  const deadline = getTransactionDeadline();
  const to = RADI_STAKING_POOL[process.env.NETWORK];

  // swapExactAVAXForTokens
  // swapExactTokensForTokens
  await swapExactTokensForTokens({
    router,
    web3,
    networkId,
    address,
    privateKey,
    amountInput, // in wei - no esta definido aun
    amountOutputMin, // in wei - no esta definido aun
    path, // address[] - no esta definido aun
    to, // receiver address - no esta definido aun
    deadline, // timestamp - no esta definido aun
  });
}

main();
