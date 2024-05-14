usdc: ss	0x1fc2ba706161cf643398d7afd6e5423dcdc3e862
rsc: ress	0x300edf5655bac28b5b729080db5c133c69a3a437
loan: dress	0xf3b24d15e596c18ba785153858119d258bb61364

loan abi:
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "borrowUSDC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nftContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "stakeNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdcToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_rtcToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			}
		],
		"name": "hasBorrowerRepaidAllLoans",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "loans",
		"outputs": [
			{
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "repaid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rtcToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdcToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

https://docs.blockdaemon.com/reference/how-to-get-all-nfts-for-a-smart-contract

api key nft : lsH7mZXYOEEUK1p9pIJqRaDv


rtc_token = 0x917d4281AFAfb9d8965707A3EFa398dd4Be66dc6  https://thirdweb.com/lisk-sepolia-testnet/0x917d4281AFAfb9d8965707A3EFa398dd4Be66dc6/explorer

usdc = 0x34b422de20051bDf8fcA23664C8265e70c0FCb21  https://thirdweb.com/lisk-sepolia-testnet/0x34b422de20051bDf8fcA23664C8265e70c0FCb21

cashwave = 0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49  https://thirdweb.com/lisk-sepolia-testnet/0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49