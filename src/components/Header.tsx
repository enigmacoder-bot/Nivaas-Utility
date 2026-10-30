import React from 'react';
import { Building2, UserCircle, Code2, RotateCcw } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onToggleRole: () => void;
  onOpenExpoCode: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onToggleRole,
  onOpenExpoCode,
  onResetData,
}) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 shrink-0 z-20">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-semibold text-[#111827] leading-tight">Nivaas Residency</h1>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#F1F3FF] text-[#1D4ED8] font-medium">12 Units</span>
            </div>
            <p className="text-xs text-[#4B5563] leading-tight mt-0.5">
              {currentRole === 'manager' ? 'Admin · Sunil Rao (Secretary)' : 'Resident · Deepak (Flat 201)'}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5">
          {/* Role switcher */}
          <button
            onClick={onToggleRole}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[#111827] hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors"
            title="Switch between Committee/Admin and Tenant view"
            aria-label="Toggle user role"
          >
            <UserCircle className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{currentRole === 'manager' ? 'Admin' : 'Tenant'}</span>
          </button>

          {/* Expo Code view */}
          <button
            onClick={onOpenExpoCode}
            type="button"
            className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#111827] hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors"
            title="Inspect React Native Expo source code"
            aria-label="View React Native Expo code"
          >
            <Code2 className="w-4 h-4 text-[#0F766E]" />
          </button>

          {/* Reset */}
          <button
            onClick={onResetData}
            type="button"
            className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors"
            title="Reset to initial data"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
