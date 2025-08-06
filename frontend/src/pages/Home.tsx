import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Carousel from '../components/Home/Carousel';
import NavigationBox from '../components/Home/NavigationBox';
import './Home.css';

// آیکون‌های مورد نیاز
import { 
  BarChart3, 
  Route, 
  TrendingUp, 
  Settings, 
  Target, 
  Crosshair, 
  FileText 
} from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface NavigationBoxData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  path: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

// داده‌های carousel
const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "تحلیل جامع سازمانی",
    description: "بررسی عمیق وضعیت فعلی سازمان و شناسایی نقاط قوت و ضعف",
    icon: "🔍",
    color: "var(--primary)"
  },
  {
    id: 2,
    title: "رویکردهای بهبود",
    description: "ارائه راهکارهای عملی و اجرایی برای ارتقای عملکرد سازمانی",
    icon: "🚀",
    color: "var(--secondary)"
  },
  {
    id: 3,
    title: "مدیریت استراتژیک",
    description: "تدوین و پیاده‌سازی استراتژی‌های مؤثر برای دستیابی به اهداف",
    icon: "🎯",
    color: "var(--accent)"
  },
  {
    id: 4,
    title: "نظارت و کنترل",
    description: "پایش مستمر فرایندها و اندازه‌گیری میزان پیشرفت",
    icon: "📊",
    color: "var(--gray-700)"
  },
  {
    id: 5,
    title: "گزارش‌گیری هوشمند",
    description: "تولید گزارش‌های تحلیلی و بصری برای تصمیم‌گیری بهتر",
    icon: "📈",
    color: "var(--danger)"
  }
];

// داده‌های باکس‌های ناوبری
const navigationBoxes: NavigationBoxData[] = [
  {
    id: 'dashboard',
    title: 'داشبورد',
    description: 'نمای کلی و آمارهای سازمان',
    icon: BarChart3,
    color: 'var(--primary)',
    path: '/dashboard'
  },
  {
    id: 'approaches',
    title: 'رویکردها',
    description: 'مدیریت رویکردهای بهبود',
    icon: Route,
    color: 'var(--secondary)',
    path: '/approaches'
  },
  {
    id: 'results',
    title: 'نتایج',
    description: 'نتایج و دستاوردها',
    icon: TrendingUp,
    color: 'var(--danger)',
    path: '/results'
  },
  {
    id: 'process',
    title: 'فرایندها',
    description: 'مدیریت فرایندهای سازمانی',
    icon: Settings,
    color: 'var(--gray-700)',
    path: '/process'
  },
  {
    id: 'strategy',
    title: 'استراتژی',
    description: 'برنامه‌ریزی استراتژیک',
    icon: Target,
    color: 'var(--accent)',
    path: '/strategy'
  },
  {
    id: 'objectives',
    title: 'اهداف راهبردی',
    description: 'تعریف و پیگیری اهداف',
    icon: Crosshair,
    color: 'var(--primary)',
    path: '/objectives'
  },
  {
    id: 'documents',
    title: 'مستندات و شواهد',
    description: 'مدیریت اسناد و مدارک',
    icon: FileText,
    color: 'var(--secondary)',
    path: '/documents'
  }
];
  

  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <motion.header 
        className="home-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="company-info">
            <div className="company-logo">
              <img 
                src="/logo.png" 
                alt="لوگوی شرکت" 
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div className="logo-placeholder">
                <span>LOGO</span>
              </div>
            </div>
            <div className="company-details">
              <h1 className="system-title">سامانه رادار تعالی سازمانی</h1>
              <h2 className="company-name">نام شرکت شما</h2>
            </div>
          </div>
        </div>
      </motion.header>


      {/* Navigation Boxes Section */}
      <motion.section 
        className="navigation-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="section-title">
          <h3>بخش‌های سامانه</h3>
          <p>دسترسی سریع به تمامی قسمت‌های سامانه</p>
        </div>
        
        <div className="navigation-grid">
          {navigationBoxes.map((box, index) => (
            <NavigationBox
              key={box.id}
              {...box}
              onClick={() => handleNavigate(box.path)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.section>

      {/* Features Carousel Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="section-title">
          <h3>ویژگی‌های سامانه</h3>
          <p>قابلیت‌ها و امکانات سامانه رادار تعالی سازمانی</p>
        </div>
        <Carousel slides={carouselSlides} />
      </motion.section>



    </div>
  );
};

export default Home;
