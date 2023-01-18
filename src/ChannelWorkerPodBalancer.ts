import Repository from "./Repository";
import { Bucket, OrderCountByCredentialId } from "./Types";

export class ChannelWorkerPodBalancer {
  private repository: Repository<OrderCountByCredentialId>;
  constructor(repository: Repository<OrderCountByCredentialId>) {
    this.repository = repository;
  }

  balance = async (noPods: number) => {
    const [rows] =
      await this.repository.fetchOrderCountFromDateGroupByCredentialId();
    return this.balancingAlgorithm(rows, noPods);
  };

  // Note that this algorithm asssumes that the data has already been sorted into descending order by orderCount
  private balancingAlgorithm = (
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
}
