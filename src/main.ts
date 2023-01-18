import * as dotenv from "dotenv";
import mysql, { RowDataPacket } from "mysql2/promise";
import Repository from "./Repository.js";

dotenv.config();

interface Bucket {
  total: number;
  credentialIds: number[];
}

interface OrderCountByCredentialId extends RowDataPacket {
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

export default async function balance(noPods: number) {
  const [rows] = await repository.fetchOrderCountFromDateGroupByCredentialId();
  return balancingAlgorithm(rows, noPods);
}

const balancingAlgorithm = (
  data: OrderCountByCredentialId[],
  noPods: number
) => {
  let buckets: Bucket[] = [];
  for (let i = 0; i < noPods; i++) {
    let bucket: Bucket = { total: 0, credentialIds: [] };
    buckets.push(bucket);
  }
  for (let j = 0; j < data.length; j++) {
    let totals: number[] = [];
    buckets.forEach((bucket) => {
      totals.push(bucket.total);
    });
    const min = Math.min(...totals);
    let smallestBucket;
    smallestBucket = buckets.find((bucket) => {
      return bucket.total === min;
    });
    if (smallestBucket) {
      const x = buckets.indexOf(smallestBucket);
      buckets[x].credentialIds.push(data[j].credential_id);
      buckets[x].total += data[j].orderCount;
    }
  }
  return buckets;
};

console.log(await balance(5));
