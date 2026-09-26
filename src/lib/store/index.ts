import "server-only";
import { databaseUrl } from "@/db/url";
import { mockStore } from "./mock";
import { postgresStore } from "./postgres";

const useMock = process.env.USE_MOCK_DATA === "true" || !databaseUrl;

export const store = useMock ? mockStore : postgresStore;
export type * from "./types";
