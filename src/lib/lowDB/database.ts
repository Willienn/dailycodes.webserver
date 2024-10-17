import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { WhitelistRequest } from "./types";

type Database = {
  whitelistRequests: WhitelistRequest[];
};

// Updated to include 'token' and 'confirmed'
const adapter = new JSONFile<Database>("./src/db/db.json");
const db = new Low<Database>(adapter, { whitelistRequests: [] });

async function setup() {
  await db.read();
  await db.write();
}

// Add a new whitelist request with token and confirmed status
export async function addWhitelistRequest(request: WhitelistRequest) {
  await setup();
  db.data!.whitelistRequests.push({
    ...request,
    confirmed: false, // Initially, the request is not confirmed
  });
  await db.write();
}

// Get all whitelist requests
export async function getWhitelistRequests(): Promise<WhitelistRequest[]> {
  await setup();
  return db.data!.whitelistRequests;
}

// Confirm the request by token
export async function confirmWhitelistRequest(token: string): Promise<boolean> {
  await setup();

  const request = db.data!.whitelistRequests.find((req) => req.token === token);

  if (!request || request.confirmed) {
    return false; // Token is invalid or already confirmed
  }

  request.confirmed = true; // Confirm the request
  await db.write();

  return true; // Email confirmed successfully
}
