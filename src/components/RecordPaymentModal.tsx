import React, { useState } from 'react';
import { X, CheckCircle, IndianRupee, CreditCard, Calendar, Hash } from 'lucide-react';
import { ResidentUnit } from '../types';
import { formatINR, formatDate } from '../utils/formatters';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: ResidentUnit[];
  initialSelectedUnitId?: string;
  onRecordPayment: (
    unitId: string,
    amount: number,
    method: 'UPI' | 'NEFT' | 'Cash' | 'Cheque',
    ref: string,
    date: string
  ) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  units,
  initialSelectedUnitId,
  onRecordPayment,
}) => {
  if (!isOpen) return null;

  // Prefer first pending/overdue unit if none specified
  const firstPending = units.find((u) => u.status !== 'paid');
  const [selectedUnitId, setSelectedUnitId] = useState(
    initialSelectedUnitId || firstPending?.id || units[0]?.id || ''
  );
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  const totalOutstanding = selectedUnit
    ? Math.max(
        0,
        selectedUnit.rentAmount +
          selectedUnit.maintenanceAmount +
          selectedUnit.waterCharges -
          selectedUnit.amountPaid
      )
    : 0;

  const [amount, setAmount] = useState<string>(
    totalOutstanding > 0 ? totalOutstanding.toString() : '20000'
  );
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NEFT' | 'Cash' | 'Cheque'>('UPI');
  const [reference, setReference] = useState<string>(`UPI/${Math.floor(100000000 + Math.random() * 900000000)}/HDFC`);
  const [paymentDate, setPaymentDate] = useState<string>(formatDate(new Date()));
  const [error, setError] = useState<string>('');

  const handleUnitChange = (id: string) => {
    setSelectedUnitId(id);
    const unit = units.find((u) => u.id === id);
    if (unit) {
      const pending = Math.max(
        0,
        unit.rentAmount + unit.maintenanceAmount + unit.waterCharges - unit.amountPaid
      );
      setAmount(pending > 0 ? pending.toString() : (unit.rentAmount + unit.maintenanceAmount).toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid payment amount greater than ₹0');
      return;
    }
    setError('');
    onRecordPayment(selectedUnitId, numAmount, paymentMethod, reference.trim(), paymentDate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(17,24,39,0.40)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-payment-title"
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#E5E7EB] shadow-[0_-4px_16px_rgba(17,24,39,0.08)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 id="record-payment-title" className="text-lg font-semibold text-[#111827]">
              Record Payment
            </h2>
            <p className="text-sm text-[#4B5563]">Log rent, maintenance, or water dues</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F6F7F9] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#B91C1C] text-sm font-medium">
              {error}
            </div>
          )}

          {/* Unit Selector */}
          <div>
            <label htmlFor="unit-select" className="block text-sm font-medium text-[#111827] mb-1.5">
              Select Flat / Unit
            </label>
            <div className="relative">
              <select
                id="unit-select"
                value={selectedUnitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="w-full h-[52px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    Flat {unit.flatNumber} · {unit.tenantName} ({unit.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Info Card */}
          {selectedUnit && (
            <div className="p-3 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] text-sm flex items-center justify-between">
              <div>
                <span className="text-[#4B5563]">Current Balance Due:</span>
                <span className="ml-2 font-semibold text-[#111827]">
                  {formatINR(totalOutstanding)}
                </span>
              </div>
              <span className="text-xs text-[#0F766E] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Due: {selectedUnit.dueDate}
              </span>
            </div>
          )}

          {/* Amount Field */}
          <div>
            <label htmlFor="amount-input" className="block text-sm font-medium text-[#111827] mb-1.5">
              Payment Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                id="amount-input"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-[52px] pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors font-medium"
                placeholder="20000"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['UPI', 'NEFT', 'Cash', 'Cheque'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`h-11 rounded-xl text-sm font-medium border flex items-center justify-center transition-all ${
                    paymentMethod === method
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F6F7F9]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Reference */}
          <div>
            <label htmlFor="ref-input" className="block text-sm font-medium text-[#111827] mb-1.5">
              Transaction Ref / UTR / Receipt #
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
                <Hash className="w-4 h-4" />
              </div>
              <input
                id="ref-input"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full h-[52px] pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                placeholder="UPI/123456789/BANK"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label htmlFor="date-input" className="block text-sm font-medium text-[#111827] mb-1.5">
              Payment Date (DD-MMM-YYYY)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="date-input"
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full h-[52px] pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                placeholder="30-OCT-2026"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 sticky bottom-0 bg-white border-t border-[#E5E7EB] -mx-5 px-5 -mb-5 pb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[48px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:bg-[#115E59] text-white text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Record & Settle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
