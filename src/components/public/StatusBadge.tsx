import React from 'react';
import { HorseStatus, RescueStatus } from '../../types/database';

interface StatusBadgeProps {
  status: HorseStatus | RescueStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let style = 'bg-[#FAF9F6] text-[#73716B] border-[#B7B0A4]/40';

  switch (status) {
    case 'Available':
    case 'Looking for a Home':
      style = 'bg-[#24362D]/10 text-[#24362D] border-[#24362D]/30';
      break;
    case 'Reserved':
    case 'In Rehabilitation':
      style = 'bg-[#A89472]/15 text-[#6B5A3E] border-[#A89472]/40';
      break;
    case 'Sold':
    case 'Adopted':
    case 'Permanently Rehomed':
      style = 'bg-[#73716B]/15 text-[#73716B] border-[#73716B]/30';
      break;
    case 'Sanctuary':
      style = 'bg-[#24362D]/15 text-[#24362D] border-[#24362D]/40 font-medium';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 text-xs font-sans tracking-wider uppercase rounded-full border ${style} ${className}`}
    >
      {status}
    </span>
  );
};
