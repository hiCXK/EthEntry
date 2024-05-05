// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ethEntry is ERC721 {

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

  uint256 id = 0;
  uint256 totalMinted=0;
     struct Eves{
        string name;
        uint256 cost;
        uint256 maxTickets;
        string date;
        string time;
        string location;
     }

     mapping (uint256 => Eves) idToEves;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createEves(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public {
        require(msg.sender == owner);
      idToEves[id] = Eves(
        _name,
        _cost,
        _maxTickets,
        _date,
        _time,
        _location
        );
        id++;
    } 

    function buyTicket(uint256 _id) public payable{
        require(idToEves[_id].cost>=msg.value);
        require(_id!=0);
        require(_id<=id);
         idToEves[_id].maxTickets--;
         totalMinted++;
        _safeMint(msg.sender,totalMinted);
    }

    function retEves(uint256 _id) public view returns (Eves memory) {
        return idToEves[_id];
    }


    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}

