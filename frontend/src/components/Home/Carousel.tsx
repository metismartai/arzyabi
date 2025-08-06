import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './Carousel.css';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoPlay = true, 
  interval = 4000 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button 
          className="carousel-btn prev-btn" 
          onClick={prevSlide}
          aria-label="اسلاید قبلی"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="carousel-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="carousel-slide"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className="slide-content"
                style={{ borderColor: slides[currentSlide].color }}
              >
                <div 
                  className="slide-icon"
                  style={{ backgroundColor: slides[currentSlide].color }}
                >
                  {slides[currentSlide].icon}
                </div>
                <div className="slide-text">
                  <h4 style={{ color: slides[currentSlide].color }}>
                    {slides[currentSlide].title}
                  </h4>
                  <p>{slides[currentSlide].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <button 
          className="carousel-btn next-btn" 
          onClick={nextSlide}
          aria-label="اسلاید بعدی"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            style={{
              backgroundColor: index === currentSlide ? slides[currentSlide].color : '#ccc'
            }}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
