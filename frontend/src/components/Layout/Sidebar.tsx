import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Target, 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  ChevronLeft,
  Building
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    {
      title: 'داشبورد',
      icon: Home,
      path: '/',
      badge: null
    },
    {
      title: 'رویکردها',
      icon: Target,
      path: '/approaches',
      badge: null
    },
    {
      title: 'شاخص‌ها',
      icon: BarChart3,
      path: '/indicators',
      badge: '12'
    },
    {
      title: 'گزارشات',
      icon: FileText,
      path: '/reports',
      badge: null
    },
    {
      title: 'کاربران',
      icon: Users,
      path: '/users',
      badge: null
    },
    {
      title: 'تنظیمات',
      icon: Settings,
      path: '/settings',
      badge: null
    }
  ];

  return (
    <>
      {/* Overlay برای موبایل */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* لوگو و عنوان */}
        <div className="sidebar-header">
          <div className="logo">
            <Building size={32} />
          </div>
          {isOpen && (
            <div className="brand">
              <h2>سیستم مدیریت</h2>
              <p>رویکردهای سازمانی</p>
            </div>
          )}
        </div>

        {/* منوی اصلی */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <div className="nav-icon">
                      <IconComponent size={20} />
                    </div>
                    {isOpen && (
                      <>
                        <span className="nav-text">{item.title}</span>
                        {item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* دکمه جمع کردن سایدبار */}
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft 
            size={16} 
            className={`toggle-icon ${isOpen ? 'rotated' : ''}`}
          />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
