import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useApproachesData = () => {
  const [data, setData] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ابتدا بررسی کنیم که آیا فایل JSON وجود دارد یا نه
      const jsonResponse = await fetch('/json/approaches.json');
      
      if (jsonResponse.ok) {
        // اگر فایل JSON وجود دارد، از آن استفاده کنیم
        const jsonData = await jsonResponse.json();
        processData(jsonData);
      } else {
        // اگر فایل JSON وجود ندارد، از CSV استفاده کنیم
        loadFromCSV();
      }
    } catch (error) {
      console.log('فایل JSON یافت نشد، از CSV استفاده می‌شود');
      loadFromCSV();
    }
  };

  const loadFromCSV = () => {
    Papa.parse('/csv/approaches.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processedData = results.data.map((row, index) => ({
          id: index,
          criteriaTitle: row['عنوان معیار'],
          criteriaCode: row['کد معیار'] || 'C001',
          subCriteriaCode: row['کد زیرمعیار'] || 'SC001',
          approachCode: row['کد رویکرد'],
          approachTitle: row['عنوان رویکرد'],
          approachDescription: row['شرح رویکرد و جاری سازی'],
          evaluation: row['ارزیابی و بهبود و یادگیری'],
          relatedIndexes: row['کد شاخص های مرتبط'] ? row['کد شاخص های مرتبط'].split('|') : [],
          imageUrl: row['آدرس تصویر رویکرد'],
          documents: row['آدرس مستندات مربوطه'] ? row['آدرس مستندات مربوطه'].split('|') : []
        }));
        
        processData(processedData);
      },
      error: (error) => {
        console.error('خطا در خواندن فایل approaches.csv:', error);
        setError('خطا در بارگذاری داده‌ها');
        setLoading(false);
      }
    });
  };

  const processData = (processedData) => {
    setData(processedData);
    const uniqueCriteria = [...new Set(processedData.map(item => item.criteriaTitle))];
    setCriteria(uniqueCriteria);
    setLoading(false);
  };

  const saveToJSON = async (updatedData) => {
    try {
      const response = await fetch('/api/save-approaches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setData(updatedData);
        return { success: true, message: 'تغییرات با موفقیت ذخیره شد' };
      } else {
        return { success: false, message: 'خطا در ذخیره‌سازی' };
      }
    } catch (error) {
      console.error('خطا در ذخیره‌سازی:', error);
      return { success: false, message: 'خطا در ذخیره‌سازی' };
    }
  };

  return {
    data,
    criteria,
    loading,
    error,
    setData,
    saveToJSON
  };
};
