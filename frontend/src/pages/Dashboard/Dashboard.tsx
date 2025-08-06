import React from 'react';
import { 
  Target, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'کل رویکردها',
      value: '124',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'شاخص‌های فعال',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'گزارشات ماهانه',
      value: '24',
      change: '-3%',
      trend: 'down',
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'کاربران فعال',
      value: '156',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'approach',
      title: 'رویکرد جدید "بهبود کیفیت خدمات" اضافه شد',
      time: '2 ساعت پیش',
      user: 'علی احمدی'
    },
    {
      id: 2,
      type: 'report',
      title: 'گزارش ماهانه شاخص‌های عملکرد تولید شد',
      time: '4 ساعت پیش',
      user: 'مریم رضایی'
    },
    {
      id: 3,
      type: 'indicator',
      title: 'شاخص "رضایت مشتریان" بروزرسانی شد',
      time: '6 ساعت پیش',
      user: 'حسن محمدی'
    },
    {
      id: 4,
      type: 'user',
      title: 'کاربر جدید به سیستم اضافه شد',
      time: '1 روز پیش',
      user: 'مدیر سیستم'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'بررسی رویکردهای ماه گذشته',
      dueDate: '1403/08/15',
      priority: 'high',
      assignee: 'تیم ارزیابی'
    },
    {
      id: 2,
      title: 'تهیه گزارش فصلی شاخص‌ها',
      dueDate: '1403/08/20',
      priority: 'medium',
      assignee: 'واحد گزارش‌گیری'
    },
    {
      id: 3,
      title: 'بروزرسانی معیارهای ارزیابی',
      dueDate: '1403/08/25',
      priority: 'low',
      assignee: 'کمیته فنی'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approach': return Target;
      case 'report': return FileText;
      case 'indicator': return BarChart3;
      case 'user': return Users;
      default: return Calendar;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>داشبورد مدیریت</h1>
        <p>نمای کلی از وضعیت سیستم مدیریت رویکردهای سازمانی</p>
      </div>

      {/* آمار کلی */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        {/* فعالیت‌های اخیر */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>فعالیت‌های اخیر</h2>
            <button className="view-all-btn">مشاهده همه</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <IconComponent size={16} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* وظایف آتی */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>وظایف آتی</h2>
            <button className="view-all-btn">مشاهده همه</button>
          </div>
          <div className="tasks-list">
            {upcomingTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className={`task-priority ${getPriorityColor(task.priority)}`}></div>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <div className="task-meta">
                    <span className="task-assignee">{task.assignee}</span>
                    <span className="task-date">
                      <Calendar size={14} />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
