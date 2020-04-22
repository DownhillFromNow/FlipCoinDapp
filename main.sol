pragma solidity 0.5.12;

contract Main{

address payable user;
uint public balance;

mapping(address => uint) public availableBalances;

event moneyAdded(address player, bool added);
event coinFlip(address caller, uint256 amount, bool win);


  modifier costs(uint cost){
        require(msg.value >= cost,"Not enough ETH sent!");
        _;
    }


function addBalance()public payable costs(1 ether){
    bool add = true;
    availableBalances[msg.sender] = msg.value;
    emit moneyAdded(msg.sender, add);

}


function flip(uint betType) public payable returns (bool) {
    require(betType == 1 || betType == 0, "Bet must be heads or tails!"); //Heads will be 0 and Tails will be 1
    require(msg.value <= availableBalances[msg.sender], "You can only bet as much as your balance, deposit more please!");
    bool winner;

    if((now % 2 == 0 && betType == 0) || (now % 2 == 1 && betType == 1)){
        availableBalances[msg.sender] += msg.value;
        balance -= msg.value;
        winner = true;
    }else{
        availableBalances[msg.sender] -= msg.value;
        balance += msg.value;
        winner = false;
    }

    emit coinFlip(msg.sender, msg.value, winner); 
    return winner; 
}

function withdraw(uint amt) public {
    require(amt <= availableBalances[msg.sender], "Not enough");
    availableBalances[msg.sender] = 0;
    msg.sender.transfer(amt);
}

}
