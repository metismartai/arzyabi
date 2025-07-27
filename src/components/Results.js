import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartModal from './ChartModal';
import '../styles/Results.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Results = () => {
  const [data, setData] = useState([]);
  const [subCriteria, setSubCriteria] = useState([]);
  const [selectedSubCriteria, setSelectedSubCriteria] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChartData, setModalChartData] = useState(null);

  useEffect(() => {
    loadCSVData();
    handleURLParams();
  }, []);

  const loadCSVData = () => {
    Papa.parse('/csv/results.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processedData = results.data.map(row => ({
          subCriteria: row['زیرمعیار'],
          title: row['عنوان شاخص'],
          indicatorCode: row['کد شاخص'],
          years: ['1401', '1402', '1403'],
          performance: [
            parseFloat(row['عملکرد 1401']),
            parseFloat(row['عملکرد 1402']),
            parseFloat(row['عملکرد 1403'])
          ],
          targets: [
            parseFloat(row['هدف 1401']),
            parseFloat(row['هدف 1402']),
            parseFloat(row['هدف 1403'])
          ]
        }));

        setData(processedData);
        const uniqueSubCriteria = [...new Set(processedData.map(item => item.subCriteria))];
        setSubCriteria(uniqueSubCriteria);
        
        if (uniqueSubCriteria.length > 0) {
          setSelectedSubCriteria(uniqueSubCriteria[0]);
        }
      },
      error: (error) => {
        console.error('خطا در خواندن فایل results.csv:', error);
      }
    });
  };

  const handleURLParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const indicatorCode = urlParams.get('indicatorCode');
    
    const hash = window.location.hash;
    if (hash && hash.startsWith('#chart-')) {
      const chartId = hash.substring(7);
      setTimeout(() => {
        showChartInModal(chartId);
      }, 500);
      return;
    }

    if (indicatorCode) {
      setTimeout(() => {
        const filteredData = data.filter(item => item.indicatorCode === indicatorCode);
        if (filteredData.length > 0) {
          showChartInModal(indicatorCode);
        }
      }, 500);
    }
  };

  const showChartInModal = (indicatorCode) => {
    const chartData = data.find(item => item.indicatorCode === indicatorCode);
    if (chartData) {
      setModalChartData(chartData);
      setIsModalOpen(true);
    } else {
      alert(`کد شاخص ${indicatorCode} یافت نشد.`);
    }
  };

  const handleChartClick = (indicatorCode) => {
    showChartInModal(indicatorCode);
  };

  const createChartData = (item) => ({
    labels: item.years,
    datasets: [
      {
        label: 'عملکرد',
        data: item.performance,
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'هدف',
        data: item.targets,
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const filteredData = data.filter(item => item.subCriteria === selectedSubCriteria);

  return (
    <div className="results-container">
      <div className="menu">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>زیرمعیارها</h3>
          <Link to="/" className="btn btn-outline-primary btn-sm">
            بازگشت به خانه
          </Link>
        </div>
        <ul className="submenu">
          {subCriteria.map((sub, index) => (
            <li
              key={index}
              className={selectedSubCriteria === sub ? 'active' : ''}
              onClick={() => setSelectedSubCriteria(sub)}
            >
              {sub}
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        <div className="header">
          {selectedSubCriteria ? `نمودارهای زیرمعیار: ${selectedSubCriteria}` : 'نمودارهای زیرمعیار'}
        </div>
        <div className="chart-container">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="chart-box"
              onClick={() => handleChartClick(item.indicatorCode)}
            >
              <h3>{item.title}</h3>
              <div className="indicator-code">کد شاخص: {item.indicatorCode}</div>
              <div className="chart-wrapper">
                <Line data={createChartData(item)} options={chartOptions} />
              </div>
              <div className="click-hint">
                کلیک کنید برای نمایش بزرگتر
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chartData={modalChartData}
      />
    </div>
  );
};

export default Results;
