import React from 'react';
import { Droplet, Clock, ArrowUpRight } from 'lucide-react';
import { WaterTank } from '../types';
import { calculateWaterTankMetrics } from '../utils/formatters';

interface WaterLevelCardProps {
  tank: WaterTank;
  onManage?: () => void;
  showManageButton?: boolean;
}

export const WaterLevelCard: React.FC<WaterLevelCardProps> = ({
  tank,
  onManage,
  showManageButton = true,
}) => {
  const metrics = calculateWaterTankMetrics(tank.currentLiters, tank.capacityLiters);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] transition-all">
      {/* Header with Water Accent */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 text-[#1D4ED8]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#111827] leading-6">{tank.name}</h3>
            <p className="text-sm text-[#4B5563] leading-5">{tank.location}</p>
          </div>
        </div>

        {/* State Badge */}
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium shrink-0"
          style={{ backgroundColor: metrics.badgeStyle.bg, color: metrics.badgeStyle.text }}
        >
          {metrics.statusLabel}
        </span>
      </div>

      {/* Numerical Data (clean, disciplined, no decorative radial gauges) */}
      <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-[#111827] leading-8">
              {metrics.percentage}%
            </span>
            <span className="text-sm font-medium text-[#4B5563]">Capacity</span>
          </div>
          <div className="text-right">
            <span className="text-base font-semibold text-[#111827]">
              {tank.currentLiters.toLocaleString('en-IN')}L
            </span>
            <span className="text-sm text-[#4B5563]"> / {tank.capacityLiters.toLocaleString('en-IN')}L</span>
          </div>
        </div>

        {/* Clean, Pragmatic Progress Fill */}
        <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden mt-1 mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${metrics.percentage}%`,
              backgroundColor: metrics.percentage <= 20 ? '#B91C1C' : metrics.percentage <= 45 ? '#D97706' : '#1D4ED8',
            }}
          />
        </div>

        {/* Metadata Details */}
        <div className="flex items-center justify-between gap-2 text-sm text-[#4B5563] pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[#111827] font-medium">Source:</span>
            <span>{tank.supplySource}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#111827] font-medium">Pump:</span>
            <span className={tank.pumpStatus === 'Active' ? 'text-[#166534] font-medium' : 'text-[#4B5563]'}>
              {tank.pumpStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[#4B5563] mt-2 pt-2 border-t border-[#E5E7EB]">
          <span className="inline-flex items-center gap-1 text-sm text-[#4B5563]">
            <Clock className="w-3.5 h-3.5 text-[#6e7977]" />
            {tank.lastUpdated}
          </span>

          {showManageButton && onManage && (
            <button
              onClick={onManage}
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59] transition-colors focus:outline-none"
            >
              <span>Update / Log</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
