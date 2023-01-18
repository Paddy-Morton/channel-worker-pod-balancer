import * as dotenv from "dotenv";
import mysql from "mysql2/promise";
import { ChannelWorkerPodBalancer } from "./ChannelWorkerPodBalancer.js";
import Repository from "./Repository.js";
import { OrderCountByCredentialId } from "./Types.js";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const repository = new Repository<OrderCountByCredentialId>(connection);
const channelWorkerPodBalancer = new ChannelWorkerPodBalancer(repository);
console.log(await channelWorkerPodBalancer.balance(5));
