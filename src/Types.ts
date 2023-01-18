import { RowDataPacket } from "mysql2";

export interface Bucket {
  total: number;
  credentialIds: number[];
}

export interface OrderCountByCredentialId extends RowDataPacket {
  credential_id: number;
  orderCount: number;
}
