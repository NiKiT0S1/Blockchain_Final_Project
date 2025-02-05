var web3;
var address="0xdCD2DF1606cd67323f6A1ED208807f216Bd94849";

async function Connect() {
    await window.web3.currentProvider.enable();
    web3 = new Web3(window.web3.currentProvider);
	alert("Wallet connected!");
}

if(typeof web3 != "undefined") {
    web3 = new Web3(window.web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.Provider.HttpProvider("HTTP://127.0.0.1:7545"));
	alert("Wallet connected!");
}

var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_eventName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "purchaseTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "TicketCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "TicketPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getTicket",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "eventName",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isSold",
						"type": "bool"
					}
				],
				"internalType": "struct EventTicketing.Ticket",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ticketCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isSold",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var contract = new web3.eth.Contract(abi, address);

// Nikita's Part
function createTicket() {
    var eventName = document.getElementById("eventName").value;
    var price = document.getElementById("price").value;

    if(!eventName || !price) {
		alert("Введите название события и цену билета!");
		return;
	}
	
	web3.eth.getAccounts().then(function(account) {
        return contract.methods.createTicket(eventName, price).send({ from: account[0] });
    }).then(function(tmp) {
        $("#eventName").val("");
        $("#price").val("");
    }).catch(function(tmp) {
        alert(tmp);
    });
}

// Dayana's Part
function purchaseTicket() {
    var ticketId = document.getElementById("ticketId").value;
    var ticketPrice = document.getElementById("ticketPrice").value;

    if(!ticketId || !ticketPrice) {
		alert("Введите ID билета или сумму оплаты!");
		return;
	}
	
	web3.eth.getAccounts().then(function(account) {
        return contract.methods.getTicket(ticketId).call();
    }).then(function(ticket) {
        if (ticket.isSold) {
            alert("This ticket has already been sold.");
            return;
        }

        return web3.eth.getAccounts().then(function(account) {

			var requiredPrice = web3.utils.fromWei(ticket.price, "ether"); // Цена билета в ETH

			if (ticketPrice !== requiredPrice) {
				alert("Incorrect payment amount. The ticket price is " + requiredPrice + " ETH.");
				return;
			}

            return contract.methods.purchaseTicket(ticketId).send({ 
                from: account[0], 
                value: web3.utils.toWei(ticketPrice, "ether") 
            });
        });
    }).then(function(tmp) {
        $("#ticketId").val("");
        $("#ticketPrice").val("");
    }).catch(function(tmp) {
        alert(tmp);
    });
}

// Darkhan's Part
function getTicket() {
    var ticketId = document.getElementById("getTicketId").value;

    if(!ticketId) {
		alert("Введите ID билета для поиска");
		return;
	}
	
	contract.methods.getTicket(ticketId).call().then(function(ticket) {
        if (ticket.id == 0) {
            $("#ticketDetails").html("Ticket not found.");
        } else {
			$("#ticketDetails").html(
                "Event ID: " + ticket.id + "<br>" +
                "Event: " + ticket.eventName + "<br>" +
                "Owner: " + ticket.owner + "<br>" +
                "Price: " + web3.utils.fromWei(ticket.price, "ether") + " ETH<br>" +
                "Sold: " + (ticket.isSold ? "Yes" : "No")
            );
        }
    }).catch(function(tmp) {
        alert("Error fetching ticket information.");
    });
}

// Zhengis's Part
function loadEvents() {
    contract.getPastEvents('TicketCreated', {
        fromBlock: 0,
        toBlock: 'latest'
    }).then(function(events) {
        var eventsList = "";
        events.forEach(function(event) {
			var ticketId = event.returnValues.id;
            var eventName = event.returnValues.eventName;
            var price = event.returnValues.price;
            eventsList += "<p>Event " + ticketId + ": "+ eventName + " - Price: " + price + "</p>";
        });
        $("#events").html(eventsList);
    }).catch(function(error) {
        console.error("Error fetching events:", error);
    });
}
