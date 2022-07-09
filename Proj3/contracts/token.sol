// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../libraries/erc20.sol";
import "../libraries/ownable.sol";

contract Nopita is Ownable, ERC20 {
    string public constant my_symbol = "NPT";
    string public constant my_name = "Nopita";

    bool private pause;

    constructor() ERC20(my_name, my_symbol) {}

    function _mint(address account, uint256 amount) public onlyOwner {
        require(!pause, "Pause");
        mint(account, amount);
    }

    function _disable_mint() public onlyOwner {
        pause = false;
    }
}
