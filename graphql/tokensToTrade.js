import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";
import { BigNumber } from "ethers";

// TODO add variable
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

export const pairsToExchange = () => {
  
  let listOfPairs = [];
  
  liquidityPositions.map( item => {
    const pairIdAndValue = {
      id: item.pair.id,
      name: item.pair.token0.name + "-" + item.pair.token1.name,
      value: item.liquidityTokenBalance
    }
    
      listOfPairs.push(pairIdAndValue)
  });

  return listOfPairs;
}

