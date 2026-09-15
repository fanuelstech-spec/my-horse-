import React from 'react';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  category,
  actionLabel,
  onAction,
  actionIcon,
  children,
}) => {
  return (
    <div className="bg-[#FFFFFF] border-b border-[#B7B0A4]/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 transition-all">
      <div className="min-w-0 flex-1">
        {category && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block mb-0.5">
            {category}
          </span>
        )}
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#20201E] tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#73716B] mt-0.5 line-clamp-2 max-w-2xl font-light">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        {children}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1b2821] transition-colors rounded-none shadow-xs font-medium min-h-[38px] cursor-pointer"
          >
            {actionIcon || <Plus className="w-3.5 h-3.5 shrink-0" />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
