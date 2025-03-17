# Kiwari Indexer
This project is a tmeplate indexer for indexing data of ERC-7818 and ERC-7858 tokens, compatible with ERC-20 and ERC-721 tokens.

## DB Diagram
![kiwali-indexer](https://github.com/user-attachments/assets/21a1600b-62a5-4a32-9e8f-2d703c1bbacb)

## Example Query Data
<img width="1366" alt="image" src="https://github.com/user-attachments/assets/2fde928f-2b8e-496f-bd37-264c9e182871" />

## Requirements

- **Node.js version 20.x** (Please make sure you are using Node.js version 20.x)
- Docker

## Setup Instructions

### 1. Clone the repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Kiwari-Labs/kiwari-indexer.git
```

### 2. Install Dependencies

Install the project dependencies:

```bash
yarn install
```

### 3. Create a .env File

Create a .env file in the root directory of the project to store your environment variables:

```bash
touch .env
```


In the .env file, define the necessary variables like so:

```bash
NETWORK: "YOUR NETWORK AND RPC Ex: mainet:https:rpc.com"
```

### 4. Set up the Subgraph

In the subgraph.yml file, set the contract address and start block number:

```yaml
dataSources:
  - kind: ethereum/contract
    name: YourContract
    network: mainnet
    source:
      address: ${CONTRACT_ADDRESS}
      startBlock: ${START_BLOCK}
    mapping:
      # Add your mappings here
```

### 5. Build and Run the Docker Container

Now, you can build and run the Docker container using the following command:

```bash
docker-compose up --build
```
This will build the Docker image and start the container to run the indexer.

### 6. Run the Following Commands to Initialize and Deploy the Indexer
Once the Docker container is up and running, you need to initialize and deploy the indexer:

Create the local environment

```bash
yarn run create-local
```

Deploy the local environment

```bash
yarn run deploy-local
```
Once these commands are executed successfully, your indexer should be up and running, indexing data for the specified contract.




