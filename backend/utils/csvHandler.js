// // csvHandler.js
// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

// const csvFilePath = path.join(__dirname, 'approaches.csv');
// let approachesData = [];
// let filterOptions = {};

// // Helper function to split and trim values, returning an empty array if input is empty
// const splitAndTrim = (str) => {
//   if (!str || typeof str !== 'string') return [];
//   return str.split('|').map(item => item.trim()).filter(Boolean); // filter(Boolean) removes empty strings
// };

// // Helper to extract unique values for filters
// const getUniqueValues = (data, key, splitter = false) => {
//   const valueSet = new Set();
//   data.forEach(row => {
//     const value = row[key];
//     if (splitter && typeof value === 'string') {
//       value.split('|').forEach(item => {
//         if (item.trim()) valueSet.add(item.trim());
//       });
//     } else if (value) {
//       valueSet.add(value);
//     }
//   });
//   return Array.from(valueSet).sort();
// };

// const loadData = () => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(csvFilePath)
//       .pipe(csv({ separator: ';' }))
//       .on('data', (data) => {
//         // Sanitize keys by removing BOM and extra spaces
//         const sanitizedData = {};
//         for (const key in data) {
//           const cleanKey = key.replace(/^\uFEFF/, '').trim();
//           sanitizedData[cleanKey] = data[key];
//         }
        
//         // Create a structured object for each approach
//         const structuredApproach = {
//           criteria: sanitizedData['criteria'] || '',
//           subcriteria: sanitizedData['subcriteria'] || '',
//           code: sanitizedData['code'] || '',
//           title: sanitizedData['title'] || '',
//           evident_documents: sanitizedData['مصادیق مستندات'] || '',
//           goal: sanitizedData['هدف رویکرد'] || '',
//           processes: splitAndTrim(sanitizedData['processes']),
//           strategies: splitAndTrim(sanitizedData['strategies']),
//           strategicObjectives: splitAndTrim(sanitizedData['strategicObjectives']),
//           indicators: splitAndTrim(sanitizedData['indicators']),
//           implementation: sanitizedData['implementation'] || '',
//           documents: sanitizedData['documents'] || '',
//         };
//         results.push(structuredApproach);
//       })
//       .on('end', () => {
//         approachesData = results;
//         console.log('CSV file successfully processed.');

//         // Pre-calculate filter options
//         filterOptions = {
//           criteria: getUniqueValues(approachesData, 'criteria'),
//           subcriteria: getUniqueValues(approachesData, 'subcriteria'),
//           strategies: getUniqueValues(approachesData, 'strategies', true),
//           strategicObjectives: getUniqueValues(approachesData, 'strategicObjectives', true),
//           processes: getUniqueValues(approachesData, 'processes', true),
//         };
//         console.log('Filter options generated.');
//         resolve();
//       })
//       .on('error', (error) => {
//         console.error('Error loading CSV data:', error);
//         reject(error);
//       });
//   });
// };

// const getApproaches = () => approachesData;
// const getApproachByCode = (code) => approachesData.find(app => app.code === code);
// const getFilterOptions = () => filterOptions;

// module.exports = {
//   loadData,
//   getApproaches,
//   getApproachByCode,
//   getFilterOptions,
// };


// utils/csvHandler.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CORRECTED PATH: Go up one level from 'utils' then into 'data'
const csvFilePath = path.join(__dirname, '..', 'data', 'approaches.csv');

let approachesData = [];
let filterOptions = {};

const splitAndTrim = (str) => {
  if (!str || typeof str !== 'string') return [];
  return str.split('|').map(item => item.trim()).filter(Boolean);
};

const getUniqueValues = (data, key, isMultiValue = false) => {
  const valueSet = new Set();
  data.forEach(row => {
    const value = row[key];
    if (isMultiValue && Array.isArray(value)) {
      value.forEach(item => valueSet.add(item));
    } else if (!isMultiValue && value) {
      valueSet.add(value);
    }
  });
  return Array.from(valueSet).sort();
};

const loadData = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvFilePath)) {
        return reject(new Error(`CSV file not found at path: ${csvFilePath}`));
    }
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        const sanitizedData = {};
        for (const key in data) {
          const cleanKey = key.replace(/^\uFEFF/, '').trim();
          sanitizedData[cleanKey] = data[key];
        }
        
        const structuredApproach = {
          criteria: sanitizedData['criteria'] || '',
          subcriteria: sanitizedData['subcriteria'] || '',
          code: sanitizedData['code'] || '',
          title: sanitizedData['title'] || '',
          evident_documents: sanitizedData['مصادیق مستندات'] || '',
          goal: sanitizedData['هدف رویکرد'] || '',
          processes: splitAndTrim(sanitizedData['processes']),
          strategies: splitAndTrim(sanitizedData['strategies']),
          strategicObjectives: splitAndTrim(sanitizedData['strategicObjectives']),
          indicators: splitAndTrim(sanitizedData['indicators']),
          implementation: sanitizedData['implementation'] || '',
          documents: sanitizedData['documents'] || '',
        };
        results.push(structuredApproach);
      })
      .on('end', () => {
        approachesData = results;
        console.log('CSV file successfully processed.');

        filterOptions = {
          criteria: getUniqueValues(approachesData, 'criteria'),
          subcriteria: getUniqueValues(approachesData, 'subcriteria'),
          strategies: getUniqueValues(approachesData, 'strategies', true),
          strategicObjectives: getUniqueValues(approachesData, 'strategicObjectives', true),
          processes: getUniqueValues(approachesData, 'processes', true),
        };
        console.log('Filter options generated.');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error loading CSV data:', error);
        reject(error);
      });
  });
};

const getApproaches = () => approachesData;
const getApproachByCode = (code) => approachesData.find(app => app.code === code);
const getFilterOptions = () => filterOptions;

module.exports = {
  loadData,
  getApproaches,
  getApproachByCode,
  getFilterOptions,
};
