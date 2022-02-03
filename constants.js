import { ChainId, WAVAX, Token } from "@rytell/sdk";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const USDCe = {
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    ZERO_ADDRESS,
    6,
    "USDC.e",
    "USD Coin"
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    6,
    "USDC.e",
    "USD Coin"
  ),
};

export const RADI = {
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    "0x600615234c0a427834A4344D10fEaCA374B2dfCB",
    18,
    "RADI",
    "RADI"
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    "0x9c5bBb5169B66773167d86818b3e149A4c7e1d1A",
    18,
    "RADI",
    "RADI"
  ),
};

export const USDTe = {
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    "0x2058ec2791dD28b6f67DB836ddf87534F4Bbdf22",
    6,
    "FUJISTABLE",
    "The Fuji stablecoin"
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    6,
    "USDT.e",
    "Tether USD"
  ),
};

export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI], RADI[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [
    WAVAX[ChainId.AVALANCHE],
    USDTe[ChainId.AVALANCHE],
    USDCe[ChainId.AVALANCHE],
    RADI[ChainId.AVALANCHE],
  ],
};

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
