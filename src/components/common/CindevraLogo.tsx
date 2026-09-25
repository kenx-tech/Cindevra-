import React from 'react';

interface CindevraLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Cindevra Sovereign Emblem & Brand Mark
 * Faithfully vectorizes the sacred golden tree with sage leaves,
 * downward roots, circular boundary, and elegant serif wordmark.
 */
export const CindevraLogo: React.FC<CindevraLogoProps> = ({ 
  className = '', 
  showWordmark = false,
  size = 'md'
}) => {
  // Dimensions for emblem
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  const emblemDimension = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Sacred Tree Emblem */}
      <div className={`relative ${emblemDimension} shrink-0`}>
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(200,177,149,0.25)]"
        >
          {/* Circular Frame with bottom gap for roots */}
          <path
            d="M 58 152 A 75 75 0 1 1 142 152"
            stroke="#CCA876"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Golden Tree Trunk & Branching Canopy System */}
          <g stroke="#CCA876" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Central Arch / Trunk */}
            <path d="M 85 110 C 92 102 108 102 115 110" strokeWidth="3.5" />
            <path d="M 85 110 C 70 120 60 145 52 165" strokeWidth="3.5" />
            <path d="M 115 110 C 130 120 140 145 148 165" strokeWidth="3.5" />
            
            {/* Center upward trunk */}
            <path d="M 96 102 C 98 85 100 65 100 48" strokeWidth="3.2" />
            <path d="M 104 102 C 102 85 100 65 100 48" strokeWidth="3.2" />

            {/* Upper branches */}
            <path d="M 100 75 C 90 65 80 55 75 48" strokeWidth="2.5" />
            <path d="M 100 75 C 110 65 120 55 125 48" strokeWidth="2.5" />
            
            <path d="M 100 88 C 85 80 70 70 65 65" strokeWidth="2.6" />
            <path d="M 100 88 C 115 80 130 70 135 65" strokeWidth="2.6" />

            {/* Mid branches */}
            <path d="M 94 102 C 80 92 65 90 55 92" strokeWidth="2.8" />
            <path d="M 106 102 C 120 92 135 90 145 92" strokeWidth="2.8" />

            {/* Lower branch arches */}
            <path d="M 88 108 C 72 105 55 112 45 120" strokeWidth="3" />
            <path d="M 112 108 C 128 105 145 112 155 120" strokeWidth="3" />

            {/* Roots System extending downwards */}
            <path d="M 68 152 C 78 155 88 162 92 175" strokeWidth="2.8" />
            <path d="M 132 152 C 122 155 112 162 108 175" strokeWidth="2.8" />
            
            <path d="M 60 162 C 72 170 82 175 88 185" strokeWidth="2.5" />
            <path d="M 140 162 C 128 170 118 175 112 185" strokeWidth="2.5" />

            {/* Center Sacred Root Node / Droplet */}
            <path 
              d="M 100 135 C 95 150 90 165 100 188 C 110 165 105 150 100 135 Z" 
              strokeWidth="2.5"
              fill="none"
            />
          </g>

          {/* Sage Green Leaves */}
          <g fill="#8EA885" stroke="#CCA876" strokeWidth="1.2">
            {/* Apex Leaf */}
            <path d="M 100 32 C 94 42 95 50 100 58 C 105 50 106 42 100 32 Z" />

            {/* Upper Tier Leaves */}
            <path d="M 84 42 C 78 50 80 58 87 64 C 91 56 90 48 84 42 Z" />
            <path d="M 116 42 C 122 50 120 58 113 64 C 109 56 110 48 116 42 Z" />

            {/* Upper-Mid Tier Leaves */}
            <path d="M 68 56 C 62 65 65 73 73 78 C 76 70 74 62 68 56 Z" />
            <path d="M 132 56 C 138 65 135 73 127 78 C 124 70 126 62 132 56 Z" />

            {/* Mid Lateral Tier Leaves */}
            <path d="M 52 75 C 45 84 48 92 57 96 C 60 88 58 80 52 75 Z" />
            <path d="M 148 75 C 155 84 152 92 143 96 C 140 88 142 80 148 75 Z" />

            {/* Lower Large Lateral Leaves */}
            <path d="M 38 105 C 32 115 36 126 48 130 C 51 119 47 110 38 105 Z" />
            <path d="M 162 105 C 168 115 164 126 152 130 C 149 119 153 110 162 105 Z" />
          </g>
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-[#E8EDEA] font-medium leading-none">
            Cindevra
          </span>
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#A8C69F] mt-1 opacity-90">
            Sovereign Entheogen OS
          </span>
        </div>
      )}
    </div>
  );
};
