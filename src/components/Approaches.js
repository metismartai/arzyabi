import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChartModal from './ChartModal';
import { useResultsData } from '../hooks/useCSVData';
import { useDocuments } from '../hooks/useDocuments';
import { useApproachesData } from '../hooks/useApproachesData';
import '../styles/Approaches.css';

const Approaches = () => {
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndicatorCode, setSelectedIndicatorCode] = useState('');
  
  // استفاده از Hook‌های سفارشی
  const { data, criteria, loading: approachesLoading } = useApproachesData();
  const { getChartDataByIndicatorCode, loading: resultsLoading, error: resultsError } = useResultsData();
  const { getDocumentsByApproachCode, getDocumentUrl } = useDocuments();

  React.useEffect(() => {
    if (criteria.length > 0 && !selectedCriterion) {
      setSelectedCriterion(criteria[0]);
    }
  }, [criteria, selectedCriterion]);

  const handleChartClick = (indicatorCode) => {
    setSelectedIndicatorCode(indicatorCode.trim());
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIndicatorCode('');
  };

  const handleDocumentClick = (approachCode, fileName) => {
    const documentUrl = getDocumentUrl(approachCode, fileName);
    window.open(documentUrl, '_blank');
  };

  if (approachesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  const filteredData = data.filter(item => item.criteriaTitle === selectedCriterion);
  const chartData = selectedIndicatorCode ? getChartDataByIndicatorCode(selectedIndicatorCode) : null;

  return (
    <div className="approaches-container">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 bg-light menu p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-center">معیارها</h3>
              <Link to="/" className="btn btn-outline-primary btn-sm">
                <i className="fas fa-home"></i>
                خانه
              </Link>
            </div>
            <ul className="list-group">
              {criteria.map((criterion, index) => (
                <li
                  key={index}
                  className={`list-group-item ${selectedCriterion === criterion ? 'active' : ''}`}
                  onClick={() => setSelectedCriterion(criterion)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-folder"></i>
                  {criterion}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link to="/approachestable" className="btn btn-info w-100">
                <i className="fas fa-table"></i>
                نمایش جدولی
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 p-4">
            <div className="page-header">
              <h1 className="text-center mb-4">
                <i className="fas fa-chart-line"></i>
                {selectedCriterion ? ` رویکردهای معیار: ${selectedCriterion}` : ' رویکردها'}
              </h1>
              <div className="text-center mb-4">
                <Link to="/results" className="btn btn-success">
                  <i className="fas fa-chart-bar"></i>
                  مشاهده همه نتایج
                </Link>
              </div>
            </div>
            
            <div className="approaches-content">
              {filteredData.length === 0 ? (
                <div className="no-data">
                  <i className="fas fa-info-circle"></i>
                  <p>هیچ رویکردی برای این معیار یافت نشد.</p>
                </div>
              ) : (
                filteredData.map((item, index) => (
                  <div key={index} className="approach-card card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        <i className="fas fa-lightbulb"></i>
                        {item.approachTitle}
                      </span>
                      <span className="badge bg-primary">{item.approachCode}</span>
                    </div>
                    
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        className="card-img-top"
                        alt={item.approachTitle}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="card-body">
                      <div className="approach-section">
                        <h4>
                          <i className="fas fa-cogs"></i>
                          شرح و جاری سازی رویکرد
                        </h4>
                        <p className="card-text">{item.approachDescription}</p>
                      </div>
                      
                      <hr />
                      
                      <div className="approach-section">
                        <h4>
                          <i className="fas fa-chart-pie"></i>
                          ارزیابی و اصلاح و یادگیری
                        </h4>
                        <p className="card-text">{item.evaluation}</p>
                      </div>

                      <hr />

                      {/* بخش شاخص‌ها و مستندات - دو ستونه */}
                      <div className="row">
                        {/* ستون چپ - شاخص‌های مرتبط */}
                        <div className="col-md-6">
                          {item.relatedIndexes.length > 0 && (
                            <div className="indicators-section">
                              <h6>
                                <i className="fas fa-chart-bar"></i>
                                شاخص‌های مرتبط:
                              </h6>
                              <div className="indicators-container">
                                {item.relatedIndexes.map((indexCode, indexKey) => (
                                  indexCode.trim() && (
                                    <span
                                      key={indexKey}
                                      className="badge bg-secondary me-2 mb-2 chart-link"
                                      onClick={() => handleChartClick(indexCode.trim())}
                                      title={`کلیک کنید تا نمودار ${indexCode.trim()} را مشاهده کنید`}
                                    >
                                      <i className="fas fa-chart-line"></i>
                                      {indexCode.trim()}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ستون راست - مستندات مربوطه */}
                        <div className="col-md-6">
                          <div className="documents-section">
                            <h6>
                              <i className="fas fa-file-alt"></i>
                              مستندات مربوطه:
                            </h6>
                            <div className="documents-container">
                              {(() => {
                                const docs = getDocumentsByApproachCode(item.approachCode);
                                if (docs.length === 0) {
                                  return (
                                    <span className="text-muted">
                                      <i className="fas fa-info-circle"></i>
                                      مستندی یافت نشد
                                    </span>
                                  );
                                }
                                return docs.map((fileName, docIndex) => (
                                  <span
                                    key={docIndex}
                                    className="badge bg-info me-2 mb-2 document-badge"
                                    onClick={() => handleDocumentClick(item.approachCode, fileName)}
                                    title={`مستند ${docIndex + 1}: ${fileName}`}
                                  >
                                    <i className="fas fa-download"></i>
                                    {docIndex + 1}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        chartData={chartData}
        loading={resultsLoading}
        error={resultsError}
      />
    </div>
  );
};

export default Approaches;
