import { RowDataPacket } from "mysql2";
import { Connection } from "mysql2/promise";

export default class Repository<T extends RowDataPacket> {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // counts order lines, groups by credential and sorts into descending order 
  fetchOrderCountFromDateGroupByCredentialId = async (date: Date) => {
    const dateString = new Date(date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return await this.connection.query<T[]>(
      `SELECT b.credential_id, COUNT(b.credential_id) AS orderCount FROM hubpic_shopifydetails AS a LEFT JOIN hubpic_ebayorders AS b ON a.id = b.credential_id WHERE a.group = 'legacy-worker' AND b.Hubpic_Import_Date > '${dateString}' GROUP BY b.credential_id ORDER BY COUNT(b.credential_id) DESC`
    );
  };
}
