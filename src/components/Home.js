import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="home-header text-center mb-5">
              <h1 className="display-4 mb-4">سیستم مدیریت رویکردها و نتایج</h1>
              <p className="lead text-muted">
                سامانه جامع مدیریت و نمایش رویکردها، معیارها و نتایج عملکرد
              </p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="home-card">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="home-icon mb-3">
                        <i className="fas fa-chart-line fa-3x text-primary"></i>
                      </div>
                      <h4 className="card-title mb-3">رویکردها</h4>
                      <p className="card-text text-muted mb-4">
                        مشاهده و مدیریت رویکردهای مختلف بر اساس معیارهای تعریف شده
                      </p>
                      <Link to="/approaches" className="btn btn-primary btn-lg w-100">
                        مشاهده رویکردها
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="home-card">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="home-icon mb-3">
                        <i className="fas fa-chart-bar fa-3x text-success"></i>
                      </div>
                      <h4 className="card-title mb-3">نتایج</h4>
                      <p className="card-text text-muted mb-4">
                        نمایش نمودارها و تحلیل نتایج عملکرد بر اساس زیرمعیارها
                      </p>
                      <Link to="/results" className="btn btn-success btn-lg w-100">
                        مشاهده نتایج
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="home-footer text-center mt-5">
              <div className="row">
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-database fa-2x text-info mb-2"></i>
                    <h6>مدیریت داده‌ها</h6>
                    <small className="text-muted">بارگذاری و پردازش داده‌ها از فایل‌های CSV</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-eye fa-2x text-warning mb-2"></i>
                    <h6>نمایش تعاملی</h6>
                    <small className="text-muted">رابط کاربری تعاملی و کاربرپسند</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-mobile-alt fa-2x text-danger mb-2"></i>
                    <h6>طراحی واکنش‌گرا</h6>
                    <small className="text-muted">سازگار با تمام دستگاه‌ها</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
