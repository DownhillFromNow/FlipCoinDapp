var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(window.abi, "0x79f9F38d3Ff5363D2090Be28bc6EA3276F8C2923", {from:accounts[0]}); //abi is found in the People.json file
        console.log(contractInstance);
    });
    
    $("#deposit-button").click(deposit);
    $("#flip-coin").click(flipCoin);
    $("#withdraw").click(withdraw);

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


function flipCoin(){
    var betAmount = $("#bet-box").val();
    var betType = $("#dropdown").val();

    contractInstance.methods.flip(betType, betAmount).send({value:web3.utils.toWei(betAmount, "ether")})
    .on("transactionHash", function(transactionHash){
        console.log("transactionHash");
        console.log(transactionHash); // .on is used to search for listeners
    })
    .on("confirmation", function(confirmationNr){
        console.log("confirmationNr");
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log("receipt");
        console.log(receipt);
        if(events.userWon.returnValues.won){
            $("#play-output").text("You won!");
        }else{
            $("#play-output").text("Unlucky this time!");
        }
    })
}

function withdraw(){
    contractInstance.methods.withdraw().call().then(function(res){
        $("withdraw-output").text(res);
    })

}


