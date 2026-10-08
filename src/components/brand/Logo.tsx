import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'md', className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Vector Emblem based on Brand Card */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
          aria-hidden="true"
        >
          {/* Base Open Book Pages */}
          <path
            d="M50 82C40 76 22 75 14 78C13 78.5 12 79.5 12 80.5C22 78.5 38 79.5 48 85.5L50 82Z"
            fill="#174B32"
          />
          <path
            d="M50 82C60 76 78 75 86 78C87 78.5 88 79.5 88 80.5C78 78.5 62 79.5 52 85.5L50 82Z"
            fill="#174B32"
          />
          <path
            d="M50 86C38 80.5 24 80 16 83L15 85C24 82 38 82.5 49 88.5L50 86Z"
            fill="#277448"
          />
          <path
            d="M50 86C62 80.5 76 80 84 83L85 85C76 82 62 82.5 51 88.5L50 86Z"
            fill="#277448"
          />

          {/* Organic Sprouting Leaves & Human Torso */}
          <path
            d="M50 78C46 64 36 52 42 38C45 32 50 31 52 35C48 44 54 55 58 64C59 67 55 75 50 78Z"
            fill="#277448"
          />
          <path
            d="M48 68C38 60 32 46 36 34C37 31 40 30 42 32C38 42 43 54 50 62L48 68Z"
            fill="#3FA363"
          />

          {/* Upward Reaching Figure Arm */}
          <path
            d="M52 36C56 26 64 22 70 20C71 21 70 23 68 25C62 29 57 37 54 44L52 36Z"
            fill="#1F5A38"
          />

          {/* Human Figure Head */}
          <circle cx="58" cy="27" r="5.5" fill="#174B32" />

          {/* Golden Guiding Star */}
          <path
            d="M74 15L76 9L78 15L84 17L78 19L76 25L74 19L68 17L74 15Z"
            fill="#F2A93B"
          />
          <circle cx="76" cy="17" r="1.5" fill="#FFFDF7" />
        </svg>
      </div>

      {variant !== 'iconOnly' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-tight text-[#174B32] ${textSizes[size]}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              SWAYAM<span className="text-[#277448]">.SI</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1F5A38] bg-[#E2EFE7] px-1.5 py-0.5 rounded-sm">
              Nav
            </span>
          </div>
          {variant === 'full' && size !== 'sm' && (
            <span className="text-[11px] font-medium text-[#5E6E64] tracking-tight mt-0.5">
              Sarkari Yojana · Exam Guide · Aapke Saath
            </span>
          )}
        </div>
      )}
    </div>
  );
};
