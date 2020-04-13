pragma solidity 0.5.12;

contract Main{

address payable user;
uint public balance;

mapping(address => uint) public availableBalances;

event userWon(address player, bool won);
event moneyAdded(address player, bool added);


  modifier costs(uint cost){
        require(msg.value >= cost,"Not enough ETH sent!");
        _;
    }


function addBalance()public payable costs(1 ether){
    bool add = true;
    availableBalances[msg.sender] = msg.value;
    emit moneyAdded(msg.sender, add);

}

function flip(uint betType, uint betAmount) public payable {
    require(betType == 1 || betType == 0, "Bet must be heads or tails!"); //Heads will be 0 and Tails will be 1
    require(betAmount <= availableBalances[msg.sender], "You can only bet as much as your balance, deposit more please!");
    bool winner = false;

    if((now % 2 == 0 && betType == 0) || (now % 2 == 1 && betType == 1)){
        availableBalances[msg.sender] += (betAmount * 2);
        winner = true;
    }else{
        availableBalances[msg.sender] -= betAmount;
    }
    emit userWon(msg.sender, winner);
}

function withdraw() public {
    require(availableBalances[msg.sender] > 0.01 ether, "Balance must be larger to withdraw!");
    uint transferAmount = availableBalances[msg.sender];
    msg.sender.transfer(transferAmount);
    availableBalances[msg.sender] = 0;
}

}