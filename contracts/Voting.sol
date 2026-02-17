// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidateCount;
    mapping(uint => Candidate) public candidates;

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin");
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }
}
