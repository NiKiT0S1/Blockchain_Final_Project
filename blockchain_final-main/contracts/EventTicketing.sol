// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.0;

contract EventTicketing {
    struct Ticket {
        uint id;
        string eventName;
        address owner;
        uint price;
        bool isSold;
    }

    mapping(uint => Ticket) public tickets;
    uint public ticketCount;
    address public owner;

    event TicketCreated(uint id, string eventName, uint price);
    event TicketPurchased(uint id, address buyer, uint price);

    constructor() {
        owner = msg.sender;
    }

    function createTicket(string memory _eventName, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        ticketCount++;
        tickets[ticketCount] = Ticket(ticketCount, _eventName, msg.sender, _price, false);
        emit TicketCreated(ticketCount, _eventName, _price);
    }

    function purchaseTicket(uint _id) public payable {
        require(tickets[_id].id != 0, "Ticket does not exist");
        require(!tickets[_id].isSold, "Ticket already sold");
        require(msg.value >= tickets[_id].price, "Insufficient payment");
        
        tickets[_id].owner = msg.sender;
        tickets[_id].isSold = true;
        payable(owner).transfer(msg.value);
        
        emit TicketPurchased(_id, msg.sender, tickets[_id].price);
    }

    function getTicket(uint _id) public view returns (Ticket memory) {
        require(tickets[_id].id != 0, "Ticket does not exist");
        return tickets[_id];
    }
}
