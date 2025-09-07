import { BigQuery, BigQueryOptions } from "@google-cloud/bigquery";

let client: BigQuery | null = null;

export function getBigQuery() {
  if (client) return client;
  
  const projectId = process.env.BIGQUERY_PROJECT_ID;
  const credsRaw = process.env.BIGQUERY_CREDENTIALS_JSON;
  
  if (!projectId || !credsRaw) {
    throw new Error(
      "Missing BigQuery environment variables. Please set BIGQUERY_PROJECT_ID and BIGQUERY_CREDENTIALS_JSON in your .env.local file. " +
      "See the README for setup instructions."
    );
  }
  
  try {
    const credentials = JSON.parse(credsRaw);
    const opts: BigQueryOptions = { projectId, credentials };
    client = new BigQuery(opts);
    return client;
  } catch (error) {
    throw new Error(`Failed to parse BigQuery credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function testBigQueryConnection() {
  try {
    const bq = getBigQuery();
    // Test connection with a simple query
    const [rows] = await bq.query({
      query: 'SELECT 1 as test',
      location: 'US'
    });
    return { success: true, data: rows };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
