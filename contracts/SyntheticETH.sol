// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOriginalSETH {
    function getPrice() external view returns (uint256);
}

contract SyntheticETH is ERC20, Ownable {
    address public originalSETHAddress = 0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb;
    IOriginalSETH public originalSETH;

    constructor(address _owner) ERC20("syntheticETH", "sETH") Ownable(_owner) {
        originalSETH = IOriginalSETH(originalSETHAddress);
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function interactWithOriginalSETH() external view returns (uint256) {
        return originalSETH.getPrice();
    }

    function transferToOriginal(address recipient, uint256 amount) external onlyOwner {
        _transfer(msg.sender, recipient, amount);
    }
}
