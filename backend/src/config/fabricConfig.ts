import { Gateway, Wallets, Contract } from "fabric-network";
import * as path from "path";
import * as fs from "fs";

const CONNECTION_PROFILE_PATH = path.resolve(
  __dirname,
  "../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

const WALLET_PATH = path.join(process.cwd(), "wallet");

export async function getContract(): Promise<Contract> {
  const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

  const user = "appUser";
  if (!(await wallet.get(user))) {
    throw new Error(
      `User ${user} not found in wallet. Register the user first.`
    );
  }

  const connectionProfile = JSON.parse(
    fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8")
  );
  const gateway = new Gateway();

  await gateway.connect(connectionProfile, {
    wallet,
    identity: user,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  return network.getContract("basic");
}
