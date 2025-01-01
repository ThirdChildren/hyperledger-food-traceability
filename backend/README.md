# Backend for Hyperledger Fabric Food Traceability

This backend is implemented using Node.js and TypeScript to interact with the Hyperledger Fabric network for a food traceability application. It provides APIs to register users, enroll admin identities, and invoke or query the smart contract deployed on the Fabric network.

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js (v16 or later) and npm installed.
2. **Hyperledger Fabric Network**: Set up the test network using Fabric samples.
   - Follow the instructions in the [Fabric documentation](https://hyperledger-fabric.readthedocs.io/) to set up the network.
   - Ensure that the `basic` chaincode is deployed on the `mychannel` channel.
3. **Connection Profile**: Have the connection profile files (`connection-org1.json` and `connection-org2.json`) in place.
4. **Docker**: Ensure Docker is running to support the Fabric network.

## Setting Up the Backend

### 1. Clone the Repository

```bash
git clone [repository-url]
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Environment

#### a. Wallet Directory

Ensure the `wallet` directory is present in the backend folder. This will store the admin and user identities.

#### b. Connection Profiles

Copy the connection profile files (`connection-org1.json`) into the `src/config` directory.

### 4. Enroll the Admin

Run the `enrollAdmin.ts` script to enroll the admin identity for Org1.

```bash
npx ts-node src/register/enrollAdmin.ts
```

### 5. Register the User

Register the user identity using the `registerUser.ts` script.

```bash
npx ts-node src/register/registerUser.ts
```

### 6. Start the Server

Start the backend server to handle API requests.

```bash
npm start
```

## API Endpoints

### 1. **Create Batch**

- **POST** `/api/batch`
- **Description**: Creates a new batch in the Fabric ledger.
- **Request Body**:
  ```json
  {
    "id": "batch1",
    "productType": "Coffee",
    "producer": "ProducerA",
    "currentNode": "WarehouseA"
  }
  ```

### 2. **Get Batch by ID**

- **GET** `/api/batch/:id`
- **Description**: Fetches details of a batch using its ID.

### 3. **Update Batch State**

- **PUT** `/api/batch/:id`
- **Description**: Updates the state and location of a batch.
- **Request Body**:
  ```json
  {
    "currentNode": "WarehouseB",
    "status": "In Transit"
  }
  ```

## Directory Structure

```plaintext
backend/
├── src/
│   ├── config/
│   │   └── fabricConfig.ts
│   ├── register/
│   │   ├── enrollAdmin.ts
│   │   └── registerUser.ts
│   ├── api/
│   │   └── batchController.ts
│   └── server.ts
├── wallet/   # Stores identities
└── package.json
```

## Troubleshooting

### Error: User `appUser` not found in wallet

- Ensure the `registerUser.ts` script has been executed.

### Error: Admin identity does not exist in wallet

- Ensure the `enrollAdmin.ts` script has been executed.

### Error: Connection profile not found

- Verify that the `connection-org1.json` file is correctly placed in the `src/config` directory.

## Additional Resources

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
