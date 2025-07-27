import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useResultsData = () => {
  const [resultsData, setResultsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResultsData();
  }, []);

  const loadResultsData = () => {
    Papa.parse('/csv/results.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const processedData = results.data.map(row => ({
            subCriteria: row['زیرمعیار'],
            title: row['عنوان شاخص'],
            indicatorCode: row['کد شاخص'],
            years: ['1401', '1402', '1403'],
            performance: [
              parseFloat(row['عملکرد 1401']) || 0,
              parseFloat(row['عملکرد 1402']) || 0,
              parseFloat(row['عملکرد 1403']) || 0
            ],
            targets: [
              parseFloat(row['هدف 1401']) || 0,
              parseFloat(row['هدف 1402']) || 0,
              parseFloat(row['هدف 1403']) || 0
            ]
          }));
          
          setResultsData(processedData);
          setLoading(false);
        } catch (err) {
          setError('خطا در پردازش داده‌ها');
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('خطا در خواندن فایل results.csv:', error);
        setError('خطا در خواندن فایل CSV');
        setLoading(false);
      }
    });
  };

  const getChartDataByIndicatorCode = (indicatorCode) => {
    return resultsData.find(item => item.indicatorCode === indicatorCode.trim());
  };

  return {
    resultsData,
    loading,
    error,
    getChartDataByIndicatorCode
  };
};
