const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

const contractAddress = 'Our Address';
const contractABI = [
    // Our ABI
  ];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// FUNCTION - transferTicket
async function transferTicket(eventId, newOwner, fromAddress, privateKey) {
    try {
        const tx = contract.methods.transferTicket(eventId, newOwner);

        const gas = await tx.estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();

        const txObject = {
            to: contractAddress,
            data: data,
            gas: gas,
            gasPrice: gasPrice,
        };

        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Ticket successfully transferred:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error while transferring ticket:', error);
        throw error;
    }
}

// EVENT - TicketTransferred
contract.events.TicketTransferred()
    .on('data', (event) => {
        console.log('Ticket Transfer Event:', event.returnValues);
    })
    .on('error', (error) => {
        console.error('Event transmission error:', error);
    });

transferTicket(eventId, newOwner, fromAddress, privateKey);