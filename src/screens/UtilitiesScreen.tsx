import React from 'react';
import { Droplet, Plus, Truck, Clock, Gauge, ArrowUpRight } from 'lucide-react';
import { WaterTank, SubMeterReading, TankerDelivery } from '../types';
import { WaterLevelCard } from '../components/WaterLevelCard';
import { StatusChip } from '../components/StatusChip';
import { formatINR } from '../utils/formatters';

interface UtilitiesScreenProps {
  tanks: WaterTank[];
  subMeters: SubMeterReading[];
  tankerLogs: TankerDelivery[];
  onOpenWaterModal: () => void;
  onOpenSubMeterModal: () => void;
}

export const UtilitiesScreen: React.FC<UtilitiesScreenProps> = ({
  tanks,
  subMeters,
  tankerLogs,
  onOpenWaterModal,
  onOpenSubMeterModal,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111827]">Water & Utilities</h2>
          <p className="text-xs text-[#4B5563]">Storage tanks, municipal supply & sub-meters</p>
        </div>
        <button
          onClick={onOpenWaterModal}
          type="button"
          className="h-10 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#115E59] active:bg-[#115E59] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Update / Log</span>
        </button>
      </div>

      {/* Storage Tanks Section */}
      <section aria-labelledby="tanks-heading">
        <h3 id="tanks-heading" className="text-sm font-semibold text-[#111827] uppercase tracking-wider mb-2.5">
          Overhead & Sump Storage
        </h3>
        <div className="space-y-3">
          {tanks.map((tank) => (
            <WaterLevelCard
              key={tank.id}
              tank={tank}
              onManage={onOpenWaterModal}
              showManageButton={true}
            />
          ))}
        </div>
      </section>

      {/* Municipal Supply Schedule Card */}
      <section aria-labelledby="municipal-heading">
        <h3 id="municipal-heading" className="text-sm font-semibold text-[#111827] uppercase tracking-wider mb-2.5">
          BWSSB Municipal Supply Schedule
        </h3>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1D4ED8]">
              Alternate Days
            </span>
            <span className="text-xs text-[#4B5563]">Pressure: 2.4 Bar (Normal)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F6F7F9]">
              <span className="text-[#4B5563]">Morning Batch:</span>
              <p className="text-sm font-semibold text-[#111827] mt-0.5">06:00 AM – 08:30 AM</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F6F7F9]">
              <span className="text-[#4B5563]">Evening Batch:</span>
              <p className="text-sm font-semibold text-[#111827] mt-0.5">05:30 PM – 07:00 PM</p>
            </div>
          </div>

          <p className="text-xs text-[#4B5563] pt-1 border-t border-[#E5E7EB]">
            Automation Note: Sump fill pump auto-cuts off when storage reaches 95% capacity.
          </p>
        </div>
      </section>

      {/* Commercial Water Tanker Delivery Log */}
      <section aria-labelledby="tanker-heading">
        <div className="flex items-center justify-between mb-2">
          <h3 id="tanker-heading" className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
            Water Tanker Logs
          </h3>
          <span className="text-xs text-[#4B5563] font-medium">{tankerLogs.length} Deliveries</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.05)] overflow-hidden">
          {tankerLogs.map((log) => (
            <div key={log.id} className="p-3.5 flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">{log.vendorName}</h4>
                  <p className="text-xs text-[#4B5563]">
                    {log.deliveryDate} at {log.deliveryTime} · Challan: {log.receiptNumber}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#111827]">{log.volumeLiters.toLocaleString('en-IN')}L</p>
                <p className="text-xs font-medium text-[#166534]">{formatINR(log.cost)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flat-wise Sub-meter Telemetry */}
      <section aria-labelledby="submeter-heading">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 id="submeter-heading" className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
              Flat Sub-Meter Readings
            </h3>
            <span className="text-xs text-[#4B5563]">Rate: ₹50 / KL</span>
          </div>
          <button
            onClick={onOpenSubMeterModal}
            type="button"
            className="h-8 px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0F766E] hover:bg-[#F6F7F9] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Meter</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.05)] overflow-hidden">
          {subMeters.map((sm) => (
            <div key={sm.id} className="p-3.5 flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F6F7F9] border border-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#111827] shrink-0">
                  {sm.flatNumber}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{sm.tenantName}</p>
                  <p className="text-xs text-[#4B5563]">
                    Readings: {sm.previousReadingKL} → {sm.currentReadingKL} KL
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[#111827]">{sm.consumptionKL} KL</p>
                <p className="text-xs font-bold text-[#1D4ED8]">{formatINR(sm.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
