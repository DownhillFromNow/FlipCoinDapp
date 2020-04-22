var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var playerAccount = "";
var withdrawAmt = 0;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        playerAccount = accounts[0];
        contractInstance = new web3.eth.Contract(window.abi, "0x8F85436E9BC2522cF71cd8b2d669439A4b96F861", {from:playerAccount}); //abi is found in the People.json file
        console.log(contractInstance);
    });

    
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
    })
    .on("receipt", function(receipt){
        console.log(receipt);
        alert("Done"); //you can write to the console or issue a pop-up to the user
    })

}


function flipCoinHeads(){
    var betAmount = $("#bet-box").val();

    var config = {value:web3.utils.toWei(betAmount, "ether"), gas:100000};

    contractInstance.methods.flip(0).send(config)
    .on("transactionHash", function(transactionHash){
        console.log("transactionHash: " + transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log("confirmationNr: " + confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log("receipt: " + receipt);
    })
}

function flipCoinTails(){
    var betAmount = $("#bet-box").val();

    var config = {value:web3.utils.toWei(betAmount, "ether"), gas:100000};

    contractInstance.methods.flip(1).send(config)
    .on("transactionHash", function(transactionHash){
        console.log("transactionHash: " + transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log("confirmationNr: " + confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log("receipt: " + receipt);
    })

}

function getWinnings(){
    var amtAmount = $("#amt-box").val();

    var config = {from:playerAccount};

    contractInstance.methods.withdraw(web3.utils.toWei(amtAmount, "ether"))
    .send(config)
    .on("transactionHash", function(hash) {
        console.log('transactionHash: ' + hash);
      })
      .on("confirmation", function(confNum) {
        console.log('confirmation: ' + confNum);
      })
      .on("receipt", function(receipt){
        console.log('receipt: ' + receipt);
        alert("Done");
      });

}



function displayInfo(res){
    $("#myBalance_output").text(Web3.utils.fromWei(res, 'ether'));
}
