import React from 'react';
import { X, CheckCircle, Printer, Share2, Building2 } from 'lucide-react';
import { ResidentUnit } from '../types';
import { formatINR, maskPhoneNumber } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: ResidentUnit | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  unit,
}) => {
  if (!isOpen || !unit) return null;

  const totalDue = unit.rentAmount + unit.maintenanceAmount + unit.waterCharges;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(17,24,39,0.40)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(17,24,39,0.12)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0 bg-[#F6F7F9]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#111827]">Payment Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-white transition-colors"
            aria-label="Close receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-sm">
          {/* Association header */}
          <div className="text-center pb-2.5 border-b border-[#E5E7EB]">
            <h2 id="receipt-modal-title" className="text-base font-bold text-[#111827] tracking-tight">
              NIVAAS RESIDENCY WELFARE ASSOCIATION
            </h2>
            <p className="text-[11px] text-[#4B5563] mt-0.5">Registration No. BLR/R-2490/2021</p>
            <p className="text-[11px] text-[#4B5563]">14th Cross, Indiranagar, Bengaluru - 560038</p>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#4B5563]">Receipt No: </span>
              <span className="font-semibold text-[#111827]">
                NR-REC-{unit.flatNumber}-{Math.abs(unit.amountPaid).toString().slice(0, 3)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#4B5563]">Date: </span>
              <span className="font-semibold text-[#111827]">{unit.lastPaymentDate || unit.dueDate}</span>
            </div>
          </div>

          {/* Resident Details */}
          <div className="p-3.5 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Unit / Flat:</span>
              <span className="font-semibold text-[#111827]">Flat {unit.flatNumber} ({unit.block})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Tenant / Occupant:</span>
              <span className="font-semibold text-[#111827]">{unit.tenantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Registered Mobile:</span>
              <span className="text-[#111827] font-mono">{maskPhoneNumber(unit.phone)}</span>
            </div>
          </div>

          {/* Ledger Breakdown Table */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F7F9] text-[#4B5563] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {unit.rentAmount > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">Monthly Rent</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatINR(unit.rentAmount)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2.5 px-3">Common Maintenance (Lifts, Security, Lighting)</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatINR(unit.maintenanceAmount)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Water Utility & Sub-meter Charges</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatINR(unit.waterCharges)}</td>
                </tr>
                <tr className="bg-[#F9F9FF] font-semibold text-sm">
                  <td className="py-2.5 px-3 text-[#111827]">Total Assessed</td>
                  <td className="py-2.5 px-3 text-right text-[#111827]">{formatINR(totalDue)}</td>
                </tr>
                <tr className="bg-[#DCFCE7] font-semibold text-sm">
                  <td className="py-2.5 px-3 text-[#166534]">Amount Paid & Realized</td>
                  <td className="py-2.5 px-3 text-right text-[#166534]">{formatINR(unit.amountPaid)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transaction Metadata */}
          <div className="text-xs text-[#4B5563] space-y-1">
            <div className="flex justify-between">
              <span>Mode of Payment:</span>
              <span className="font-semibold text-[#111827]">{unit.paymentMethod || 'UPI / Bank Transfer'}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Reference:</span>
              <span className="font-mono text-[#111827]">{unit.transactionRef || 'UPI/VERIFIED/NIVAAS'}</span>
            </div>
          </div>

          {/* Official Verification Stamp */}
          <div className="p-3 rounded-xl border border-dashed border-[#166534] bg-[#DCFCE7]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#166534]" />
              <div>
                <p className="text-xs font-bold text-[#166534] tracking-wide uppercase">PAYMENT VERIFIED</p>
                <p className="text-[11px] text-[#166534]">Authorized by Nivaas Resident Portal</p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-[#166534]">E-STAMPED</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F6F7F9] flex items-center gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            type="button"
            className="flex-1 h-[48px] rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] hover:bg-[#F6F7F9] flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#4B5563]" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            type="button"
            className="flex-1 h-[48px] rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] flex items-center justify-center gap-2"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
