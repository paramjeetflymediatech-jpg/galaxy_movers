import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import sequelize from '../src/lib/db.js';
import State from '../src/models/State.js';
import District from '../src/models/District.js';
import Location from '../src/models/Location.js';
import Service from '../src/models/Service.js';
import ServiceLocation from '../src/models/ServiceLocation.js';
import Seo from '../src/models/Seo.js';

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

const SERVICE_NAMES = {
  'residential-moving': 'Residential Moving',
  'commercial-office-moves': 'Commercial & Office Moves',
  'long-distance-relocations': 'Long Distance Relocations',
  'professional-packing-services': 'Professional Packing Services',
  'furniture-disassembly-assembly': 'Furniture Disassembly & Assembly',
  'secure-storage-solutions': 'Secure Storage Solutions'
};

function getServiceName(slug) {
  if (SERVICE_NAMES[slug]) return SERVICE_NAMES[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function main() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Sequelize connected successfully.');

    const jsonPath = 'scripts/generated_services.json';
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File not found: ${jsonPath}. Please run "node scripts/generate_services.js" first.`);
    }

    console.log(`Reading ${jsonPath}...`);
    const entries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${entries.length} service entries from JSON.`);

    let processedCount = 0;
    let createdStatesCount = 0;
    let createdLocationsCount = 0;
    let createdServicesCount = 0;
    let createdServiceLocationsCount = 0;
    let updatedServiceLocationsCount = 0;
    let createdSeoCount = 0;
    let updatedSeoCount = 0;

    // Cache objects to minimize queries
    const stateCache = {};
    const districtCache = {};
    const stateDistrictMap = {};
    const locationCache = {};
    const serviceCache = {};

    // Warm caches with existing DB data
    const existingStates = await State.findAll();
    existingStates.forEach(s => {
      stateCache[s.name.toLowerCase()] = s;
    });

    const existingDistricts = await District.findAll();
    existingDistricts.forEach(d => {
      districtCache[`${d.state_id}_${d.name.toLowerCase()}`] = d;
      if (!stateDistrictMap[d.state_id]) {
        stateDistrictMap[d.state_id] = d;
      }
    });

    const existingLocations = await Location.findAll();
    existingLocations.forEach(l => {
      locationCache[`${l.state_id}_${l.name.toLowerCase()}`] = l;
    });

    const existingServices = await Service.findAll();
    existingServices.forEach(s => {
      serviceCache[s.slug] = s;
    });

    console.log(`Caches loaded. Found in DB: ${existingStates.length} States, ${existingDistricts.length} Districts, ${existingLocations.length} Locations, ${existingServices.length} Services.`);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const {
        city,
        state: stateName,
        service_slug: serviceSlug,
        content,
        faqs,
        meta_title,
        meta_description,
        og_title,
        og_description,
        canonical_url,
        keywords,
        path: pagePath
      } = entry;

      if (!city || !stateName || !serviceSlug) {
        console.warn(`Row ${i + 1}: Skipping due to missing required fields (city, state, or service_slug).`);
        continue;
      }

      processedCount++;

      // 1. Resolve State
      const stateNameLower = stateName.toLowerCase();
      let state = stateCache[stateNameLower];
      if (!state) {
        state = await State.create({
          name: stateName,
          slug: slugify(stateName),
          is_active: true
        });
        stateCache[stateNameLower] = state;
        createdStatesCount++;
        console.log(`+ Created State: ${stateName}`);
      }

      // 2. Resolve Location (City)
      const locationKey = `${state.id}_${city.toLowerCase()}`;
      let location = locationCache[locationKey];
      if (!location) {
        // Resolve District
        let district = stateDistrictMap[state.id];
        if (!district) {
          const defaultDistrictName = `${state.name} Region`;
          const [d, dCreated] = await District.findOrCreate({
            where: { state_id: state.id, name: defaultDistrictName },
            defaults: { name: defaultDistrictName, state_id: state.id }
          });
          district = d;
          stateDistrictMap[state.id] = district;
          districtCache[`${state.id}_${defaultDistrictName.toLowerCase()}`] = district;
          if (dCreated) {
            console.log(`  + Created District: ${defaultDistrictName}`);
          }
        }

        // Determine unique slug for city
        const baseSlug = slugify(city);
        let finalSlug = baseSlug;

        const existingLoc = await Location.findOne({ where: { slug: baseSlug } });
        if (existingLoc && existingLoc.state_id !== state.id) {
          finalSlug = `${baseSlug}-${slugify(state.name)}`;
        }

        const slugCollision = await Location.findOne({ where: { slug: finalSlug } });
        if (slugCollision) {
          finalSlug = `${finalSlug}-${Date.now()}`;
        }

        location = await Location.create({
          name: city,
          slug: finalSlug,
          state_id: state.id,
          district_id: district.id
        });
        locationCache[locationKey] = location;
        createdLocationsCount++;
        console.log(`  + Created Location: ${city} (Slug: ${finalSlug})`);
      }

      // 3. Resolve Service
      let service = serviceCache[serviceSlug];
      if (!service) {
        const serviceName = getServiceName(serviceSlug);
        service = await Service.create({
          name: serviceName,
          slug: serviceSlug,
          description: `Professional ${serviceName} services by Galaxy Movers.`,
          content: `<p>We offer premium ${serviceName} solutions tailored to your needs.</p>`,
          faqs: JSON.stringify([])
        });
        serviceCache[serviceSlug] = service;
        createdServicesCount++;
        console.log(`+ Created Service: ${serviceName} (Slug: ${serviceSlug})`);
      }

      // 4. Resolve ServiceLocation linking
      const [serviceLoc, slCreated] = await ServiceLocation.findOrCreate({
        where: { service_id: service.id, location_id: location.id },
        defaults: {
          service_id: service.id,
          location_id: location.id,
          description: meta_description,
          content: content,
          faqs: JSON.stringify(faqs)
        }
      });

      if (slCreated) {
        createdServiceLocationsCount++;
      } else {
        await serviceLoc.update({
          description: meta_description,
          content: content,
          faqs: JSON.stringify(faqs)
        });
        updatedServiceLocationsCount++;
      }

      // 5. Resolve SEO Metadata
      const [seoRecord, seoCreated] = await Seo.findOrCreate({
        where: { page_path: pagePath },
        defaults: {
          page_path: pagePath,
          title: meta_title,
          description: meta_description,
          keywords: keywords,
          canonical_url: canonical_url,
          og_title: og_title,
          og_description: og_description
        }
      });

      if (seoCreated) {
        createdSeoCount++;
      } else {
        await seoRecord.update({
          title: meta_title,
          description: meta_description,
          keywords: keywords,
          canonical_url: canonical_url,
          og_title: og_title,
          og_description: og_description
        });
        updatedSeoCount++;
      }

      if (processedCount % 50 === 0) {
        console.log(`Processed ${processedCount} of ${entries.length} entries...`);
      }
    }

    console.log('\n==================================================');
    console.log('✅ Database Import Completed Successfully!');
    console.log(`- Entries Processed: ${processedCount}`);
    console.log(`- Created States: ${createdStatesCount}`);
    console.log(`- Created Locations/Cities: ${createdLocationsCount}`);
    console.log(`- Created Services: ${createdServicesCount}`);
    console.log(`- Created Service-Locations links: ${createdServiceLocationsCount}`);
    console.log(`- Updated Service-Locations links: ${updatedServiceLocationsCount}`);
    console.log(`- Created SEO Records: ${createdSeoCount}`);
    console.log(`- Updated SEO Records: ${updatedSeoCount}`);
    console.log('==================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

main();
