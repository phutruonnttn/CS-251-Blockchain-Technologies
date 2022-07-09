// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //                  

// sets up web3.js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const exchange_name = 'ABCSwap'; // TODO: fill in the name of your exchange

const token_name = 'Nopita'; // TODO: replace with name of your token
const token_symbol = 'NPT'; // TODO: replace with symbol for your token


// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================
// TODO: Paste your token contract address and ABI here:
const token_address = '0xd54b47F8e6A1b97F3A84f63c867286272b273b7C';
const token_abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_disable_mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "_mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "my_name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "my_symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const token_contract = new web3.eth.Contract(token_abi, token_address);

// TODO: Paste your exchange address and ABI here
const exchange_abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "AddLiquidity",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RemoveLiquidity",
        "type": "event"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMax",
                "type": "uint256"
            }
        ],
        "name": "addLiquidity",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }],
        "name": "amountETHGivenToken",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountToken",
            "type": "uint256"
        }],
        "name": "amountTokenGivenETH",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountTokens",
            "type": "uint256"
        }],
        "name": "createPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eth_reserves",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountIn",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountOut",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "k",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMax",
                "type": "uint256"
            }
        ],
        "name": "removeAllLiquidity",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountETH",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMax",
                "type": "uint256"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }],
        "name": "swapETHForTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "amountTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            }
        ],
        "name": "swapTokensForETH",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token_reserves",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
];
const exchange_address = '0x9F544a3Fc3D1045e6ec49D4ecEF6dCD700457165';
const exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

/*** INIT ***/
async function init() {
    var poolState = await getPoolState();
    if (poolState['token_liquidity'] === 0 &&
        poolState['eth_liquidity'] === 0) {
        // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
        const total_supply = 10000000000;
        await token_contract.methods._mint(web3.eth.defaultAccount, total_supply / 2).send({ from: web3.eth.defaultAccount, gas: 999999 });
        await token_contract.methods._mint(web3.eth.defaultAccount, total_supply / 2).send({ from: web3.eth.defaultAccount, gas: 999999 });
        await token_contract.methods._disable_mint().send({ from: web3.eth.defaultAccount, gas: 999999 });
        await token_contract.methods.approve(exchange_address, total_supply).send({ from: web3.eth.defaultAccount });
        // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
        await exchange_contract.methods.createPool(total_supply).send({ from: web3.eth.defaultAccount, value: total_supply, gas: 999999 });

        // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
    }
}

async function getPoolState() {
    // read pool balance for each type of liquidity
    let liquidity_tokens = await exchange_contract.methods.token_reserves().call({ from: web3.eth.defaultAccount });
    let liquidity_eth = await exchange_contract.methods.eth_reserves().call({ from: web3.eth.defaultAccount });
    return {
        // token_liquidity: liquidity_tokens * 10 ** (-18),
        // eth_liquidity: liquidity_eth * 10 ** (-18),
        token_liquidity: liquidity_tokens,
        eth_liquidity: liquidity_eth,
        token_eth_rate: liquidity_tokens / liquidity_eth,
        eth_token_rate: liquidity_eth / liquidity_tokens
    };
}

// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================
async function addLiquidity(amountEth, maxSlippagePct) {
    if (maxSlippagePct == '') maxSlippagePct = 0;
    var amounTk = await exchange_contract.methods.amountETHGivenToken(amountEth).call({ from: web3.eth.defaultAccount });
    await token_contract.methods.approve(exchange_address, amounTk).send({ from: web3.eth.defaultAccount });
    await exchange_contract.methods.addLiquidity(Math.round(amounTk * ((100 - maxSlippagePct) / 100)), Math.round(amounTk * ((100 + maxSlippagePct) / 100))).send({ from: web3.eth.defaultAccount, value: amountEth, gas: 999999 });
}

async function removeLiquidity(amountEth, maxSlippagePct) {
    if (maxSlippagePct == '') maxSlippagePct = 0;
    var amounTk = await exchange_contract.methods.amountETHGivenToken(amountEth).call({ from: web3.eth.defaultAccount });
    await exchange_contract.methods.removeLiquidity(amountEth, Math.round(amounTk * ((100 - maxSlippagePct) / 100)), Math.round(amounTk * ((100 + maxSlippagePct) / 100))).send({ from: web3.eth.defaultAccount, gas: 999999 });
}

async function removeAllLiquidity(maxSlippagePct) {
    if (maxSlippagePct == '') maxSlippagePct = 0;
    var amounTk = await exchange_contract.methods.amountETHGivenToken(amountEth).call({ from: web3.eth.defaultAccount });
    await exchange_contract.methods.removeAllLiquidity(Math.round(amounTk * ((100 - maxSlippagePct) / 100)), Math.round(amounTk * ((100 + maxSlippagePct) / 100))).send({ from: web3.eth.defaultAccount, gas: 999999 });
}

async function swapTokensForETH(amountToken, maxSlippagePct) {
    if (maxSlippagePct == '') maxSlippagePct = 0;
    var poolState = await getPoolState();
    var amountOutMin = await exchange_contract.methods.getAmountOut(amountToken,
        poolState['token_liquidity'],
        poolState['eth_liquidity']).call({ from: web3.eth.defaultAccount });
    await token_contract.methods.approve(exchange_address, amountToken).send({ from: web3.eth.defaultAccount }); //co the check xem co du token khong moi approve
    await exchange_contract.methods.swapTokensForETH(amountToken, Math.round(amountOutMin * ((100 - maxSlippagePct) / 100))).send({ from: web3.eth.defaultAccount, gas: 999999 });
}

async function swapETHForTokens(amountETH, maxSlippagePct) {
    if (maxSlippagePct == '') maxSlippagePct = 0;
    var poolState = await getPoolState();
    var amountOutMin = await exchange_contract.methods.getAmountOut(amountETH,
        poolState['eth_liquidity'],
        poolState['token_liquidity']).call({ from: web3.eth.defaultAccount });
    await exchange_contract.methods.swapETHForTokens(Math.round(amountOutMin * ((100 - maxSlippagePct) / 100))).send({ from: web3.eth.defaultAccount, value: amountETH, gas: 999999 });
}

// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
web3.eth.getAccounts().then((response) => {
    web3.eth.defaultAccount = response[0];
    // Initialize the exchange
    init().then(() => {
        // fill in UI with current exchange rate:
        getPoolState().then((poolState) => {
            $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
            $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

            $("#token-reserves").html(poolState['token_liquidity'] * 10 ** (-18) + " " + token_symbol);
            $("#eth-reserves").html(poolState['eth_liquidity'] * 10 ** (-18) + " ETH");
        });
    });
});

// Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response) => {
    var opts = response.map(function(a) {
        return '<option value="' +
            a.toLowerCase() + '">' + a.toLowerCase() + '</option>'
    });
    $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    removeAllLiquidity($("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// Fills in relevant parts of UI with your token and exchange name info:
$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);