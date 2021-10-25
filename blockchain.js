/* import the sha-256 function */
const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/* This class for receives a from address a to address and an amount this is pretty straightforward
   a transaction always comes from someone it goes to someone and it carries a certain amount of coins
    and then we're just going to assign each of these from address equals from address this to entrance
     equals to address this done amount equals amount with that out of the way */
class Transactions {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    
    }
    /* creating the hash of our transaction */

    signTransaction(signingkey){
        if(signingkey.getPublic('hex') !== this.fromAddress){
            throw new Error('you can not sgin transactions for other wallets');
        }

        const hashTx = this.calculateHash();
        const sig = signingkey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    

    /* verify if our transaction has been correctly signed */

    isValid(){
        if(this.fromAddress === null)return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {

    /* this constructor will receive the properties of this block and so
       each block will have an index a timestamp some data and the previous hash */
    constructor(timestamp, Transactions, previousHash = "") {
        this.timestamp = timestamp;
        this.Transactions = Transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.noce = 0;
    }

    /* calculate the hash function of this block so it's going to 
        take the properties of this block run them through them hash function and then
        return the hash this will identify our block on the blockchain */
    calculateHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.noce
        ).toString();
    }

    mineBlock(difficlty) {
        while (this.hash.substring(0, difficlty) !== Array(difficlty + 1).join("0")) {
            this.noce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    /* can verify all the transactions in the current block so I'm gonna say has valid
       transaction */

    hasValidTransactions(){
        for(const tx of this.Transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain {

    /* the constructor is responsible for initializing our blockchain */
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficlty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /* this method create Genesis block and this is going to return a new block */
    createGenesisBlock() {
        return new Block("01/01/2021", "Genesis Block", "0");
    }

    /* add an add block method that will receive in block now the get latest block method */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /* pending transactions this will receive an address it will receive a mining reward address
       so when a miner calls this method it will pass along its wallet address and successfully 
       mined this block then send the reward to this address */
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficlty);

        console.log('Block Successfully muned!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)

        ];
    }

    /* transaction and this will receive a transaction and all this will  
       do is add this to the pending transactions */
    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('can not add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /* this method will of course receive an address that we have to check its balance */
    getBlanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.Transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    /* this is going to return either true if the chain is valid and 
       false if something is wrong now in order to verify the integrity */

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;