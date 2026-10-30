import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, CheckCircle2, AlertTriangle, Phone, IndianRupee } from 'lucide-react';
import { ResidentUnit, PaymentStatus } from '../types';
import { StatusChip } from '../components/StatusChip';
import { formatINR, maskPhoneNumber, calculateLedgerTotals } from '../utils/formatters';

interface LedgerScreenProps {
  units: ResidentUnit[];
  onOpenPaymentModal: (unitId?: string) => void;
  onSelectUnitReceipt: (unit: ResidentUnit) => void;
}

export const LedgerScreen: React.FC<LedgerScreenProps> = ({
  units,
  onOpenPaymentModal,
  onSelectUnitReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');

  const totals = calculateLedgerTotals(units);

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.block.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ? true : u.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Flat', 'Block', 'Tenant', 'Owner', 'Phone', 'Rent', 'Maintenance', 'Water', 'Total Due', 'Amount Paid', 'Status', 'Due Date'];
    const rows = units.map((u) => [
      u.flatNumber,
      `"${u.block}"`,
      `"${u.tenantName}"`,
      `"${u.ownerName}"`,
      u.phone,
      u.rentAmount,
      u.maintenanceAmount,
      u.waterCharges,
      u.rentAmount + u.maintenanceAmount + u.waterCharges,
      u.amountPaid,
      u.status,
      u.dueDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nivaas_Ledger_Roll_OCT_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Rent & Maintenance Roll</h2>
            <p className="text-xs text-[#4B5563]">Billing cycle: October 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              type="button"
              className="h-10 px-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F6F7F9] transition-colors"
              title="Download Ledger Statement CSV"
            >
              Export CSV
            </button>
            <button
              onClick={() => onOpenPaymentModal()}
              type="button"
              className="h-10 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#115E59] active:bg-[#115E59] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#E5E7EB] text-sm">
          <div>
            <span className="text-[#4B5563] text-xs">Collected to Date:</span>
            <p className="text-lg font-bold text-[#166534] mt-0.5">{formatINR(totals.totalCollected)}</p>
          </div>
          <div className="text-right">
            <span className="text-[#4B5563] text-xs">Outstanding Dues:</span>
            <p className="text-lg font-bold text-[#B91C1C] mt-0.5">{formatINR(totals.totalOutstanding)}</p>
          </div>
        </div>
      </div>

      {/* Search Input (52px height, 12px radius, persistent label) */}
      <div>
        <label htmlFor="ledger-search" className="block text-sm font-medium text-[#111827] mb-1.5">
          Search Residents & Flats
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="ledger-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
            placeholder="Search by flat (e.g. 204), tenant, or owner..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${units.length})` },
          { id: 'paid', label: `Paid (${totals.paidUnitsCount})` },
          { id: 'pending', label: `Pending (${totals.pendingUnitsCount})` },
          { id: 'overdue', label: `Overdue (${totals.overdueUnitsCount})` },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F6F7F9]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Units List */}
      <div className="space-y-3">
        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-[#92400E] mx-auto mb-2" />
            <h3 className="text-base font-semibold text-[#111827]">No units match search</h3>
            <p className="text-xs text-[#4B5563] mt-1">Try clearing your filters or search term</p>
          </div>
        ) : (
          filteredUnits.map((unit) => {
            const totalDue = unit.rentAmount + unit.maintenanceAmount + unit.waterCharges;
            const balancePending = Math.max(0, totalDue - unit.amountPaid);
            const isSettled = unit.status === 'paid';

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] transition-all"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] flex flex-col items-center justify-center font-bold text-xs text-[#111827] shrink-0">
                      <span className="text-[10px] text-[#4B5563] font-medium leading-none">FLAT</span>
                      <span>{unit.flatNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#111827] leading-tight">
                        {unit.tenantName}
                      </h3>
                      <p className="text-xs text-[#4B5563] leading-normal mt-0.5">
                        {unit.block} · Owner: {unit.ownerName}
                      </p>
                    </div>
                  </div>

                  <StatusChip status={unit.status} size="sm" />
                </div>

                {/* Masked mobile and due date */}
                <div className="flex items-center justify-between text-xs text-[#4B5563] py-2 border-y border-[#E5E7EB]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#6E7977]" />
                    <span>{maskPhoneNumber(unit.phone)}</span>
                  </div>
                  <span>Due: {unit.dueDate}</span>
                </div>

                {/* Financial breakdown */}
                <div className="grid grid-cols-3 gap-2 my-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-[#F6F7F9]">
                    <span className="text-[#4B5563]">Rent:</span>
                    <p className="font-semibold text-[#111827]">{formatINR(unit.rentAmount)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F6F7F9]">
                    <span className="text-[#4B5563]">Maint:</span>
                    <p className="font-semibold text-[#111827]">{formatINR(unit.maintenanceAmount)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F6F7F9]">
                    <span className="text-[#4B5563]">Water:</span>
                    <p className="font-semibold text-[#111827]">{formatINR(unit.waterCharges)}</p>
                  </div>
                </div>

                {/* Footer action row */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-[#4B5563]">Total Assessed: </span>
                    <span className="text-sm font-bold text-[#111827]">{formatINR(totalDue)}</span>
                    {balancePending > 0 && (
                      <span className="text-xs text-[#B91C1C] ml-1.5 font-medium">
                        (₹{balancePending.toLocaleString('en-IN')} pending)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isSettled ? (
                      <button
                        onClick={() => onSelectUnitReceipt(unit)}
                        type="button"
                        className="h-9 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F6F7F9] flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPaymentModal(unit.id)}
                        type="button"
                        className="h-9 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Settle</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
