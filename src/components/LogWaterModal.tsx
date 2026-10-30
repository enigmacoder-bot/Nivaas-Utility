import React, { useState } from 'react';
import { X, Droplet, Truck, IndianRupee } from 'lucide-react';
import { WaterTank, TankerDelivery } from '../types';
import { formatDate } from '../utils/formatters';

interface LogWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tanks: WaterTank[];
  onUpdateTankLevel: (tankId: string, newLiters: number) => void;
  onAddTankerDelivery: (delivery: Omit<TankerDelivery, 'id'>) => void;
}

export const LogWaterModal: React.FC<LogWaterModalProps> = ({
  isOpen,
  onClose,
  tanks,
  onUpdateTankLevel,
  onAddTankerDelivery,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'updateTank' | 'logTanker'>('updateTank');
  const [selectedTankId, setSelectedTankId] = useState<string>(tanks[0]?.id || '');
  const activeTank = tanks.find((t) => t.id === selectedTankId) || tanks[0];

  const [tankLiters, setTankLiters] = useState<string>(
    activeTank ? activeTank.currentLiters.toString() : '8000'
  );

  // Tanker fields
  const [vendorName, setVendorName] = useState('Sri Balaji Water Suppliers');
  const [volumeLiters, setVolumeLiters] = useState('6000');
  const [cost, setCost] = useState('1200');
  const [driverPhone, setDriverPhone] = useState('9880199201');
  const [receiptNumber, setReceiptNumber] = useState(`BW-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleTankChange = (id: string) => {
    setSelectedTankId(id);
    const t = tanks.find((tank) => tank.id === id);
    if (t) {
      setTankLiters(t.currentLiters.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'updateTank') {
      const liters = parseInt(tankLiters, 10);
      if (!isNaN(liters) && selectedTankId) {
        onUpdateTankLevel(selectedTankId, liters);
      }
    } else {
      onAddTankerDelivery({
        vendorName: vendorName.trim(),
        volumeLiters: parseInt(volumeLiters, 10) || 6000,
        cost: parseInt(cost, 10) || 1200,
        deliveryDate: formatDate(new Date()),
        deliveryTime: '09:30 AM',
        status: 'Verified',
        driverPhone: driverPhone.trim(),
        receiptNumber: receiptNumber.trim(),
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(17,24,39,0.40)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="water-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#E5E7EB] shadow-[0_-4px_16px_rgba(17,24,39,0.08)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 id="water-modal-title" className="text-lg font-semibold text-[#111827]">
              {mode === 'updateTank' ? 'Update Water Tank Level' : 'Log Water Tanker Delivery'}
            </h2>
            <p className="text-sm text-[#4B5563]">Maintain residential water storage records</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F6F7F9] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 p-1 bg-[#F6F7F9] rounded-xl border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setMode('updateTank')}
              className={`h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'updateTank' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              <Droplet className="w-4 h-4 text-[#1D4ED8]" />
              <span>Tank Reading</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('logTanker')}
              className={`h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'logTanker' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#0F766E]" />
              <span>Log Tanker</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {mode === 'updateTank' ? (
            <>
              {/* Select Tank */}
              <div>
                <label htmlFor="tank-select" className="block text-sm font-medium text-[#111827] mb-1.5">
                  Select Water Storage
                </label>
                <select
                  id="tank-select"
                  value={selectedTankId}
                  onChange={(e) => handleTankChange(e.target.value)}
                  className="w-full h-[52px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Capacity: {t.capacityLiters.toLocaleString('en-IN')}L)
                    </option>
                  ))}
                </select>
              </div>

              {/* Liters Input */}
              <div>
                <label htmlFor="liters-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                  Current Water Volume (Liters)
                </label>
                <div className="relative">
                  <input
                    id="liters-input"
                    type="number"
                    min="0"
                    max={activeTank ? activeTank.capacityLiters : 20000}
                    value={tankLiters}
                    onChange={(e) => setTankLiters(e.target.value)}
                    className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors font-medium"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sm text-[#4B5563]">
                    of {activeTank?.capacityLiters.toLocaleString('en-IN')}L
                  </div>
                </div>
              </div>

              {/* Quick Fill Buttons */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Quick Set
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => {
                    const liters = activeTank ? Math.round((activeTank.capacityLiters * pct) / 100) : 0;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTankLiters(liters.toString())}
                        className="h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-[#F6F7F9]"
                      >
                        {pct}%
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Vendor Name */}
              <div>
                <label htmlFor="vendor-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                  Tanker Vendor Name
                </label>
                <input
                  id="vendor-input"
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                  required
                />
              </div>

              {/* Volume and Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vol-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                    Volume (Liters)
                  </label>
                  <input
                    id="vol-input"
                    type="number"
                    value={volumeLiters}
                    onChange={(e) => setVolumeLiters(e.target.value)}
                    className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cost-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                    Cost (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <input
                      id="cost-input"
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full h-[52px] pl-9 pr-3 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Driver Phone & Receipt */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                    Driver Phone
                  </label>
                  <input
                    id="phone-input"
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                    placeholder="9880199201"
                  />
                </div>
                <div>
                  <label htmlFor="bill-input" className="block text-sm font-medium text-[#111827] mb-1.5">
                    Challan / Bill #
                  </label>
                  <input
                    id="bill-input"
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[52px] rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-[#F6F7F9] active:bg-[#E5E7EB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[52px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:bg-[#115E59] text-white text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Droplet className="w-4 h-4" />
              <span>{mode === 'updateTank' ? 'Save Tank Level' : 'Verify & Log Tanker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
