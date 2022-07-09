// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BlockchainSplitwise {
    mapping(address => mapping(address => uint32)) stored;
    mapping(address => address[]) listCreditors;
    address[] listUser;

    function getListCreditors(address userAddress)
        public
        view
        returns (address[] memory)
    {
        return listCreditors[userAddress];
    }

    function getListUser() public view returns (address[] memory) {
        return listUser;
    }

    function addToListUser(address user) public {
        listUser.push(user);
    }

    function removeElementFromListCreditors(uint256 _index, address debtor)
        internal
    {
        for (uint256 i = _index; i < listCreditors[debtor].length - 1; i++) {
            listCreditors[debtor][i] = listCreditors[debtor][i + 1];
        }
        listCreditors[debtor].pop();
    }

    function updateStored(
        address debtor,
        address creditor,
        uint32 amount
    ) public {
        stored[debtor][creditor] = amount;
        if (amount == 0) {
            for (uint256 i = 0; i < listCreditors[debtor].length; i++) {
                if (listCreditors[debtor][i] == creditor) {
                    removeElementFromListCreditors(i, debtor);
                    break;
                }
            }
        }
    }

    function lookup(address debtor, address creditor)
        public
        view
        returns (uint32)
    {
        return stored[debtor][creditor];
    }

    function add_IOU(address creditor, uint32 amount) public {
        if (stored[msg.sender][creditor] == 0) {
            listCreditors[msg.sender].push(creditor);
        }
        stored[msg.sender][creditor] += amount;
    }
}
