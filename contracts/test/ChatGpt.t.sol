// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ChatGpt.sol";

contract ChatGptTest is Test {
    ChatGpt public chatGpt;
    address public oracleAddress = 0x4168668812C94a3167FCd41D12014c5498D74d7e;

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
