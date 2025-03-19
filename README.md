# Kiwari Indexer
This project is a template indexer for indexing data of ERC-7818 and ERC-7858 tokens, compatible with ERC-20 and ERC-721 tokens.

## DB Diagram
![image](https://github.com/user-attachments/assets/6fcabf31-f596-4599-9ef2-ce5190d994d3)

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

### 4. Create a ``config.json`` in the folder config

In the config.json file, define the necessary variables like so:

```bash
{
  "network": "Your network name",
  "factoryAddress": "Your factory contract address", // You only need to set the value when you want to index token data deployed through the factory.
  "startBlock": "The block number from which you want to start indexing.",
  "contractAddress": "Your contract address", // You only need to set the value when you want to index token data that was not deployed through the factory.
}
```

### 5. Build and Run the Docker Container

Now, you can build and run the Docker container using the following command:

```bash
docker-compose up --build
```
This will build the Docker image and start the container to run the indexer.

### 6. Run the Following Commands to Initialize and Deploy the Indexer
Once the Docker container is up and running, you need to initialize and deploy the indexer:

Deploy the local environment (without factory)

```bash
yarn deploy-local:erc7818-without-factory
```

Deploy the local environment (with factory)

```bash
yarn deploy-local:erc7818-with-factory
```
Once these commands are executed successfully, your indexer should be up and running, indexing data for the specified contract.




