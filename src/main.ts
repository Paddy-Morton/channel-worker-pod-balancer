import * as dotenv from "dotenv";
import mysql, { RowDataPacket } from "mysql2/promise";
import { ChannelWorkerPodBalancer } from "./ChannelWorkerPodBalancer.js";
import Repository from "./Repository.js";

dotenv.config();

export interface Bucket {
  total: number;
  credentialIds: number[];
}

export interface OrderCountByCredentialId extends RowDataPacket {
  credential_id: number;
  orderCount: number;
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const repository = new Repository<OrderCountByCredentialId>(connection);
const channelWorkerPodBalancer = new ChannelWorkerPodBalancer(repository);
console.log(await channelWorkerPodBalancer.balance(5));
