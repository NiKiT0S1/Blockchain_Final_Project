const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("EventTicketing", function () {
    let EventTicketing, contract, owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        EventTicketing = await ethers.getContractFactory("EventTicketing");
        contract = await EventTicketing.deploy();
    });

    // Check correctly deploed contract
    it("Should deploy with correct owner", async function () {
        expect(await contract.owner()).to.equal(owner.address);
    });

    // Nikita's Part: State Changes -- createTicket()
    /* What does it check?

        A new ticket is being created.
        Its "eventName", "price", and "isSold" are saved correctly.
    */
    it("Should create a ticket correctly", async function () {
        await contract.createTicket("Concert", ethers.parseEther("0.1"));

        const ticket = await contract.getTicket(1);
        expect(ticket.eventName).to.equal("Concert");
        expect(ticket.price).to.equal(ethers.parseEther("0.1"));
        expect(ticket.isSold).to.equal(false);
    });

    // Zhengis's Part: Event Emission -- TicketCreated(uint id, string eventName, uint price)
    /* What does it check?

        Calling "createTicket()" should emit "TicketCreated".
        The event arguments (ID, eventName, price) are correct.
    */
    it("Should emit TicketCreated event with correct arguments", async function () {
        await expect(contract.createTicket("Concert", ethers.parseEther("0.1")))
            .to.emit(contract, "TicketCreated")
            .withArgs(1, "Concert", ethers.parseEther("0.1"));
    });

    // Dayana's Part: Error Handling -- Error when creating a ticket with a zero price
    /* What does it check?

        If you try to create a ticket with a price of 0, the contract throws an error with the message "Price must be greater than zero".
        This provides protection against incorrect input data, such as creating free tickets with a zero price.
    */
    it("Should not allow creating a ticket with zero price", async function () {
        await expect(contract.createTicket("Free Event", 0))
            .to.be.revertedWith("Price must be greater than zero");
    });

    // Nikita's Part: State Changes -- purchaseTicket()
    /* What does it check?

        The ticket's "isSold" status is changed to "true".
        The "owner" of the ticket becomes the address of the buyer.
    */
    it("Should purchase a ticket correctly", async function () {
        await contract.createTicket("Festival", ethers.parseEther("0.2"));

        await expect(contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("0.2") }))
            .to.emit(contract, "TicketPurchased")
            .withArgs(1, user1.address, ethers.parseEther("0.2"));

        const ticket = await contract.getTicket(1);
        expect(ticket.isSold).to.equal(true);
        expect(ticket.owner).to.equal(user1.address);
    });

    // Zhengis's Part: Event Emission -- TicketPurchased(uint id, address buyer, uint price)
    /* What does it check?

        A purchase call to "purchaseTicket()" should emit "TicketPurchased".
        The event arguments (ticket ID, buyer address, price) are correct.
    */
    it("Should emit TicketPurchased event with correct arguments", async function () {
        await contract.createTicket("Festival", ethers.parseEther("0.2"));
        await expect(contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("0.2") }))
            .to.emit(contract, "TicketPurchased")
            .withArgs(1, user1.address, ethers.parseEther("0.2"));
    });

    // Dayana's Part: Error Handling -- Error when buying an already sold ticket
    /* What does it check?

        An attempt to purchase a ticket that has already been purchased should be rejected with the error "Ticket already sold".
        This ensures that tickets can only be purchased once.
    */
    it("Should not allow purchasing a sold ticket", async function () {
        await contract.createTicket("Conference", ethers.parseEther("0.3"));
        await contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("0.3") });

        await expect(contract.connect(user2).purchaseTicket(1, { value: ethers.parseEther("0.3") }))
            .to.be.revertedWith("Ticket already sold");
    });

    // Dayana's Part: Error Handling -- Error with insufficient funds
    /* What does it check?

        If the buyer sends less money than is required to purchase the ticket, the contract throws the error "Insufficient payment".
        This ensures that the "purchaseTicket()" function works correctly and checks if enough funds are sent for the ticket purchase.
    */
    it("Should not allow purchasing a ticket with insufficient funds", async function () {
        await contract.createTicket("Expo", ethers.parseEther("0.5"));

        await expect(contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("0.1") }))
            .to.be.revertedWith("Insufficient payment");
    });

    // Khadisha's Part: Input Restrictions -- Error when trying to get a nonexistent ticket
    /* What does it check?

        If the user tries to get a ticket with a non-existent ID (for example, 999), the contract throws an error with the message "Ticket does not exist".
        This ensures that requests for non-existent tickets are handled correctly and do not lead to errors.
    */
    it("Should revert when accessing a non-existent ticket", async function () {
        await expect(contract.getTicket(999)).to.be.revertedWith("Ticket does not exist");
    });

    // Darkhan's Part: Function Return Values -- getTicket(uint _id)
    /* What does it check?

        It checks that the "eventName" and "isSold" values are correctly returned for the given ticket ID (in this case, 1).
        Ensures that the "getTicket()" function returns the correct ticket details.
    */
    it("Should return correct ticket details", async function () {
        await contract.createTicket("Sport Event", ethers.parseEther("0.05"));
        const ticket = await contract.getTicket(1);
        expect(ticket.eventName).to.equal("Sport Event");
        expect(ticket.isSold).to.equal(false);
    });

    // Khadisha's Part: Input Restrictions -- Error with insufficient funds for purchasing
    /* What does it check?

        If the user sends less ether than the required amount for a ticket, the contract throws the error "Insufficient payment".
        This prevents the possibility of buying tickets with insufficient funds.
    */
    it("Should not allow purchasing a ticket with insufficient funds", async function () {
        await contract.createTicket("Expo", ethers.parseEther("0.5"));

        await expect(contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("0.1") }))
            .to.be.revertedWith("Insufficient payment");
    });

    // Nikita's Part: User Restrictions -- Only the owner can withdraw funds
    // BUT THIS FUNCTION ISN'T IN DEPLOYING SMART-CONTRACTS
    // /* What does it check?

    //     It ensures that only the owner can withdraw the funds.
    //     If a non-owner tries to withdraw, the transaction is reverted with the message "Only owner can withdraw".
    //     It also verifies that the owner's balance increases correctly when they withdraw the funds.
    // */
    // it("Should only allow owner to withdraw funds", async function () {
    //     await contract.createTicket("VIP Event", ethers.parseEther("1"));
    //     await contract.connect(user1).purchaseTicket(1, { value: ethers.parseEther("1") });

    //     // User1 (non-owner) tries to withdraw funds and should be rejected
    //     await expect(contract.connect(user1).withdrawFunds())
    //         .to.be.revertedWith("Only owner can withdraw");

    //     // Owner (owner) withdraws funds, and we check the balance change
    //     await expect(contract.withdrawFunds()).to.changeEtherBalance(owner, ethers.parseEther("1"));
    // });
});