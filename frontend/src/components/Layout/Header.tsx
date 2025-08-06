import React from 'react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, title: 'رویکرد جدید اضافه شد', time: '5 دقیقه پیش', unread: true },
    { id: 2, title: 'گزارش ماهانه آماده است', time: '1 ساعت پیش', unread: true },
    { id: 3, title: 'بروزرسانی سیستم', time: '2 ساعت پیش', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="جستجو در سیستم..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* اعلانات */}
        <div className="notifications-container">
          <button 
            className="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>اعلانات</h3>
                <button className="mark-all-read">همه را خوانده علامت‌گذاری کن</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <p className="notification-title">{notification.title}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {notification.unread && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">مشاهده همه اعلانات</button>
              </div>
            </div>
          )}
        </div>

        {/* منوی کاربر */}
        <div className="user-menu-container">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-info">
              <span className="user-name">علی احمدی</span>
              <span className="user-role">مدیر سیستم</span>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <h3>علی احمدی</h3>
                  <p>ali.ahmadi@example.com</p>
                </div>
              </div>
              
              <div className="dropdown-menu">
                <button className="menu-item">
                  <User size={16} />
                  پروفایل کاربری
                </button>
                <button className="menu-item">
                  <Settings size={16} />
                  تنظیمات
                </button>
                <hr className="menu-divider" />
                <button className="menu-item logout">
                  <LogOut size={16} />
                  خروج از سیستم
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
