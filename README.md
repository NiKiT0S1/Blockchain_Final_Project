# Decentralized Ticketing Platform

## Overview
This project is a decentralized ticketing platform built on Ethereum using Solidity for the smart contract and a web-based frontend for interaction. Users can create, purchase, and retrieve event tickets securely using blockchain technology.

## Features
- **Create Tickets:** Users can create event tickets with a specific name and price.
- **Purchase Tickets:** Users can buy tickets by sending ETH through the smart contract.
- **Retrieve Ticket Information:** Users can query the blockchain to get ticket details.
- **MetaMask Integration:** The platform connects with MetaMask for transactions.
- **Event Tracking:** Past ticket creation events are stored and retrievable.

## Smart Contract (EventTicketing.sol)
The contract contains the following key functionalities:
- `createTicket(string _eventName, uint _price)`: Allows users to create new tickets.
- `purchaseTicket(uint _id)`: Enables ticket purchases with ETH payments.
- `getTicket(uint _id)`: Fetches ticket details by ID.
- Event logging for ticket creation and purchases.

## Frontend (index.html & app.js)
- Built with HTML, Bootstrap, and JavaScript.
- Interacts with the smart contract using Web3.js.
- Provides an interface for users to create and buy tickets.
- Uses MetaMask for transactions.

## Setup and Deployment
### Prerequisites
- Node.js installed
- Ganache or an Ethereum testnet
- MetaMask browser extension
- HTTP server package (`http-server`)

### Running the Project
1. **Deploy the Smart Contract:**
   - Compile and deploy `EventTicketing.sol` on a local blockchain (e.g., Ganache) or a testnet.
   - Copy the deployed contract address and replace the `address` variable in `app.js`.

2. **Start the Local Server:**
   Run the following command in the terminal:
   ```sh
   http-server
   ```
   This will start a local HTTP server to serve the frontend files.

3. **Connect MetaMask:**
   - Open `index.html` in a browser.
   - Click "Connect Wallet" to link MetaMask.

4. **Create & Purchase Tickets:**
   - Enter event details and create a ticket.
   - Retrieve ticket information and purchase tickets.

### Resetting Events
To reset event logs, redeploy the smart contract and update its address in `app.js`.

## Unit Testing (EventTicketing.test.js)
Unit tests for the `EventTicketing.sol` smart contract have been implemented using Hardhat and Ethers.js. The tests validate the correctness of ticket creation, purchasing, and error handling. Below are the key test cases:

- **Contract Deployment:** Ensures the contract is deployed with the correct owner.
- **Creating Tickets:** Verifies that a ticket is created with the correct `eventName`, `price`, and `isSold` status.
- **Event Emission:** Checks that `TicketCreated` and `TicketPurchased` events are emitted with the correct arguments.
- **Error Handling:**
  - Prevents ticket creation with a zero price.
  - Rejects purchasing an already sold ticket.
  - Rejects ticket purchases with insufficient funds.
  - Ensures accessing a nonexistent ticket reverts with an error.
- **State Changes:** Ensures that after a purchase, the ticket is marked as sold and assigned to the correct owner.
- **Function Return Values:** Validates that `getTicket()` returns the correct ticket details.

## Hardhat and Project Structure
- Hardhat and Ethers.js were installed and initialized to enable redeployment of the same smart contract used in Remix IDE without any modifications.
- The project is structured as follows:
  - **`contracts/`**: Contains the `EventTicketing.sol` smart contract.
  - **`test/`**: Contains the `EventTicketing.test.js` file with unit tests.

## Technologies Used
- **Solidity** - Smart contract development
- **Web3.js** - Blockchain interaction
- **MetaMask** - Wallet integration
- **Bootstrap** - Frontend styling
- **Ganache/Testnet** - Local Ethereum environment
- **Hardhat & Ethers.js** - Smart contract deployment and testing
