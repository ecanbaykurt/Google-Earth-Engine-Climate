#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌍 Climate Data Dashboard - Environment Setup\n');

const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('   If you need to update it, please edit the file manually.\n');
} else {
  // Create .env.example if it doesn't exist
  const envExampleContent = `# BigQuery Configuration
# Copy this file to .env.local and replace with your actual BigQuery credentials
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n","client_email":"your-service-account@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"}

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Climate Data Dashboard`;

  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log('✅ Created .env.example file');
  }

  // Create .env.local with placeholder values
  fs.writeFileSync(envPath, envExampleContent);
  console.log('✅ Created .env.local file with placeholder values');
}

console.log('📋 Next steps:');
console.log('1. Edit .env.local and add your BigQuery credentials');
console.log('2. Set BIGQUERY_PROJECT_ID to your Google Cloud project ID');
console.log('3. Set BIGQUERY_CREDENTIALS_JSON to your service account JSON');
console.log('4. Run: npm run dev');
console.log('\n📖 For detailed setup instructions, see README.md');
console.log('\n🔗 BigQuery Setup Guide:');
console.log('   https://cloud.google.com/bigquery/docs/quickstarts/quickstart-client-libraries');
