#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌍 Google Earth Engine Setup\n');

const keysDir = path.join(__dirname, 'keys');
const exampleFile = path.join(keysDir, 'gee-service.json.example');
const serviceFile = path.join(keysDir, 'gee-service.json');

// Check if keys directory exists
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
  console.log('✅ Created keys directory');
}

// Check if service account file exists
if (fs.existsSync(serviceFile)) {
  console.log('⚠️  gee-service.json already exists. Skipping creation.');
  console.log('   If you need to update it, please replace the file manually.\n');
} else {
  console.log('❌ gee-service.json not found.');
  console.log('   Please copy gee-service.json.example to gee-service.json and add your credentials.\n');
}

console.log('📋 Next steps:');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Earth Engine API');
console.log('4. Create a service account:');
console.log('   - Go to IAM & Admin > Service Accounts');
console.log('   - Click "Create Service Account"');
console.log('   - Name: "earth-engine-service"');
console.log('   - Grant "Earth Engine User" role');
console.log('5. Create and download JSON key');
console.log('6. Copy the JSON content to keys/gee-service.json');
console.log('7. Run: npm run dev');
console.log('\n🔗 Earth Engine Setup Guide:');
console.log('   https://developers.google.com/earth-engine/guides/service_account');
console.log('\n🧪 Test your setup:');
console.log('   Visit: http://localhost:3000/api/gee-test');
