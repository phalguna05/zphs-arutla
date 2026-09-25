import "server-only";
import { mockStore } from "./mock";
import { postgresStore } from "./postgres";

const useMock = process.env.USE_MOCK_DATA === "true" || !process.env.DATABASE_URL;

export const store = useMock ? mockStore : postgresStore;
export type * from "./types";
