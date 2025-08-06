import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './NavigationBox.css';

interface NavigationBoxProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
  delay?: number;
}

const NavigationBox: React.FC<NavigationBoxProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick, 
  delay = 0 
}) => {
  return (
    <motion.div
      className="navigation-box"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: `0 10px 30px ${color}30` 
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ '--box-color': color } as React.CSSProperties}
    >
      <div className="box-content">
        <div 
          className="box-icon"
          style={{ backgroundColor: color }}
        >
          <Icon size={24} />
        </div>
        <div className="box-text">
          <h4 style={{ color: color }}>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
      
      <div 
        className="box-arrow"
        style={{ color: color }}
      >
        <ArrowRight size={20} />
      </div>
    </motion.div>
  );
};

export default NavigationBox;
