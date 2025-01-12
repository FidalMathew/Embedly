// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollContract {

    // Struct to represent a poll option
    struct Poll {
        string text;               // Question text
        string[] options;         // Poll options
        mapping(uint256 => uint256) votes; // Votes per option (index to count, starting from 1)
        mapping(address => uint256) userVotes; // Tracks which option a user has voted for
        uint256 totalVotes;       // Total votes in the poll
    }

    // Array to store all polls
    Poll[] public polls;

    // Event for creating a poll
    event PollCreated(uint256 pollId, string text, string[] options);

    // Event for voting
    event Voted(uint256 pollId, uint256 optionIndex, address voter);

    // Function to create a poll
    function createPoll(string memory _text, string[] memory _options) external {
        require(_options.length > 1, "A poll must have at least 2 options.");

        Poll storage newPoll = polls.push();
        newPoll.text = _text;
        newPoll.options = _options;

        emit PollCreated(polls.length, _text, _options); // Poll ID starts from 1
    }

    // Function to vote on a specific poll
    function vote(uint256 _pollId, uint256 _optionIndex) external {
        require(_pollId > 0 && _pollId <= polls.length, "Poll does not exist.");
        Poll storage poll = polls[_pollId - 1]; // Adjust poll index to be 0-based

        require(poll.userVotes[msg.sender] == 0, "You have already voted on this poll.");
        require(_optionIndex > 0 && _optionIndex <= poll.options.length, "Invalid option index.");

        poll.votes[_optionIndex] += 1;
        poll.userVotes[msg.sender] = _optionIndex; // Store option index directly (1-based)
        poll.totalVotes += 1;

        emit Voted(_pollId, _optionIndex, msg.sender);
    }

    // Function to get live results of a poll
    function getLiveResults(uint256 _pollId) external view returns (
        string memory text,
        string[] memory options,
        uint256[] memory voteCounts,
        uint256 totalVotes
    ) {
        require(_pollId > 0 && _pollId <= polls.length, "Poll does not exist.");
        Poll storage poll = polls[_pollId - 1]; // Adjust poll index to be 0-based

        uint256[] memory counts = new uint256[](poll.options.length);
        for (uint256 i = 0; i < poll.options.length; i++) {
            counts[i] = poll.votes[i + 1]; // Adjust option index to 1-based
        }

        return (poll.text, poll.options, counts, poll.totalVotes);
    }

    // Function to check which option a user voted for in a specific poll
    function getUserVote(uint256 _pollId, address _user) external view returns (uint256) {
        require(_pollId > 0 && _pollId <= polls.length, "Poll does not exist.");
        Poll storage poll = polls[_pollId - 1]; // Adjust poll index to be 0-based

        uint256 votedOption = poll.userVotes[_user];
        require(votedOption > 0, "User has not voted on this poll.");

        return votedOption; // Return 1-based option index
    }

    function getPollCount() external view returns (uint256) {
        return polls.length;
    }
}
