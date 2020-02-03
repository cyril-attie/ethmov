#Avoiding Common Attacks

The contract prevents reentrancy attacks by inheriting a withdrawal pattern which maps adresses to pending withdrawals and letting users withdraw their balance by calling the function withdraw(). 

Avoids unexpected delegatecall storage manipulation by not calling to any other contract. 

