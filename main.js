/* import the sha-256 function */
const SHA256 = require("crypto-js/sha256");

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
    createTransaction(transaction) {
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

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let savjeeCoin = new Blockchain();



savjeeCoin.createTransaction(new Transactions('address1', 'address2', 100));
savjeeCoin.createTransaction(new Transactions('address2', 'address1', 200));

/* transactions they will be pending they will be in the pending transactions
   array so we have to start the miner to actually create a block for them and
   store them on our blockchain */
console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions('xavires-address');

console.log('\n Balance of xavires is', savjeeCoin.getBlanceOfAddress('xavires-address'));

console.log('\n Starting the miner agian...');
savjeeCoin.minePendingTransactions('xavires-address');

console.log('\n Balance of xavires is', savjeeCoin.getBlanceOfAddress('xavires-address'));
