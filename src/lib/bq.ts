import { BigQuery, BigQueryOptions } from "@google-cloud/bigquery";

let client: BigQuery | null = null;

export function getBigQuery() {
  if (client) return client;
  const projectId = process.env.BIGQUERY_PROJECT_ID as string;
  const credsRaw = process.env.BIGQUERY_CREDENTIALS_JSON as string;
  if (!projectId || !credsRaw) throw new Error("Missing BigQuery envs");
  const credentials = JSON.parse(credsRaw);
  const opts: BigQueryOptions = { projectId, credentials };
  client = new BigQuery(opts);
  return client;
}
