import React from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isDeviceFrame: boolean;
  onToggleFrame: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isDeviceFrame,
  onToggleFrame,
}) => {
  return (
    <div className="min-h-screen bg-[#E9EDFF]/40 flex flex-col items-center justify-start p-0 md:py-6 md:px-4">
      {/* Top Device & Environment Control Bar (visible on md screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[430px] mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#166534] animate-pulse" />
          <span className="text-xs font-semibold text-[#141B2B] tracking-wide">
            Expo Go Simulator · 390px
          </span>
        </div>
        <button
          onClick={onToggleFrame}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] shadow-xs hover:bg-[#F6F7F9] transition-all"
          title="Toggle phone shell bezel"
        >
          {isDeviceFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Full View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Device Bezel</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container - either realistic iPhone/Expo bezel or clean responsive card */}
      <div
        className={`w-full max-w-[420px] bg-white transition-all flex flex-col relative overflow-hidden ${
          isDeviceFrame
            ? 'md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(15,118,110,0.25),0_0_0_12px_#1F2937,0_0_0_14px_#374151] md:min-h-[850px] md:max-h-[92vh]'
            : 'md:rounded-2xl md:shadow-lg md:border md:border-[#E5E7EB] md:min-h-[840px]'
        }`}
        style={{ height: isDeviceFrame ? '92vh' : 'auto' }}
      >
        {/* iOS Dynamic Island & Status Bar Simulation */}
        <div className="bg-white shrink-0 pt-2 px-6 pb-1 border-b border-[#E5E7EB]/40 flex items-center justify-between text-xs font-semibold text-[#111827] select-none z-30">
          <span>09:41</span>
          {/* Dynamic Island pill */}
          <div className="hidden md:flex w-24 h-5 rounded-full bg-[#111827] items-center justify-end px-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]/80 mr-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#374151]" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <span className="text-[10px] mr-0.5">5G</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F6F7F9]">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="bg-white pt-1 pb-2 shrink-0 flex items-center justify-center select-none z-30">
          <div className="w-32 h-1 bg-[#111827]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
