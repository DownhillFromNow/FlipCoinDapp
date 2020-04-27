pragma solidity 0.5.12;

contract Main{

uint public balance;

mapping(address => uint) public availableBalances;
mapping(address => bool) public lastFlip;


  modifier costs(uint cost){
        require(msg.value >= cost,"Not enough ETH sent!");
        _;
    }


function addBalance()public payable costs(1 ether){
    availableBalances[msg.sender] += msg.value;
}


function flip(uint betType) public payable returns (bool) {
    require(betType == 1 || betType == 0, "Bet must be heads or tails!"); //Heads will be 0 and Tails will be 1
    require(msg.value <= availableBalances[msg.sender], "You can only bet as much as your balance, deposit more please!");

    if((now % 2 == 0 && betType == 0) || (now % 2 == 1 && betType == 1)){
        availableBalances[msg.sender] += msg.value;
        balance -= msg.value;
        lastFlip[msg.sender] = true;
        return lastFlip[msg.sender];
    }else{
        availableBalances[msg.sender] -= msg.value;
        balance += msg.value;
        lastFlip[msg.sender] = false;
        return lastFlip[msg.sender];
    }
}

function getLastFlip(address user) public view returns(bool){
    return lastFlip[user];
}

function getContractBalance()public view returns(uint){
    return balance;
}

function getUserBalance(address user1)public view returns(uint){
    return availableBalances[user1];
}

function withdrawAll() public returns(uint) {
    uint transfer1 = availableBalances[msg.sender];
    availableBalances[msg.sender] = 0;
    msg.sender.transfer(transfer1);
    return transfer1;
}

}
