import { createMock } from "ts-auto-mock";
import balance from "../main";
import Repository from "../Repository";

const mockRepository = createMock(Repository);
jest.mock("./Repository", () =>
  jest.fn().mockImplementation(() => mockRepository)
);
it("sorts three credentials correctly into two buckets", async () => {
  const buckets = await balance(2);

  expect(buckets).toBe([{}, {}]);
});
