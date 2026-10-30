import React, { useState } from 'react';
import {
  CreditCard,
  Droplet,
  Wrench,
  FileText,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ResidentUnit, WaterTank, NoticeCircular, UserRole } from '../types';
import { WaterLevelCard } from '../components/WaterLevelCard';
import { StatusChip } from '../components/StatusChip';
import { formatINR, calculateLedgerTotals } from '../utils/formatters';

interface OverviewScreenProps {
  units: ResidentUnit[];
  tanks: WaterTank[];
  notices: NoticeCircular[];
  currentRole: UserRole;
  onOpenPaymentModal: (unitId?: string) => void;
  onOpenWaterModal: () => void;
  onOpenTicketModal: () => void;
  onSelectUnitReceipt: (unit: ResidentUnit) => void;
  onNavigateTab: (tab: 'ledger' | 'utilities' | 'maintenance' | 'directory') => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  units,
  tanks,
  notices,
  currentRole,
  onOpenPaymentModal,
  onOpenWaterModal,
  onOpenTicketModal,
  onSelectUnitReceipt,
  onNavigateTab,
}) => {
  const totals = calculateLedgerTotals(units);
  const primaryTank = tanks[0] || {
    id: 't-1',
    name: 'Overhead Tank A',
    location: 'Rooftop Block A',
    currentLiters: 7800,
    capacityLiters: 10000,
    lastUpdated: '30-OCT-2026',
    supplySource: 'BWSSB Municipal' as const,
    pumpStatus: 'Idle' as const,
  };

  const pinnedNotice = notices.find((n) => n.isPinned) || notices[0];

  const [selectedTenantFlat, setSelectedTenantFlat] = useState('204');
  const tenantUnit = units.find((u) => u.flatNumber === selectedTenantFlat) || units[0];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Role Context Notification Bar */}
      {currentRole === 'tenant' ? (
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1D4ED8] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold text-[#1E3A8A]">Flat</h2>
                <select
                  value={selectedTenantFlat}
                  onChange={(e) => setSelectedTenantFlat(e.target.value)}
                  className="text-xs font-bold bg-white text-[#111827] px-2 py-0.5 rounded-lg border border-[#BFDBFE]"
                  aria-label="Select Resident Flat"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.flatNumber}>
                      {u.flatNumber} · {u.tenantName} ({u.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              <StatusChip status={tenantUnit.status} />
            </div>
            <p className="text-xs text-[#1D4ED8] mt-1">
              Monthly rent: {formatINR(tenantUnit.rentAmount)} · Maintenance: {formatINR(tenantUnit.maintenanceAmount)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {tenantUnit.status !== 'paid' ? (
                <button
                  onClick={() => onOpenPaymentModal(tenantUnit.id)}
                  type="button"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors"
                >
                  Pay Now via UPI
                </button>
              ) : (
                <button
                  onClick={() => onSelectUnitReceipt(tenantUnit)}
                  type="button"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors"
                >
                  View Settled Receipt
                </button>
              )}
              {tenantUnit.status !== 'paid' && (
                <button
                  onClick={() => onOpenPaymentModal(tenantUnit.id)}
                  type="button"
                  className="text-xs font-medium text-[#1E3A8A] underline"
                >
                  Other Payment Modes
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Water Utility Priority Indicator Card (Strictly adhering to design guidelines) */}
      <section aria-labelledby="water-indicator-heading">
        <div className="flex items-center justify-between mb-2">
          <h2 id="water-indicator-heading" className="text-base font-semibold text-[#111827]">
            Municipal & Tank Water
          </h2>
          <button
            onClick={() => onNavigateTab('utilities')}
            type="button"
            className="text-xs font-medium text-[#0F766E] hover:underline flex items-center gap-0.5"
          >
            <span>All 3 Tanks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <WaterLevelCard tank={primaryTank} onManage={onOpenWaterModal} />
      </section>

      {/* Municipal Water Timing Alert Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] flex items-center justify-between text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-[#111827] text-sm">BWSSB Supply Window</p>
            <p className="text-xs text-[#4B5563]">Today · 06:00 AM – 08:30 AM (Normal Pressure)</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
          On Schedule
        </span>
      </div>

      {/* Monthly Rent & Maintenance Ledger Card */}
      <section aria-labelledby="ledger-summary-heading">
        <div className="flex items-center justify-between mb-2">
          <h2 id="ledger-summary-heading" className="text-base font-semibold text-[#111827]">
            October 2026 Collection Roll
          </h2>
          <button
            onClick={() => onNavigateTab('ledger')}
            type="button"
            className="text-xs font-medium text-[#0F766E] hover:underline flex items-center gap-0.5"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                Total Realized
              </p>
              <p className="text-2xl font-bold text-[#111827] mt-0.5">
                {formatINR(totals.totalCollected)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                Outstanding
              </p>
              <p className="text-lg font-semibold text-[#B91C1C] mt-0.5">
                {formatINR(totals.totalOutstanding)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-[#4B5563] mb-1 font-medium">
              <span>Collection Target: {formatINR(totals.totalExpected)}</span>
              <span className="text-[#0F766E] font-semibold">{totals.collectionPercentage}%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F766E] h-full rounded-full transition-all duration-500"
                style={{ width: `${totals.collectionPercentage}%` }}
              />
            </div>
          </div>

          {/* Unit Status Breakdown Chips */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E7EB]">
            <div className="p-2 rounded-xl bg-[#DCFCE7]/60 text-center">
              <p className="text-xs text-[#166534] font-medium">Paid</p>
              <p className="text-base font-bold text-[#166534] mt-0.5">{totals.paidUnitsCount} Units</p>
            </div>
            <div className="p-2 rounded-xl bg-[#FEF3C7]/60 text-center">
              <p className="text-xs text-[#92400E] font-medium">Pending</p>
              <p className="text-base font-bold text-[#92400E] mt-0.5">{totals.pendingUnitsCount} Units</p>
            </div>
            <div className="p-2 rounded-xl bg-[#FEE2E2]/60 text-center">
              <p className="text-xs text-[#B91C1C] font-medium">Overdue</p>
              <p className="text-base font-bold text-[#B91C1C] mt-0.5">{totals.overdueUnitsCount} Units</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Matrix */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-base font-semibold text-[#111827] mb-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onOpenPaymentModal()}
            type="button"
            className="h-[52px] px-3 rounded-xl bg-[#0F766E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#115E59] active:bg-[#115E59] transition-colors shadow-xs"
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">Record Payment</span>
          </button>

          <button
            onClick={onOpenWaterModal}
            type="button"
            className="h-[52px] px-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors shadow-xs"
          >
            <Droplet className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <span className="truncate">Log Water / Tanker</span>
          </button>

          <button
            onClick={onOpenTicketModal}
            type="button"
            className="h-[52px] px-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors shadow-xs"
          >
            <Wrench className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span className="truncate">Log Maintenance</span>
          </button>

          <button
            onClick={() => onNavigateTab('ledger')}
            type="button"
            className="h-[52px] px-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-[#4B5563] shrink-0" />
            <span className="truncate">Ledger Roll</span>
          </button>
        </div>
      </section>

      {/* Pinned Circular / Notice */}
      {pinnedNotice && (
        <section aria-labelledby="pinned-notice-heading">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                Official Circular
              </span>
              <span className="text-xs text-[#4B5563]">{pinnedNotice.date}</span>
            </div>
            <h3 id="pinned-notice-heading" className="text-sm font-semibold text-[#111827] leading-snug">
              {pinnedNotice.title}
            </h3>
            <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
              {pinnedNotice.content}
            </p>
            <button
              onClick={() => onNavigateTab('directory')}
              type="button"
              className="mt-2 text-xs font-medium text-[#0F766E] hover:underline"
            >
              Read full circular & notices →
            </button>
          </div>
        </section>
      )}

      {/* Recent Ledger Rows */}
      <section aria-labelledby="recent-activity-heading">
        <div className="flex items-center justify-between mb-2">
          <h2 id="recent-activity-heading" className="text-base font-semibold text-[#111827]">
            Recent Ledger Activity
          </h2>
          <button
            onClick={() => onNavigateTab('ledger')}
            type="button"
            className="text-xs font-medium text-[#0F766E] hover:underline"
          >
            View all 12 units
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.05)] overflow-hidden">
          {units.slice(0, 4).map((unit) => {
            const totalDue = unit.rentAmount + unit.maintenanceAmount + unit.waterCharges;
            return (
              <div
                key={unit.id}
                onClick={() => (unit.status === 'paid' ? onSelectUnitReceipt(unit) : onOpenPaymentModal(unit.id))}
                className="p-3.5 hover:bg-[#F6F7F9] cursor-pointer flex items-center justify-between gap-3 min-h-[48px] transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    unit.status === 'paid' ? onSelectUnitReceipt(unit) : onOpenPaymentModal(unit.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] flex flex-col items-center justify-center font-bold text-xs text-[#111827] shrink-0">
                    <span className="text-[10px] text-[#4B5563] font-medium leading-none">FLAT</span>
                    <span className="leading-tight">{unit.flatNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] leading-snug">{unit.tenantName}</h3>
                    <p className="text-xs text-[#4B5563]">{unit.block} · Due: {unit.dueDate}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#111827]">{formatINR(totalDue)}</p>
                  <div className="mt-0.5">
                    <StatusChip status={unit.status} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
