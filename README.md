# LinkedChain

This project was developed as a part of the course ECS 265, Distributed Database Systems taught by
Prof. Mohammad Sadoghi in Fall 2021. Please visit [Expolab](https://expolab.org/) for more info.

## Project Introduction

Our project attempts to ease hurdles faced by potential employers in
verifying the work experience details given by an employee in his/her resume. We use blockchain to solve this problem.
We present **LinkedChain**, a decentralized application, where an employee can register and enter his/her work experience. 
This gets approved/rejected by their employer. All these transactions are stored on blockchain.
A potential employer can verify an employee's work experience details using the employee's public key.



## Project Prerequisites 

1. We used **Metamask** wallet for managing accounts. 
Links to metamask plugin for your favorite browser can be found [here](https://metamask.io/download.html).
After installing metamask, create at least 3 accounts (for contract creator, employer and employee)
using create account option in the metamask plugin.

2. We used **Polygon Network**'s **Mumbai** test blockchain. Please register on [moralis](https://moralis.io/). It is free.
Link to the Mumbai testnet can be obtained in the _speedy nodes_ section of [moralis speedy nodes](https://admin.moralis.io/speedyNodes).
It looks like ![this](/src/assets/Mumbai.png). Add this link to metamask by clicking **Add to metamask** option.

3. Copy and paste above Mumbai network's blockchain in `enviroment/secrets.json`
Also, paste the secret key of the contract creator account created in step 1 in `environment/secrets.json`

4. You need **Polygon's MATIC** currency for transacting with Mumbai blockchain. 
MATIC can be obtained for free from [here](https://faucet.polygon.technology/). 
Enter your public key in the Wallet input and click Submit. 
It might take a few trials before MATIC gets transferred to your wallet.
So please be patient.

All the above steps are required for testing the project as is.
However, you are free to use your own blockchain.
Ensure that you edit `environment/secrets.json` and `hardhat.config.js` accordingly if you do so.

## Project Installation

1. Install `node.js` on your operating system from [here](https://nodejs.org/en/).
2. Run `npm install` to install all the necessary packages.
3. Run `npx hardhat run blockchain/scripts/deploy.js --network mumbai`
to deploy our smart contract on the mumbai testnet.
4. Run `ng serve` and navigate to `http://localhost:4200` 
5. You need to connect the metamask wallet accounts to `http://localhost:4200/`
   After doing so, each account in Metamask should display a green circle on the top left that says 'Connected'.

### Additional Commands

1. Run `npx hardhat test` to run test cases for our smart contract.
Test cases are available at `blockchain/test/test.js`

### Libraries/Frameworks Used

We used [hardhat](https://hardhat.org/) to compile, test and deploy our smart contract,
[ethers](https://docs.ethers.io/v5/) to communicate with the deployed smart contract and
[angular](https://angular.io/) as the web frontend in our project.

### Notes

1. To access employer page: `http://localhost:4200`
2. To access employee page: `http://localhost:4200/employee`
3. Please refresh the page after changing account in Metamask.
