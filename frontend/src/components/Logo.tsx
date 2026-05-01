import React from 'react';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  subText?: React.ReactNode;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '',
  imageClassName = 'h-8 w-auto',
  textClassName = "text-white font-bold tracking-wider text-xl font-['Syne']",
  subText
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo-primary-cropped.png" alt="SparkClean Logo" className={imageClassName} />
      <div className="flex flex-col justify-center">
        <span className={textClassName}>SparkClean</span>
        {subText && <div className="text-xs font-dm -mt-0.5" style={{ color: 'rgba(10,255,230,0.8)' }}>{subText}</div>}
      </div>
    </div>
  );
};

export default Logo;
