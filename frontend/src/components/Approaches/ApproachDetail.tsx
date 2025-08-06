// src/components/Approaches/ApproachDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Approach {
  code: string;
  title: string;
  goal: string;
  implementation: string;
  strategies: string[];
  processes: string[];
  strategicObjectives: string[];
  indicators: string[];
  evident_documents: string;
  criteria: string;
  subcriteria: string;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-4">
    <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
    <div className="text-gray-800">{children}</div>
  </div>
);

const DetailList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <DetailSection title={title}>
    {items.length > 0 ? (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    ) : (
      <p className="text-gray-500 italic">موردی تعریف نشده است.</p>
    )}
  </DetailSection>
);

const ApproachDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [approach, setApproach] = useState<Approach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApproach = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/approaches/${code}`);
        setApproach(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch approach details:', err);
        setError('رویکرد مورد نظر یافت نشد یا در دریافت اطلاعات خطایی رخ داد.');
      } finally {
        setLoading(false);
      }
    };
    fetchApproach();
  }, [code]);

  if (loading) return <div className="text-center p-10">در حال بارگذاری جزئیات...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!approach) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <header className="border-b pb-4 mb-6 text-center">
          <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-md mb-2 inline-block">{approach.code}</span>
          <h1 className="text-3xl font-bold text-gray-900">{approach.title}</h1>
          <p className="text-lg text-gray-600 mt-2 italic">"{approach.goal}"</p>
        </header>

        <main>
          <DetailSection title="معیار اصلی">
            <p>{approach.criteria}</p>
          </DetailSection>
          
          <DetailSection title="زیرمعیار">
            <p>{approach.subcriteria}</p>
          </DetailSection>

          <DetailSection title="شرح کامل جاری‌سازی">
            <p className="whitespace-pre-wrap leading-relaxed">{approach.implementation}</p>
          </DetailSection>

          <div className="grid md:grid-cols-2 gap-4">
            <DetailList title="استراتژی‌ها" items={approach.strategies} />
            <DetailList title="فرایندها" items={approach.processes} />
            <DetailList title="اهداف راهبردی" items={approach.strategicObjectives} />
            <DetailList title="شاخص‌ها" items={approach.indicators} />
          </div>

          <DetailSection title="مصادیق و مستندات">
            <p className="whitespace-pre-wrap">{approach.evident_documents || 'موردی تعریف نشده است.'}</p>
          </DetailSection>
        </main>

        <footer className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline">
            &larr; بازگشت به لیست رویکردها
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default ApproachDetail;
