import * as dotenv from "dotenv";
import mysql from "mysql2/promise";
import promptSync from "prompt-sync";
import { ChannelWorkerPodBalancer } from "./ChannelWorkerPodBalancer.js";
import Repository from "./Repository.js";
import { OrderCountByCredentialId } from "./Types.js";

dotenv.config();

const prompt = promptSync();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const repository = new Repository<OrderCountByCredentialId>(connection);
const channelWorkerPodBalancer = new ChannelWorkerPodBalancer(repository);

const input = prompt("How many pods are you attempting to balance?");

const noPods = Number(input);

if (!Number.isInteger(noPods)) {
  throw new Error("Error: not an integer value");
}

console.log(await channelWorkerPodBalancer.balance(noPods));
