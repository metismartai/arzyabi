import { useState, useEffect } from 'react';

export const useDocuments = () => {
  const [documentsStructure, setDocumentsStructure] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentsStructure();
  }, []);

  const loadDocumentsStructure = async () => {
    try {
      // لیست کدهای رویکرد که ممکن است فولدر داشته باشند
      const possibleApproachCodes = ['A001', 'A002', 'A003', 'A004', 'A005', 'A006', 'A007', 'A008', 'A009', 'A010'];
      const structure = {};
      
      for (const code of possibleApproachCodes) {
        try {
          // تلاش برای دسترسی به فولدر
          const response = await fetch(`/public/Documents/${code}/`);
          
          if (response.ok) {
            // اگر فولدر وجود دارد، سعی می‌کنیم فهرست فایل‌ها را بگیریم
            // در محیط واقعی، باید از API سرور استفاده کنید
            
            // شبیه‌سازی فایل‌های موجود بر اساس کد رویکرد
            const files = await getFilesForApproach(code);
            if (files.length > 0) {
              structure[code] = files;
            }
          }
        } catch (error) {
          // اگر فولدر وجود نداشت، نادیده می‌گیریم
          console.log(`فولدر ${code} یافت نشد یا قابل دسترسی نیست`);
        }
      }
      
      setDocumentsStructure(structure);
      setLoading(false);
    } catch (error) {
      console.error('خطا در بارگذاری ساختار مستندات:', error);
      setLoading(false);
    }
  };

  // شبیه‌سازی دریافت فایل‌ها برای هر کد رویکرد
  const getFilesForApproach = async (approachCode) => {
    // در پروژه واقعی، این باید از API سرور بیاید
    const mockFiles = {
      'A001': ['گزارش_عملکرد.pdf', 'ارزیابی_داخلی.docx', 'نمودار_نتایج.xlsx'],
      'A002': ['راهنمای_اجرا.pdf', 'چک_لیست.docx'],
      'A003': ['مستندات_فنی.pdf', 'دستورالعمل.docx', 'فرم_ارزیابی.pdf', 'گزارش_تحلیل.xlsx'],
      'A004': ['خلاصه_اجرایی.pdf'],
      'A005': ['برنامه_بهبود.pdf', 'گزارش_پیشرفت.xlsx']
    };
    
    return mockFiles[approachCode] || [];
  };

  const getDocumentsByApproachCode = (approachCode) => {
    return documentsStructure[approachCode] || [];
  };

  const getDocumentUrl = (approachCode, fileName) => {
    return `/public/documents/${approachCode}/${fileName}`;
  };

  return {
    documentsStructure,
    loading,
    getDocumentsByApproachCode,
    getDocumentUrl
  };
};
