// src/types/interfaces.ts
export interface ApproachData {
  "معیار": string;
  "زیرمعیار": string;
  "کد رویکرد": string;
  "عنوان رویکرد": string;
  "مصادیق مستندات": string;
  "هدف رویکرد": string;
  "فرایندهای مرتبط": string;
  "اهداف و استراتژی های مرتبط": string;
  "اهداف راهبردی مرتبط": string;
  "شاخص‌های مرتبط از بانک شاخص‌ها": string;
  "شرح جاری سازی": string;
  "مستندات مرتبط": string;
}

export interface ApiResponse {
  success: boolean;
  filename: string;
  totalRecords: number;
  parserType: string;
  data: ApproachData[];
}

export interface FilterOptions {
  معیارها: string[];
  زیرمعیارها: string[];
  اهدافراهبردی: string[];
  شاخصها: string[];
}

export interface FilterState {
  معیار?: string;
  زیرمعیار?: string;
  اهدافراهبردی?: string;
  searchTerm?: string;
}
