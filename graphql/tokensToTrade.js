import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";
import { BigNumber } from "ethers";

const userLiquidity = gql`
  {
    user(id: "0xcded56aff69d1d2d69cbfdd86c03df743fc1e95f") {
      liquidityPositions {
        pair {
          id
          reserve0
          reserve1
          token0 {
            name
            id
            totalLiquidity
          }
          token1 {
            name
            id
            totalLiquidity
          }
        }
        liquidityTokenBalance
      }
    }
  }
`;

const endpoint = "https://api.thegraph.com/subgraphs/name/pedroomedicina/rytellfuji";

export const client = new GraphQLClient(endpoint);

const {
    user: { liquidityPositions }
  } = await client.request(userLiquidity, {}, {});
 
const hash = {}

liquidityPositions.map( item => {
//intento de suma
    // if(item.pair.token0.name in hash){
    //   console.log(hash["Wrapped AVAX"].toString(), 'if 1')
    //     hash[item.pair.token0.name].add(BigNumber.from(item.pair.reserve0.replace('.', '')));
    // }
    // else {
    //   hash[item.pair.token0.name] = BigNumber.from(item.pair.reserve0.replace('.', ''));
    //   console.log(hash["Wrapped AVAX"]?.toString(), 'if 2')
    // }

    // if(item.pair.token1.name in hash){
    //   console.log(hash["Wrapped AVAX"])
    //   hash[item.pair.token1.name].add("9999999999999999999999999999");
    // }
    // else {
    //   hash[item.pair.token1.name] = BigNumber.from(item.pair.reserve1.replace('.', ''));
    //   console.log(hash["Wrapped AVAX"].toString(), 'if 4')
    // }
    hash[item.pair.token0.name] = item.pair.token0.totalLiquidity
    hash[item.pair.token1.name] = item.pair.token1.totalLiquidity
});

console.log(hash)