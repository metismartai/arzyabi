const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const readCsvFile = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, `${filename}.csv`);
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File ${filename}.csv not found`));
      return;
    }
    
    try {
      // خواندن کل فایل
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // حذف BOM اگر وجود دارد
      const cleanContent = fileContent.replace(/^\uFEFF/, '');
      
      // تقسیم به خطوط
      const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        resolve([]);
        return;
      }
      
      // استخراج headers از خط اول
      const headerLine = lines[0].trim();
      const headers = headerLine.split(';').map(header => header.trim().replace(/"/g, ''));
      
      console.log('Headers found:', headers);
      
      // پردازش سایر خطوط
      const results = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        // تقسیم خط بر اساس سمی‌کالن
        const values = line.split(';').map(value => value.trim().replace(/"/g, ''));
        
        // ایجاد object از headers و values
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        results.push(record);
      }
      
      console.log(`Successfully parsed ${results.length} records from ${filename}.csv`);
      console.log('Sample record keys:', Object.keys(results[0] || {}));
      
      resolve(results);
      
    } catch (error) {
      console.error(`Error reading ${filename}.csv:`, error);
      reject(error);
    }
  });
};

// تابع برای دریافت ساختار ستون‌ها
const getCsvStructure = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, `${filename}.csv`);
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File ${filename}.csv not found`));
      return;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const cleanContent = fileContent.replace(/^\uFEFF/, '');
      const firstLine = cleanContent.split('\n')[0];
      const headers = firstLine.split(';').map(header => header.trim().replace(/"/g, ''));
      
      resolve(headers);
    } catch (error) {
      reject(error);
    }
  });
};

// تابع برای پردازش فایل‌های CSV پیچیده‌تر (اگر نیاز باشد)
const readCsvFileAdvanced = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, `${filename}.csv`);
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File ${filename}.csv not found`));
      return;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const cleanContent = fileContent.replace(/^\uFEFF/, '');
      
      // پردازش پیشرفته‌تر برای مدیریت کوتیشن‌های تو در تو
      const lines = [];
      let currentLine = '';
      let insideQuotes = false;
      
      for (let i = 0; i < cleanContent.length; i++) {
        const char = cleanContent[i];
        
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === '\n' && !insideQuotes) {
          if (currentLine.trim() !== '') {
            lines.push(currentLine.trim());
          }
          currentLine = '';
          continue;
        }
        
        currentLine += char;
      }
      
      // اضافه کردن آخرین خط
      if (currentLine.trim() !== '') {
        lines.push(currentLine.trim());
      }
      
      if (lines.length === 0) {
        resolve([]);
        return;
      }
      
      // استخراج headers
      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine);
      
      console.log('Headers found:', headers);
      
      // پردازش داده‌ها
      const results = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') continue;
        
        const values = parseCSVLine(line);
        
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        results.push(record);
      }
      
      resolve(results);
      
    } catch (error) {
      reject(error);
    }
  });
};

// تابع کمکی برای پردازش خط CSV
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ';' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // اضافه کردن آخرین مقدار
  result.push(current.trim());
  
  return result;
};

const getAllCsvFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(DATA_DIR, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      const csvFiles = files
        .filter(file => file.endsWith('.csv'))
        .map(file => file.replace('.csv', ''));
      
      resolve(csvFiles);
    });
  });
};

module.exports = {
  readCsvFile,
  readCsvFileAdvanced,
  getAllCsvFiles,
  getCsvStructure
};
