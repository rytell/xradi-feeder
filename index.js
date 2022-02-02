import { abi as RouterABI } from "@rytell/exchange-contracts/artifacts/contracts/periphery/RytellRouter.sol/RytellRouter.json";
import { GraphQLClient } from "graphql-request";
import Web3 from "web3";

import { gql } from "graphql-request";
import dotenv from "dotenv";
dotenv.config();

// TODO add variable
export const userLiquidity = gql`
  {
    user(id: "0xcded56aff69d1d2d69cbfdd86c03df743fc1e95f") {
      liquidityPositions {
        pair {
          id
          token0 {
            name
          }
          token1 {
            name
          }
        }
        liquidityTokenBalance
      }
    }
  }
`;

const endpoint =
  "https://api.thegraph.com/subgraphs/name/pedroomedicina/rytellfuji";

export const client = new GraphQLClient(endpoint);

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
  deadline // timestamp
}) {
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

async function main() {
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

  // TODO trigger swap for testing
  // swapExactAVAXForTokens
  // swapExactTokensForTokens
  swapExactTokensForTokens({
    router,
    web3,
    networkId,
    address,
    privateKey,
    amountInput, // in wei - no esta definido aun
    amountOutputMin, // in wei - no esta definido aun
    path, // address[] - no esta definido aun
    to, // receiver address - no esta definido aun
    deadline // timestamp - no esta definido aun
  })
}

main();
