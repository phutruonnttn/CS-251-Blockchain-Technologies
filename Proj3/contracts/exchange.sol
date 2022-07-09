// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./token.sol";
import "../libraries/ownable.sol";
import "../libraries/SafeMath.sol";

/* This exchange is based off of Uniswap V1. The original whitepaper for the constant product rule
 * can be found here:
 * https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf
 */

contract TokenExchange is Ownable {
    using SafeMath for uint256;

    address public admin;

    address tokenAddr = 0xd54b47F8e6A1b97F3A84f63c867286272b273b7C;
    Nopita private token = Nopita(tokenAddr);

    mapping(address => uint256) internal userLiquidity;

    // Liquidity pool for the exchange
    uint256 public token_reserves = 0;
    uint256 public eth_reserves = 0;

    // Liquidity Rewards
    uint256 public token_reward = 0;
    uint256 public eth_reward = 0;

    // Constant: x * y = k
    uint256 public k;

    // liquidity rewards
    uint256 private swap_fee_numerator = 5;
    uint256 private swap_fee_denominator = 100;

    event AddLiquidity(address from, uint256 amount);
    event RemoveLiquidity(address to, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    function createPool(uint256 amountTokens) external payable onlyOwner {
        // require pool does not yet exist
        require(token_reserves == 0, "Token reserves was not 0");
        require(eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require(msg.value > 0, "Need ETH to create pool.");
        require(amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);

        userLiquidity[msg.sender] += msg.value;

        eth_reserves = msg.value;
        token_reserves = amountTokens;
        k = eth_reserves * token_reserves;
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0);
        require(reserveIn > 0 && reserveOut > 0);
        uint256 numerator = amountIn.mul(reserveOut);
        uint256 denominator = reserveIn.add(amountIn);
        return numerator / denominator;
    }

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountOut > 0);
        require(reserveIn > 0 && reserveOut > 0);
        uint256 numerator = reserveIn.mul(amountOut);
        uint256 denominator = reserveOut.sub(amountOut);

        return (numerator / denominator).add(1);
    }

    function amountTokenGivenETH(uint256 amountToken)
        public
        view
        returns (uint256)
    {
        return (eth_reserves.mul(amountToken) / token_reserves);
    }

    function amountETHGivenToken(uint256 amountETH)
        public
        view
        returns (uint256)
    {
        return (token_reserves.mul(amountETH) / eth_reserves);
    }

    /* ========================= Liquidity Provider Functions =========================  */
    function addLiquidity(uint256 amountOutMin, uint256 amountOutMax)
        external
        payable
    {
        uint256 amountToken = amountETHGivenToken(msg.value);
        require(msg.value > 0, "Need ETH to create pool.");
        require(
            token.balanceOf(msg.sender) >= amountToken,
            "Need more NPT to create pool."
        );

        //check slippage
        require(amountToken >= amountOutMin);
        require(amountToken <= amountOutMax);

        require(token.transferFrom(msg.sender, address(this), amountToken));
        eth_reserves = eth_reserves.add(msg.value);
        token_reserves = token_reserves.add(amountToken);
        k = eth_reserves.mul(token_reserves);

        userLiquidity[msg.sender] += msg.value;

        emit AddLiquidity(msg.sender, msg.value);
    }

    function removeLiquidity(
        uint256 amountETH,
        uint256 amountOutMin,
        uint256 amountOutMax
    ) public payable {
        require(amountETH < eth_reserves);
        require(amountETH <= userLiquidity[msg.sender]);

        uint256 amountTK = amountETHGivenToken(amountETH);
        require(amountTK < token_reserves);

        //check slipage
        require(amountTK >= amountOutMin);
        require(amountTK <= amountOutMax);

        require(token.transfer(msg.sender, amountTK));

        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success);

        eth_reserves = eth_reserves.sub(amountETH);
        token_reserves = token_reserves.sub(amountTK);
        k = eth_reserves.mul(token_reserves);

        userLiquidity[msg.sender] -= amountETH;

        emit RemoveLiquidity(msg.sender, amountETH);
    }

    function removeAllLiquidity(uint256 amountOutMin, uint256 amountOutMax)
        external
        payable
    {
        removeLiquidity(userLiquidity[msg.sender], amountOutMin, amountOutMax);
    }

    /* ========================= Swap Functions =========================  */

    function swapTokensForETH(uint256 amountTokens, uint256 amountOutMin)
        external
        payable
    {
        require(token.balanceOf(msg.sender) >= amountTokens);
        uint256 amountTKExchange = (amountTokens *
            (swap_fee_denominator - swap_fee_numerator)) / swap_fee_denominator;
        token_reward = token_reward + amountTokens - amountTKExchange;
        uint256 amountEth = getAmountOut(
            amountTKExchange,
            token_reserves,
            eth_reserves
        );

        require(amountEth >= amountOutMin); //check slippage

        require(amountEth < eth_reserves);

        require(token.transferFrom(msg.sender, address(this), amountTokens));
        (bool success, ) = msg.sender.call{value: amountEth}("");
        require(success);
        token_reserves = token_reserves.add(amountTKExchange);
        eth_reserves = eth_reserves.sub(amountEth);

        _checkRounding();
    }

    function swapETHForTokens(uint256 amountOutMin) external payable {
        require(msg.value > 0);

        uint256 amountEthExchange = (msg.value *
            (swap_fee_denominator - swap_fee_numerator)) / swap_fee_denominator;
        eth_reward = eth_reward + msg.value - amountEthExchange;

        uint256 amountToken = getAmountOut(
            amountEthExchange,
            eth_reserves,
            token_reserves
        );

        require(amountToken >= amountOutMin); //check slippage

        require(amountToken < token_reserves);
        require(token.transfer(msg.sender, amountToken));

        token_reserves = token_reserves.sub(amountToken);
        eth_reserves = eth_reserves.add(amountEthExchange);

        _checkRounding();
    }

    function _checkRounding() private {
        uint256 check = token_reserves * eth_reserves;
        if (check >= k) {
            check = check - k;
        } else {
            check = k - check;
        }
        assert(check < (token_reserves + eth_reserves + 1));
        k = token_reserves * eth_reserves; // reset k due to small rounding errors
    }
}
