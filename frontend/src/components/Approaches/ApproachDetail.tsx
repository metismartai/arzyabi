import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Target, 
  Settings, 
  TrendingUp, 
  BarChart3, 
  FileText,
  Calendar,
  User,
  Edit,
  Share2,
  Download
} from 'lucide-react';
import './ApproachDetail.css';

interface ApproachDetail {
  id: string;
  code: string;
  title: string;
  objective: string;
  implementation: string;
  description: string;
  criterion: {
    id: string;
    name: string;
  };
  sub_criterion: {
    id: string;
    name: string;
  };
  strategies: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  processes: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  strategic_objectives: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  indicators: Array<{
    id: string;
    name: string;
    unit: string;
    target_value: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    upload_date: string;
  }>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const ApproachDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [approach, setApproach] = useState<ApproachDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchApproachDetail(id);
    }
  }, [id]);

  const fetchApproachDetail = async (approachId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/approaches/${approachId}`);
      if (!response.ok) throw new Error('خطا در بارگذاری جزئیات رویکرد');
      const data = await response.json();
      setApproach(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/approaches');
  };

  const handleEdit = () => {
    navigate(`/approaches/${id}/edit`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: approach?.title,
        text: approach?.objective,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // نمایش toast موفقیت
    }
  };

  const handleDownload = () => {
    // پیاده‌سازی دانلود PDF
    window.print();
  };

  if (loading) {
    return (
      <div className="approach-detail-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری جزئیات رویکرد...</p>
      </div>
    );
  }

  if (error || !approach) {
    return (
      <div className="approach-detail-error">
        <p>{error || 'رویکرد یافت نشد'}</p>
        <button onClick={handleBack} className="back-btn">
          بازگشت به لیست رویکردها
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: Target },
    { id: 'strategies', label: 'استراتژی‌ها', icon: TrendingUp },
    { id: 'processes', label: 'فرایندها', icon: Settings },
    { id: 'objectives', label: 'اهداف راهبردی', icon: Target },
    { id: 'indicators', label: 'شاخص‌ها', icon: BarChart3 },
    { id: 'documents', label: 'مستندات', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content overview-tab">
            <div className="overview-grid">
              <div className="overview-section">
                <h3>هدف رویکرد</h3>
                <p>{approach.objective}</p>
              </div>
              
              <div className="overview-section">
                <h3>شرح کامل</h3>
                <p>{approach.description}</p>
              </div>
              
              <div className="overview-section">
                <h3>جاری‌سازی</h3>
                <p>{approach.implementation}</p>
              </div>
              
              <div className="overview-stats">
                <div className="stat-card">
                  <TrendingUp className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-number">{approach.strategies.length}</span>
                    <span className="stat-label">استراتژی</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Settings className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-number">{approach.processes.length}</span>
                    <span className="stat-label">فرایند</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Target className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-number">{approach.strategic_objectives.length}</span>
                    <span className="stat-label">هدف راهبردی</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <BarChart3 className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-number">{approach.indicators.length}</span>
                    <span className="stat-label">شاخص</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="tab-content strategies-tab">
            <div className="items-grid">
              {approach.strategies.map((strategy) => (
                <div key={strategy.id} className="item-card">
                  <h4>{strategy.name}</h4>
                  <p>{strategy.description}</p>
                </div>
              ))}
            </div>
            {approach.strategies.length === 0 && (
              <div className="empty-state">
                <p>هیچ استراتژی‌ای تعریف نشده است</p>
              </div>
            )}
          </div>
        );

      case 'processes':
        return (
          <div className="tab-content processes-tab">
            <div className="items-grid">
              {approach.processes.map((process) => (
                <div key={process.id} className="item-card">
                  <h4>{process.name}</h4>
                  <p>{process.description}</p>
                </div>
              ))}
            </div>
            {approach.processes.length === 0 && (
              <div className="empty-state">
                <p>هیچ فرایندی تعریف نشده است</p>
              </div>
            )}
          </div>
        );

      case 'objectives':
        return (
          <div className="tab-content objectives-tab">
            <div className="items-grid">
              {approach.strategic_objectives.map((objective) => (
                <div key={objective.id} className="item-card">
                  <h4>{objective.name}</h4>
                  <p>{objective.description}</p>
                </div>
              ))}
            </div>
            {approach.strategic_objectives.length === 0 && (
              <div className="empty-state">
                <p>هیچ هدف راهبردی تعریف نشده است</p>
              </div>
            )}
          </div>
        );

      case 'indicators':
        return (
          <div className="tab-content indicators-tab">
            <div className="indicators-table">
              <table>
                <thead>
                  <tr>
                    <th>نام شاخص</th>
                    <th>واحد</th>
                    <th>مقدار هدف</th>
                  </tr>
                </thead>
                <tbody>
                  {approach.indicators.map((indicator) => (
                    <tr key={indicator.id}>
                      <td>{indicator.name}</td>
                      <td>{indicator.unit}</td>
                      <td>{indicator.target_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {approach.indicators.length === 0 && (
              <div className="empty-state">
                <p>هیچ شاخصی تعریف نشده است</p>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="tab-content documents-tab">
            <div className="documents-grid">
              {approach.documents.map((document) => (
                <div key={document.id} className="document-card">
                  <div className="document-icon">
                    <FileText size={24} />
                  </div>
                  <div className="document-info">
                    <h4>{document.name}</h4>
                    <p className="document-type">{document.type}</p>
                    <p className="document-date">
                      <Calendar size={14} />
                      {new Date(document.upload_date).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div className="document-actions">
                    <a 
                      href={document.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="download-btn"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {approach.documents.length === 0 && (
              <div className="empty-state">
                <p>هیچ مستندی موجود نیست</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="approach-detail-page">
      {/* هدر صفحه */}
      <div className="detail-header">
        <div className="header-actions">
          <button onClick={handleBack} className="back-button">
            <ArrowRight size={16} />
            بازگشت
          </button>
          
          <div className="header-buttons">
            <button onClick={handleShare} className="action-btn share-btn">
              <Share2 size={16} />
              اشتراک‌گذاری
            </button>
            <button onClick={handleDownload} className="action-btn download-btn">
              <Download size={16} />
              دانلود
            </button>
            <button onClick={handleEdit} className="action-btn edit-btn">
              <Edit size={16} />
              ویرایش
            </button>
          </div>
        </div>

        <div className="header-content">
          <div className="title-section">
            <h1>{approach.title}</h1>
            <span className="approach-code">{approach.code}</span>
          </div>
          
          <div className="meta-info">
            <div className="meta-item">
              <span className="meta-label">معیار:</span>
              <span className="meta-value">{approach.criterion.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">زیرمعیار:</span>
              <span className="meta-value">{approach.sub_criterion.name}</span>
            </div>
            <div className="meta-item">
              <User size={14} />
              <span>{approach.created_by}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{new Date(approach.updated_at).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="detail-tabs">
        <div className="tabs-nav">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="tabs-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ApproachDetail;
