/* import the sha-256 function */
const SHA256 = require("crypto-js/sha256");

class Block {
    
    /* this constructor will receive the properties of this block and so
       each block will have an index a timestamp some data and the previous hash */
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    /* calculate the hash function of this block so it's going to 
        take the properties of this block run them through them hash function and then
        return the hash this will identify our block on the blockchain */
    calculateHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {

    /* the constructor is responsible for initializing our blockchain */
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    /* this method create Genesis block and this is going to return a new block */
    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0");
    }

    /* add an add block method that will receive in block now the get latest block method */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    /* this method is responsible for adding a new block on to the chain */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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
savjeeCoin.addBlock(new Block(1, "01/01/2021", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "02/02/2021", { amount: 10 }));

/* check if our block chain is valid */
console.log("Is blockchain valid? " + savjeeCoin.isChainValid());

savjeeCoin.chain[1].data = { amount: 100 };
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

console.log("Is blockchain valid? " + savjeeCoin.isChainValid());

/* console lock our block chain to stringify before we output it */
 //console.log(JSON.stringify(savjeeCoin, null, 4));
