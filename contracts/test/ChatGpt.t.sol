// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ChatGpt.sol";

contract ChatGptTest is Test {
    ChatGpt public chatGpt;
    address public oracleAddress = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;

    address public owner = address(0x123);
    address public user = address(0x456);
    address public newOracle = address(0x789);

    function setUp() public {
        vm.prank(owner);
        chatGpt = new ChatGpt(oracleAddress);
    }

    function testSetOracleAddress() public {
        vm.prank(owner);
        chatGpt.setOracleAddress(newOracle);
        assertEq(chatGpt.oracleAddress(), newOracle);
    }
}
