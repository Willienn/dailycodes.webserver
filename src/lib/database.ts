// lib/database.ts

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { WhitelistRequest } from "./types";

type Database = {
  whitelistRequests: WhitelistRequest[];
};

const adapter = new JSONFile<Database>("./src/db/db.json");
const db = new Low<Database>(adapter, { whitelistRequests: [] });

async function setup() {
  await db.read();
  await db.write();
}

export async function addWhitelistRequest(request: WhitelistRequest) {
  await setup();
  db.data.whitelistRequests.push(request);
  await db.write();
}

export async function getWhitelistRequests(): Promise<WhitelistRequest[]> {
  await setup();
  return db.data!.whitelistRequests;
}
