import xlsx from 'xlsx';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import sequelize from '../src/lib/db.js';
import State from '../src/models/State.js';
import District from '../src/models/District.js';
import Location from '../src/models/Location.js';

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

async function main() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Sequelize connected successfully.');

    console.log('Opening scripts/cities.xlsx...');
    const workbook = xlsx.readFile('scripts/cities.xlsx');
    const sheet = workbook.Sheets['Sheet1'];
    if (!sheet) {
      throw new Error('Sheet1 not found in cities.xlsx');
    }

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`Loaded ${data.length} rows from spreadsheet.`);

    let processedCount = 0;
    let addedStatesCount = 0;
    let addedDistrictsCount = 0;
    let addedCitiesCount = 0;
    let skippedCount = 0;

    // Cache to avoid querying the database repeatedly for same states/districts
    const stateCache = {}; // name -> state object
    const districtCache = {}; // stateId_name -> district object
    const citySet = new Set(); // stateId_cityName -> true

    // Load existing database data to populate caches
    const existingStates = await State.findAll();
    existingStates.forEach(s => {
      stateCache[s.name.toLowerCase()] = s;
    });

    const existingDistricts = await District.findAll();
    existingDistricts.forEach(d => {
      districtCache[`${d.state_id}_${d.name.toLowerCase()}`] = d;
    });

    const existingLocations = await Location.findAll();
    existingLocations.forEach(l => {
      citySet.add(`${l.state_id}_${l.name.toLowerCase()}`);
    });

    console.log(`Caches warmed up. Existing: ${existingStates.length} states, ${existingDistricts.length} districts, ${existingLocations.length} cities.`);

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 2) continue;

      const stateName = row[0]?.toString().trim();
      const cityName = row[1]?.toString().trim();

      if (!stateName || !cityName) continue;

      // Skip invalid header rows or non-provinces
      const stateNameLower = stateName.toLowerCase();
      if (
        stateNameLower === 'district' ||
        stateNameLower === 'province' ||
        stateNameLower === 'canada'
      ) {
        continue;
      }

      processedCount++;

      // 1. Ensure State exists
      let state = stateCache[stateNameLower];
      if (!state) {
        const stateSlug = slugify(stateName);
        state = await State.create({
          name: stateName,
          slug: stateSlug,
          is_active: true
        });
        stateCache[stateNameLower] = state;
        addedStatesCount++;
        console.log(`+ Created State: ${stateName} (Slug: ${stateSlug})`);
      }

      // 2. Check if city already exists in this state
      const cityNameLower = cityName.toLowerCase();
      const cityCacheKey = `${state.id}_${cityNameLower}`;
      if (citySet.has(cityCacheKey)) {
        skippedCount++;
        continue;
      }

      // 3. Ensure a District exists for this city.
      // Since Excel lacks a district column, we use "[State Name] Region" as the default district.
      const defaultDistrictName = `${state.name} Region`;
      const districtCacheKey = `${state.id}_${defaultDistrictName.toLowerCase()}`;
      let district = districtCache[districtCacheKey];
      if (!district) {
        // Double check in DB just in case cache missed
        const [d, created] = await District.findOrCreate({
          where: { state_id: state.id, name: defaultDistrictName },
          defaults: { name: defaultDistrictName, state_id: state.id }
        });
        district = d;
        districtCache[districtCacheKey] = district;
        if (created) {
          addedDistrictsCount++;
          console.log(`  + Created District: ${defaultDistrictName}`);
        }
      }

      // 4. Generate unique slug for city
      const baseSlug = slugify(cityName);
      let finalSlug = baseSlug;

      // Handle slug collision across states (e.g. Richmond)
      const existingLoc = await Location.findOne({ where: { slug: baseSlug } });
      if (existingLoc && existingLoc.state_id !== state.id) {
        const stateSlug = slugify(state.name);
        finalSlug = `${baseSlug}-${stateSlug}`;
      }

      // Double check if this exact slug is already taken (to prevent crash)
      const slugCollision = await Location.findOne({ where: { slug: finalSlug } });
      if (slugCollision) {
        // Already exists, just skip or record it
        citySet.add(cityCacheKey);
        skippedCount++;
        continue;
      }

      // 5. Create Location (City)
      await Location.create({
        name: cityName,
        slug: finalSlug,
        state_id: state.id,
        district_id: district.id
      });

      citySet.add(cityCacheKey);
      addedCitiesCount++;

      if (addedCitiesCount % 100 === 0) {
        console.log(`  Processed ${processedCount} rows. Added ${addedCitiesCount} cities so far...`);
      }
    }

    console.log('\n======================================');
    console.log('✅ Import Completed Successfully!');
    console.log(`Processed rows: ${processedCount}`);
    console.log(`Created States: ${addedStatesCount}`);
    console.log(`Created Districts: ${addedDistrictsCount}`);
    console.log(`Created Cities: ${addedCitiesCount}`);
    console.log(`Skipped (Already existed): ${skippedCount}`);
    console.log('======================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

main();
