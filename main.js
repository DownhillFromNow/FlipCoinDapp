var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var playerAccount = "";
var withdrawAmt = 0;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        playerAccount = accounts[0];
        contractInstance = new web3.eth.Contract(window.abi, "0xe1522190f5dA30BA4a0aB1CbA8dc8d754F15a619", {from:playerAccount}); //abi is found in the People.json file
        console.log(contractInstance);
    });

    $("#result-output").html("Nearly there, just deposit some Ether.");
    $("#deposit-button").click(deposit);
    $("#flip-coin-heads").click(flipCoinHeads);
    $("#flip-coin-tails").click(flipCoinTails);
    $("#withdraw").click(getWinnings);

    //click handler, executes the function in bracets
    
});

function deposit(){
    var config = {value: web3.utils.toWei("1", "ether"),
                gas:100000};

    contractInstance.methods.addBalance().send(config)
    .on("transactionHash", function(transactionHash){
        console.log(transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
        $("#result-output").html("Good Luck to you Sir!");
    })
    .on("receipt", function(receipt){
        console.log(JSON.stringify(receipt));
        alert("Done"); //you can write to the console or issue a pop-up to the user
        getContractBalance();
        getUserBalance();
    })

}


function flipCoinHeads(){
    var betAmount = $("#bet-box").val();

    var config = {value:web3.utils.toWei(betAmount.toString(), "ether"), gas:100000};

    contractInstance.methods.flip(0).send(config)
    .on("transactionHash", function(transactionHash){
        console.log("transactionHash: " + transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log("confirmationNr: " + confirmationNr);
        getOutput();
    })
    .on("receipt", function(receipt){
        console.log("receipt: " + JSON.stringify(receipt));
        getContractBalance();
        getUserBalance();
    })
}

function flipCoinTails(){
    $("#result-output").html("Good Luck to you Sir!");
    var betAmount = $("#bet-box").val();

    var config = {value:web3.utils.toWei(betAmount.toString(), "ether"), gas:100000};

    contractInstance.methods.flip(1).send(config)
    .on("transactionHash", function(transactionHash){
        console.log("transactionHash: " + transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log("confirmationNr: " + confirmationNr);
        getOutput();
    })
    .on("receipt", function(receipt){
        console.log("receipt: " + JSON.stringify(receipt));
        getContractBalance();
        getUserBalance();
    })

}

function getWinnings(){
    contractInstance.methods.withdrawAll()
    .send().then(function(result){
        result = web3.utils.fromWei(result, "ether");
        alert("Balance withdrawn")
        console.log(result);
    })
}   



function displayInfo(res){
    $("#user-balance-output").text(Web3.utils.fromWei(res, 'ether'));
}

function getOutput(){
    contractInstance.methods.getLastFlip(playerAccount).call().then(function(result){
        console.log(result);
        if(result){
            $("#result-output").html("You Won, Congrats!");
        }else{
            $("#result-output").html("You Lost, Better Luck Next Time!");
        }
    });
}

function getUserBalance(){
    contractInstance.methods.getUserBalance(playerAccount).call().then(function(result1){
        newResult = web3.utils.fromWei(result1 , "ether");
        console.log(newResult);
        $("#user-balance-output").html(newResult);
    })
}

function getContractBalance(){
    contractInstance.methods.getContractBalance().call().then(function(result2){
        newResult1 = web3.utils.fromWei(result2, "ether");
        console.log(newResult1);
        $("#contract-balance-output").html(newResult1);
    });
}
