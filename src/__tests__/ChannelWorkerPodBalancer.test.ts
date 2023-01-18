import { FieldPacket } from "mysql2";
import { createMock } from "ts-auto-mock";
import { ChannelWorkerPodBalancer } from "../ChannelWorkerPodBalancer";
import Repository from "../Repository";
import { OrderCountByCredentialId } from "../Types";

it("sorts three credentials correctly into two buckets when credentials are in descending order by orderCount", async () => {
  const mockRepository = createMock<Repository<OrderCountByCredentialId>>({
    fetchOrderCountFromDateGroupByCredentialId: async () => {
      const dbResult: OrderCountByCredentialId[] = [
        {
          credential_id: 1,
          orderCount: 3,
          constructor: {
            name: "RowDataPacket",
          },
        },
        {
          credential_id: 2,
          orderCount: 2,
          constructor: {
            name: "RowDataPacket",
          },
        },
        {
          credential_id: 3,
          orderCount: 1,
          constructor: {
            name: "RowDataPacket",
          },
        },
      ];
      const result: [OrderCountByCredentialId[], FieldPacket[]] = [
        dbResult,
        [],
      ];
      return result;
    },
  });

  const channelWorkerPodBalancer = new ChannelWorkerPodBalancer(mockRepository);
  const buckets = await channelWorkerPodBalancer.balance(
    2,
    new Date("2023-01-01")
  );

  expect(buckets).toMatchObject([
    {
      credentialIds: [1],
      total: 3,
    },
    {
      credentialIds: [2, 3],
      total: 3,
    },
  ]);
});
