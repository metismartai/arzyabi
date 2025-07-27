import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/ChartModal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartModal = ({ isOpen, onClose, chartData, loading = false, error = null }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      // جلوگیری از اسکرول صفحه پس‌زمینه
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="chart-modal" ref={modalRef}>
        <div className="chart-modal-content">
          <span className="chart-close" onClick={onClose}>
            &times;
          </span>
          <div className="chart-modal-loading">
            <div className="spinner"></div>
            <p>در حال بارگذاری داده‌ها...</p>
          </div>
        </div>
      </div>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <div className="chart-modal" ref={modalRef}>
        <div className="chart-modal-content">
          <span className="chart-close" onClick={onClose}>
            &times;
          </span>
          <div className="chart-modal-error">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>خطا در بارگذاری داده‌ها</h3>
            <p>{error}</p>
            <button className="btn-close-chart" onClick={onClose}>
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  }

  // نمایش پیام عدم وجود داده
  if (!chartData) {
    return (
      <div className="chart-modal" ref={modalRef}>
        <div className="chart-modal-content">
          <span className="chart-close" onClick={onClose}>
            &times;
          </span>
          <div className="chart-modal-no-data">
            <i className="fas fa-chart-line"></i>
            <h3>داده‌ای یافت نشد</h3>
            <p>برای این کد شاخص، اطلاعاتی در دسترس نیست.</p>
            <button className="btn-close-chart" onClick={onClose}>
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = {
    labels: chartData.years,
    datasets: [
      {
        label: 'عملکرد',
        data: chartData.performance,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#007bff',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 10,
      },
      {
        label: 'هدف',
        data: chartData.targets,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderDash: [10, 5],
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#dc3545',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
            family: 'Vazir, Tahoma, Arial, sans-serif'
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          family: 'Vazir, Tahoma, Arial, sans-serif'
        },
        bodyFont: {
          size: 13,
          family: 'Vazir, Tahoma, Arial, sans-serif'
        },
        rtl: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 14,
            family: 'Vazir, Tahoma, Arial, sans-serif'
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 14,
            family: 'Vazir, Tahoma, Arial, sans-serif'
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="chart-modal" ref={modalRef}>
      <div className="chart-modal-content">
        <span className="chart-close" onClick={onClose}>
          &times;
        </span>
        <div className="chart-modal-header">
          <div className="chart-title">{chartData.title}</div>
          <div className="chart-subtitle">
            کد شاخص: {chartData.indicatorCode}
          </div>
          <div className="chart-subcriteria">
            زیرمعیار: {chartData.subCriteria}
          </div>
        </div>
        <div className="chart-modal-body">
          <div className="chart-container">
            <Line data={data} options={options} />
          </div>
        </div>
        <div className="chart-modal-footer">
          <button className="btn-close-chart" onClick={onClose}>
            <i className="fas fa-times"></i>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
