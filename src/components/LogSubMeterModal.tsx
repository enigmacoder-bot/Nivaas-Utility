import React, { useState } from 'react';
import { X, Gauge, Calculator, CheckCircle } from 'lucide-react';
import { ResidentUnit, SubMeterReading } from '../types';
import { formatINR, formatDate, calculateSubMeterCharges } from '../utils/formatters';

interface LogSubMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: ResidentUnit[];
  subMeters: SubMeterReading[];
  onSaveReading: (reading: {
    flatNumber: string;
    tenantName: string;
    previousReadingKL: number;
    currentReadingKL: number;
    consumptionKL: number;
    ratePerKL: number;
    totalAmount: number;
    recordedDate: string;
  }) => void;
}

export const LogSubMeterModal: React.FC<LogSubMeterModalProps> = ({
  isOpen,
  onClose,
  units,
  subMeters,
  onSaveReading,
}) => {
  if (!isOpen) return null;

  const [selectedFlat, setSelectedFlat] = useState(units[0]?.flatNumber || '101');
  const existingRecord = subMeters.find((s) => s.flatNumber === selectedFlat);
  const matchedUnit = units.find((u) => u.flatNumber === selectedFlat);

  const previousKL = existingRecord ? existingRecord.currentReadingKL : 100.0;
  const [currentReading, setCurrentReading] = useState<string>((previousKL + 8.5).toFixed(1));
  const ratePerKL = 50;

  const numCurrent = parseFloat(currentReading) || previousKL;
  const calc = calculateSubMeterCharges(previousKL, numCurrent, ratePerKL);

  const handleFlatChange = (flat: string) => {
    setSelectedFlat(flat);
    const prev = subMeters.find((s) => s.flatNumber === flat)?.currentReadingKL || 100.0;
    setCurrentReading((prev + 8.0).toFixed(1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReading({
      flatNumber: selectedFlat,
      tenantName: matchedUnit?.tenantName || 'Resident',
      previousReadingKL: previousKL,
      currentReadingKL: numCurrent,
      consumptionKL: calc.consumptionKL,
      ratePerKL,
      totalAmount: calc.totalCharge,
      recordedDate: formatDate(new Date()),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(17,24,39,0.40)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submeter-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#E5E7EB] shadow-[0_-4px_16px_rgba(17,24,39,0.08)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 id="submeter-modal-title" className="text-lg font-semibold text-[#111827]">
              Log Sub-Meter Reading
            </h2>
            <p className="text-sm text-[#4B5563]">Assess individual unit water consumption</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F6F7F9] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Select Flat */}
          <div>
            <label htmlFor="flat-select" className="block text-sm font-medium text-[#111827] mb-1.5">
              Select Flat / Unit
            </label>
            <select
              id="flat-select"
              value={selectedFlat}
              onChange={(e) => handleFlatChange(e.target.value)}
              className="w-full h-[52px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
            >
              {units.map((u) => (
                <option key={u.id} value={u.flatNumber}>
                  Flat {u.flatNumber} · {u.tenantName} ({u.block})
                </option>
              ))}
            </select>
          </div>

          {/* Previous Reading Info */}
          <div className="p-3.5 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] flex items-center justify-between text-sm">
            <div>
              <span className="text-xs text-[#4B5563]">Last Recorded Reading:</span>
              <p className="text-base font-semibold text-[#111827] mt-0.5">{previousKL} KL</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#4B5563]">Unit Rate:</span>
              <p className="text-sm font-medium text-[#0F766E] mt-0.5">₹50 / KL</p>
            </div>
          </div>

          {/* Current Reading Input */}
          <div>
            <label htmlFor="current-reading" className="block text-sm font-medium text-[#111827] mb-1.5">
              New Current Meter Reading (KL)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
                <Gauge className="w-4 h-4" />
              </div>
              <input
                id="current-reading"
                type="number"
                step="0.1"
                min={previousKL}
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                className="w-full h-[52px] pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors font-semibold"
                required
              />
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="p-4 rounded-xl bg-[#DBEAFE]/40 border border-[#DBEAFE] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#1E3A8A]">
              <span>Units Consumed:</span>
              <span className="font-semibold text-sm">{calc.consumptionKL} Kiloliters (KL)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#1E3A8A] pt-1 border-t border-[#DBEAFE]">
              <span className="font-medium">Total Assessed Water Charge:</span>
              <span className="text-base font-bold text-[#1D4ED8]">{formatINR(calc.totalCharge)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-[#F6F7F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[48px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Update Dues</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
