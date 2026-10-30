import React, { useState } from 'react';
import { X, QrCode, CheckCircle, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';
import { ResidentUnit } from '../types';
import { formatINR, formatDate } from '../utils/formatters';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: ResidentUnit;
  onConfirmUpiPayment: (amount: number, txRef: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  unit,
  onConfirmUpiPayment,
}) => {
  if (!isOpen) return null;

  const totalOutstanding = Math.max(
    0,
    unit.rentAmount + unit.maintenanceAmount + unit.waterCharges - unit.amountPaid
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const upiId = 'nivaas.residency@okhdfcbank';

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txRef = `UPI/${Math.floor(630000000 + Math.random() * 90000000)}/HDFC`;
      onConfirmUpiPayment(totalOutstanding, txRef);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(17,24,39,0.50)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#E5E7EB] shadow-[0_-4px_24px_rgba(17,24,39,0.12)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0 bg-[#F6F7F9]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#0F766E]" />
            <div>
              <h2 id="upi-modal-title" className="text-base font-semibold text-[#111827]">
                Pay via UPI / Bharat QR
              </h2>
              <p className="text-xs text-[#4B5563]">Instant zero-fee settlement for Flat {unit.flatNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-center">
          {/* Amount Due Display */}
          <div className="p-3.5 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB]">
            <span className="text-xs text-[#4B5563] uppercase font-medium tracking-wider">
              Total Amount Payable
            </span>
            <p className="text-2xl font-bold text-[#111827] mt-0.5">
              {formatINR(totalOutstanding)}
            </p>
            <p className="text-xs text-[#166534] font-medium mt-0.5">
              Includes Rent + Maintenance + Water Utility
            </p>
          </div>

          {/* Simulated QR Code Canvas/SVG */}
          <div className="mx-auto w-48 h-48 p-3 rounded-2xl bg-white border-2 border-[#0F766E] flex flex-col items-center justify-center relative shadow-xs">
            <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-[#F9F9FF] rounded-lg">
              {/* Decorative QR code blocks */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xs ${
                    i === 0 || i === 5 || i === 30 || (i % 2 === 0 && i % 3 === 0) || i % 7 === 1
                      ? 'bg-[#141B2B]'
                      : 'bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-2 py-0.5 bg-white border border-[#E5E7EB] rounded-md text-[10px] font-bold text-[#0F766E] shadow-xs">
                BHARAT QR
              </span>
            </div>
          </div>

          {/* VPA Info */}
          <div className="text-xs text-[#4B5563] space-y-1">
            <p className="font-mono text-[#111827] font-semibold">{upiId}</p>
            <p className="text-[11px] text-[#6E7977]">Scan using Google Pay, PhonePe, Paytm, or CRED</p>
          </div>

          {/* Supported UPI Apps Pills */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
              <div
                key={app}
                className="py-1.5 px-2 rounded-lg bg-[#F6F7F9] border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
              >
                {app}
              </div>
            ))}
          </div>

          {/* Security guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#166534]">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Bank Grade Encrypted UPI Payment</span>
          </div>

          {/* Action button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full h-[52px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:bg-[#115E59] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing UPI Payment...</span>
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Simulate Instant UPI Settlement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
