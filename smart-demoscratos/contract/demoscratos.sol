pragma solidity ^0.4.16;

contract Demoscratos {
  // This declares a new complex type which will
  // be used for variables later.
  // It will represent a single voter.
  struct Voter {
    uint weight; // weight is accumulated by delegation
    bool voted;  // if true, that person already voted
    uint vote;   // index of the voted proposal
  }

  // This is a type for a single proposal.
  struct Proposal {
    bytes32 name;   // short name (up to 32 bytes)
    uint voteCount; // number of accumulated votes
  }

  address public chairperson;

  // This declares a state variable that
  // stores a `Voter` struct for each possible address.
  mapping(address => Voter) public voters;

  // A dynamically-sized array of `Proposal` structs.
  Proposal[] public proposals;
  bytes32[] public proposalNames;
  address[] public votersAddress;

  /// Create a new ballot to choose one of `proposalNames`.
  function Demoscratos(bytes32[] pNames) public {
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    for (uint i = 0; i < pNames.length; i++) {
        proposals.push(Proposal({
            name: pNames[i],
            voteCount: 0
        }));
        proposalNames.push(pNames[i]);

    }
  }

  function giveRightToVote(address[] vs) public {
    require(msg.sender == chairperson);
    for (uint i = 0; i < vs.length; i++) {
        if (!voters[vs[i]].voted && voters[vs[i]].weight == 0) {
            voters[vs[i]].weight = 1;
            votersAddress.push(vs[i]);
        }
    }
  }

  /// Give your vote (including votes delegated to you)
  /// to proposal `proposals[proposal].name`.
  function vote(uint proposal) public returns (uint) {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted);
    sender.voted = true;
    sender.vote = proposal;

    // If `proposal` is out of the range of the array,
    // this will throw automatically and revert all
    // changes.
    proposals[proposal].voteCount += sender.weight;
    return proposals[proposal].voteCount;
  }

  function getProposalNames() public view returns (bytes32[]) {
      return proposalNames;
  }

  function getProposalVoteCount(uint i) public view returns (uint) {
      return proposals[i].voteCount;
  }

  function getVoters() public view returns (address[]) {
      return votersAddress;
  }

  function votedFor() public view returns (bytes32) {
      Voter storage sender = voters[msg.sender];
      if (!sender.voted) {
          return 0x0;
      }
      return proposals[sender.vote].name;
  }
}
