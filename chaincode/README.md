# FoodChaincode - README

This repository contains the `FoodChaincode`, a Hyperledger Fabric smart contract designed to manage batch data in a supply chain scenario. Below, you will find a brief introduction to Hyperledger Fabric, instructions for setting up the environment on WSL, and commands to interact with the chaincode.

## Introduction to Hyperledger Fabric

Hyperledger Fabric is a permissioned blockchain framework that enables secure, scalable, and flexible applications for business processes. It supports smart contracts, called chaincodes, to automate and enforce rules within a decentralized system.

For more details and initial setup instructions, please refer to the [official Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/).

## Initial Setup

### Prerequisites

1. **Install Docker**: Required for running the network.
2. **Install Go**: Needed for chaincode development.
3. **Install Hyperledger Fabric binaries and configuration files**.

Follow the [installation guide](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) for detailed steps.

### Starting the Test Network

Navigate to the `test-network` folder of Hyperledger Fabric and run the following commands:

1. **Bring down the network** (if already running):

   ```bash
   ./network.sh down
   ```

2. **Start the network and create a channel**:

   ```bash
   ./network.sh up createChannel -c mychannel -ca
   ```

3. **Deploy the chaincode**:
   ```bash
   ./network.sh deployCC -ccn basic -ccp ~/[PATH FOLDER GO CODE] -ccl go
   ```

## Setting Environment Variables

Before interacting with the chaincode, set the following environment variables for Org1:

```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```

For Org2:

```bash
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
```

## Installing the Chaincode

After deploying the chaincode, you can manually install it on peers:

1. Install the chaincode on Org1:

   ```bash
   peer lifecycle chaincode install basic.tar.gz
   ```

2. Install the chaincode on Org2:
   ```bash
   peer lifecycle chaincode install basic.tar.gz
   ```

## Interacting with the Chaincode

### Creating a Batch

Run the following command to create a new batch:

```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n basic -c '{"function":"CreateBatch","Args":["batch1", "Coffee", "ProducerA", "WarehouseA"]}' --peerAddresses localhost:7051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
```

### Querying a Batch

Retrieve batch details using:

```bash
peer chaincode query -C mychannel -n basic -c '{"function":"GetBatchById","Args":["batch1"]}'
```

### Updating Batch State

To update the state of a batch, invoke the `UpdateBatchState` function:

```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n basic -c '{"function":"UpdateBatchState","Args":["batch1", "NewWarehouse", "InTransit"]}' --peerAddresses localhost:7051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
```

### Retrieving Batch History

Get the history of changes for a batch:

```bash
peer chaincode query -C mychannel -n basic -c '{"function":"GetBatchHistory","Args":["batch1"]}'
```

## Monitoraggio dei container Docker

Per monitorare lo stato dei container Docker durante l'esecuzione della rete Fabric, utilizza il seguente comando:

```bash
./monitordocker.sh fabric_test
```
