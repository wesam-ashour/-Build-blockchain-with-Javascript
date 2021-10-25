

const{Blockchain, Transactions} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('3649db7e1da8e5cc52281cb3b888ad66a0a5a5e110afd98844efeb10e063e859');
const myWalletAddress = myKey.getPublic('hex');

let savjeeCoin = new Blockchain();

const tx1 = new Transactions(myWalletAddress, 'Public key gose here', 10);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);



/* transactions they will be pending they will be in the pending transactions
   array so we have to start the miner to actually create a block for them and
   store them on our blockchain */
console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of xavires is', savjeeCoin.getBlanceOfAddress(myWalletAddress));



console.log('Is chain Valid',savjeeCoin.isChainValid());