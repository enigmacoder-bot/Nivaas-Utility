import React from 'react';
import { LayoutDashboard, Receipt, Droplets, Wrench, Users } from 'lucide-react';
import { ActiveTab } from '../types';

interface TabBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingLedgerCount?: number;
  activeTicketsCount?: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onChangeTab,
  pendingLedgerCount = 0,
  activeTicketsCount = 0,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'ledger' as ActiveTab,
      label: 'Ledger',
      icon: Receipt,
      badge: pendingLedgerCount,
    },
    {
      id: 'utilities' as ActiveTab,
      label: 'Utilities',
      icon: Droplets,
      badge: 0,
    },
    {
      id: 'maintenance' as ActiveTab,
      label: 'Service',
      icon: Wrench,
      badge: activeTicketsCount,
    },
    {
      id: 'directory' as ActiveTab,
      label: 'Directory',
      icon: Users,
      badge: 0,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="bg-white border-t border-[#E5E7EB] shrink-0 z-20 pb-safe"
    >
      <div className="grid grid-cols-5 h-[60px] max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[48px] relative transition-colors select-none ${
                isActive ? 'text-[#0F766E]' : 'text-[#4B5563] hover:text-[#111827]'
              }`}
              type="button"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B91C1C] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[12px] leading-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
