// // SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventSystem is Ownable {
    address public nftContractAddress;
    uint256 public eventCount;

    struct Event {
        uint256 id;
        string name;
        string description;
        uint256 duration;
        uint256 dateCreated;
        bool isCanceled;
    }

    struct Users {
        string name;
        string email;
    }

    mapping (uint256 => mapping (address => bool)) registeredUsers;
    mapping (uint256 => Event) eventCreated;
    mapping (string => address) nameToAddress;
    mapping (string => address) emailToAddress;
    mapping (address => Users) user;

    event EventCreatedSuccessfully(uint256 indexed id, string indexed name);
    event UserRegistrationSuccessful(uint256 indexed id, string indexed name, string indexed email);

    constructor(address _nftContractAddress) Ownable(msg.sender) {
        nftContractAddress = _nftContractAddress;
    } 

    function createEvent(uint256 _duration, string memory _name, string memory _description) external {
        require(msg.sender != address(0), "Address zero detected");
        require(eventCount < 10, "Maximum event created");

        uint256 _id = eventCount + 1;
        uint256 date = block.timestamp;

        Event storage evnt = eventCreated[_id];

        evnt.id = _id;
        evnt.name = _name;
        evnt.description = _description;
        evnt.duration = _duration * 1 days;
        evnt.dateCreated = date;

        eventCount += 1;

        emit EventCreatedSuccessfully(_id, _name);
    }

    function registerForEvent(uint256 _id, string memory _name, string memory _email) external {
        require(msg.sender != address(0), "Address zero detected");

        IERC721 _nftContract = IERC721(nftContractAddress);
        require(_nftContract.balanceOf(msg.sender) > 0, "You must own an NFT to register");

        Event storage evnt = eventCreated[_id];
        require(evnt.id != 0, "Invalid event ID");
        
        require(!registeredUsers[_id][msg.sender], "Already registered for the event");
        uint256 _duration = evnt.dateCreated + evnt.duration;
        require(block.timestamp < _duration, "Event registration ended");

        user[msg.sender] = Users(_name, _email);
        nameToAddress[_name] = msg.sender;
        emailToAddress[_email] = msg.sender;

        registeredUsers[_id][msg.sender] = true;

        emit UserRegistrationSuccessful(_id, _name, _email);
    }

    function getRegisteredUserByName(string memory _name) external view onlyOwner returns (Users memory) {
        address userAddress = nameToAddress[_name];
        require(userAddress != address(0), "User not found with the given name");

        Users memory usr = user[userAddress];
        return usr;
    }
}
