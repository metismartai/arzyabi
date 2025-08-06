const express = require('express');
const router = express.Router();
const { readCsvFile, readCsvFileAdvanced, getAllCsvFiles, getCsvStructure } = require('../utils/csvHandler');

// Get all available CSV files
router.get('/files', async (req, res) => {
  try {
    const files = await getAllCsvFiles();
    res.json({ 
      success: true, 
      files,
      message: `Found ${files.length} CSV files`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get CSV file structure (headers)
router.get('/:filename/structure', async (req, res) => {
  try {
    const { filename } = req.params;
    const headers = await getCsvStructure(filename);
    res.json({ 
      success: true, 
      filename,
      headers,
      totalHeaders: headers.length,
      sampleStructure: headers.reduce((obj, header, index) => {
        obj[header] = `نمونه مقدار ${index + 1}`;
        return obj;
      }, {})
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Dynamic route for CSV files (Simple parser)
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { advanced = false } = req.query;
    
    // انتخاب parser مناسب
    const data = advanced === 'true' 
      ? await readCsvFileAdvanced(filename)
      : await readCsvFile(filename);
    
    const response = {
      success: true,
      filename,
      totalRecords: data.length,
      parserType: advanced === 'true' ? 'advanced' : 'simple',
      data,
      sampleRecord: data.length > 0 ? data[0] : null,
      availableFields: data.length > 0 ? Object.keys(data[0]) : []
    };
    
    res.json(response);
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message,
      filename: req.params.filename
    });
  }
});

// Get approaches with filtering
router.get('/approaches/filter', async (req, res) => {
  try {
    const data = await readCsvFile('approaches');
    const { 
      معیار: criteria, 
      زیرمعیار: subCriteria, 
      'عنوان رویکرد': title,
      'کد رویکرد': code,
      search 
    } = req.query;
    
    let filteredData = data;
    
    // فیلتر بر اساس معیار
    if (criteria) {
      filteredData = filteredData.filter(item => 
        item['معیار'] && item['معیار'].toLowerCase().includes(criteria.toLowerCase())
      );
    }
    
    // فیلتر بر اساس زیرمعیار
    if (subCriteria) {
      filteredData = filteredData.filter(item => 
        item['زیرمعیار'] && item['زیرمعیار'].toLowerCase().includes(subCriteria.toLowerCase())
      );
    }
    
    // فیلتر بر اساس عنوان
    if (title) {
      filteredData = filteredData.filter(item => 
        item['عنوان رویکرد'] && item['عنوان رویکرد'].toLowerCase().includes(title.toLowerCase())
      );
    }
    
    // فیلتر بر اساس کد
    if (code) {
      filteredData = filteredData.filter(item => 
        item['کد رویکرد'] && item['کد رویکرد'].toLowerCase().includes(code.toLowerCase())
      );
    }
    
    // جستجو عمومی
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm)
        );
      });
    }
    
    res.json({ 
      success: true, 
      data: filteredData, 
      total: filteredData.length,
      originalTotal: data.length,
      filters: { criteria, subCriteria, title, code, search },
      availableFields: data.length > 0 ? Object.keys(data[0]) : []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get single approach by code
router.get('/approaches/detail/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const data = await readCsvFile('approaches');
    
    const approach = data.find(item => item['کد رویکرد'] === code);
    
    if (!approach) {
      return res.status(404).json({
        success: false,
        error: `Approach with code ${code} not found`
      });
    }
    
    res.json({
      success: true,
      data: approach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get unique values for a specific field
router.get('/:filename/values/:field', async (req, res) => {
  try {
    const { filename, field } = req.params;
    const data = await readCsvFile(filename);
    
    const uniqueValues = [...new Set(
      data
        .map(item => item[field])
        .filter(value => value && value.trim() !== '')
    )];
    
    res.json({
      success: true,
      field,
      values: uniqueValues,
      total: uniqueValues.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
