import * as ee from '@google/earthengine';
import { GoogleAuth } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

// Singleton pattern for Earth Engine initialization
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize Google Earth Engine with service account authentication
 * Uses singleton pattern to ensure initialization happens only once
 */
export async function initializeEarthEngine(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Load service account key from file
      const keyPath = path.join(process.cwd(), 'keys', 'gee-service.json');
      
      if (!fs.existsSync(keyPath)) {
        throw new Error(`Service account key file not found at: ${keyPath}`);
      }

      const serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      
      // Authenticate with service account
      const auth = new GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ['https://www.googleapis.com/auth/earthengine']
      });

      const authClient = await auth.getClient();
      
      // Initialize Earth Engine with the authenticated client
      await ee.initialize(null, null, () => {
        console.log('Earth Engine initialized successfully');
      }, (error: any) => {
        console.error('Earth Engine initialization failed:', error);
        throw error;
      });

      // Set the authentication
      ee.data.setAuthToken(authClient.credentials.access_token);
      
      isInitialized = true;
      console.log('✅ Earth Engine initialized with service account');
      
    } catch (error) {
      console.error('❌ Failed to initialize Earth Engine:', error);
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get country boundary from Natural Earth dataset
 */
export async function getCountryBoundary(countryName: string): Promise<ee.FeatureCollection> {
  await initializeEarthEngine();
  
  try {
    // Load Natural Earth countries dataset
    const countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
    
    // Filter by country name (case insensitive)
    const country = countries.filter(
      ee.Filter.eq('COUNTRY_NA', countryName)
    );
    
    // Check if country exists
    const count = await country.size().getInfo();
    if (count === 0) {
      throw new Error(`Country "${countryName}" not found in the dataset`);
    }
    
    return country;
  } catch (error) {
    console.error(`Error getting country boundary for ${countryName}:`, error);
    throw error;
  }
}

/**
 * Query Hansen Global Forest Change dataset for forest loss data
 */
export async function getForestLossData(
  countryName: string,
  startYear: number = 2001,
  endYear: number = 2023
): Promise<any> {
  await initializeEarthEngine();
  
  try {
    console.log(`🌲 Querying forest loss data for ${countryName} (${startYear}-${endYear})`);
    
    // Get country boundary
    const country = await getCountryBoundary(countryName);
    
    // Load Hansen Global Forest Change dataset
    const hansen = ee.Image('UMD/hansen/global_forest_change_2023_v1_11');
    
    // Get forest loss band (loss year)
    const lossYear = hansen.select('lossyear');
    
    // Create mask for the specified year range
    const yearMask = lossYear.gte(startYear).and(lossYear.lte(endYear));
    
    // Apply mask to get forest loss pixels
    const forestLoss = lossYear.updateMask(yearMask);
    
    // Calculate forest loss area in square kilometers
    const areaImage = ee.Image.pixelArea().divide(1e6); // Convert to km²
    
    // Reduce region to get total forest loss
    const stats = forestLoss.addBands(areaImage).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: country.geometry(),
      scale: 30, // Hansen dataset resolution
      maxPixels: 1e13,
      bestEffort: true
    });
    
    // Get the result
    const result = await stats.getInfo();
    
    // Calculate total forest loss area
    const totalLossArea = result.lossyear || 0;
    
    // Get forest loss by year (histogram)
    const histogram = forestLoss.addBands(areaImage).reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 0,
        groupName: 'year'
      }),
      geometry: country.geometry(),
      scale: 30,
      maxPixels: 1e13,
      bestEffort: true
    });
    
    const histogramResult = await histogram.getInfo();
    
    // Process histogram data
    const yearlyData = histogramResult.groups?.map((group: any) => ({
      year: startYear + group.year,
      loss_km2: group.sum || 0
    })) || [];
    
    return {
      country: countryName,
      total_loss_km2: totalLossArea,
      yearly_data: yearlyData,
      start_year: startYear,
      end_year: endYear,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error getting forest loss data for ${countryName}:`, error);
    throw error;
  }
}

/**
 * Get forest cover data from Hansen dataset
 */
export async function getForestCoverData(countryName: string): Promise<any> {
  await initializeEarthEngine();
  
  try {
    console.log(`🌳 Querying forest cover data for ${countryName}`);
    
    // Get country boundary
    const country = await getCountryBoundary(countryName);
    
    // Load Hansen Global Forest Change dataset
    const hansen = ee.Image('UMD/hansen/global_forest_change_2023_v1_11');
    
    // Get tree cover 2000 band
    const treeCover2000 = hansen.select('treecover2000');
    
    // Calculate forest cover area in square kilometers
    const areaImage = ee.Image.pixelArea().divide(1e6); // Convert to km²
    
    // Reduce region to get total forest cover
    const stats = treeCover2000.addBands(areaImage).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: country.geometry(),
      scale: 30,
      maxPixels: 1e13,
      bestEffort: true
    });
    
    const result = await stats.getInfo();
    
    return {
      country: countryName,
      forest_cover_2000_km2: result.treecover2000 || 0,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error getting forest cover data for ${countryName}:`, error);
    throw error;
  }
}

/**
 * Generic helper function to query any Earth Engine dataset
 */
export async function queryEarthEngineDataset(
  datasetId: string,
  countryName: string,
  bands: string[],
  reducer: string = 'sum',
  scale: number = 1000
): Promise<any> {
  await initializeEarthEngine();
  
  try {
    console.log(`🔍 Querying dataset ${datasetId} for ${countryName}`);
    
    // Get country boundary
    const country = await getCountryBoundary(countryName);
    
    // Load the dataset
    const image = ee.Image(datasetId);
    
    // Select specified bands
    const selectedBands = image.select(bands);
    
    // Calculate area if needed
    const areaImage = ee.Image.pixelArea().divide(1e6); // Convert to km²
    const imageWithArea = selectedBands.addBands(areaImage);
    
    // Choose reducer
    let eeReducer: ee.Reducer;
    switch (reducer.toLowerCase()) {
      case 'mean':
        eeReducer = ee.Reducer.mean();
        break;
      case 'median':
        eeReducer = ee.Reducer.median();
        break;
      case 'min':
        eeReducer = ee.Reducer.min();
        break;
      case 'max':
        eeReducer = ee.Reducer.max();
        break;
      case 'stddev':
        eeReducer = ee.Reducer.stdDev();
        break;
      default:
        eeReducer = ee.Reducer.sum();
    }
    
    // Reduce region
    const stats = imageWithArea.reduceRegion({
      reducer: eeReducer,
      geometry: country.geometry(),
      scale: scale,
      maxPixels: 1e13,
      bestEffort: true
    });
    
    const result = await stats.getInfo();
    
    return {
      country: countryName,
      dataset: datasetId,
      bands: bands,
      reducer: reducer,
      scale: scale,
      data: result,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error querying dataset ${datasetId} for ${countryName}:`, error);
    throw error;
  }
}

/**
 * Test Earth Engine connection
 */
export async function testEarthEngineConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    await initializeEarthEngine();
    
    // Simple test query
    const testImage = ee.Image('COPERNICUS/S2_SR/20210101T100319_20210101T100321_T32UPA');
    const testResult = await testImage.select('B4').reduceRegion({
      reducer: ee.Reducer.count(),
      geometry: ee.Geometry.Point([0, 0]).buffer(1000),
      scale: 10,
      maxPixels: 1e9
    }).getInfo();
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
