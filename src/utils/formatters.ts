/**
 * Formatting and calculation utilities for Nivaas Utility System.
 * Enforces Indian currency notation, DD-MMM-YYYY dates, and masked Indian mobile numbers.
 */

export interface UnitLedgerItem {
  id: string;
  flatNumber: string;
  tenantName: string;
  ownerName: string;
  phone: string;
  rentAmount: number;
  maintenanceAmount: number;
  waterCharges: number;
  amountPaid: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  dueDate: string; // DD-MMM-YYYY
  paymentMethod?: 'UPI' | 'NEFT' | 'Cash' | 'Cheque';
  lastPaymentDate?: string;
  transactionRef?: string;
}

/**
 * Format numbers into Indian Rupee notation (e.g. 150000 -> "₹1,50,000", 12450 -> "₹12,450")
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const s = absAmount.toString();
  
  if (s.length <= 3) {
    return (isNegative ? '-₹' : '₹') + s;
  }
  
  const lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return (isNegative ? '-₹' : '₹') + formattedOther + ',' + lastThree;
}

/**
 * Format date into DD-MMM-YYYY (e.g. 05-OCT-2024)
 */
export function formatDate(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return '01-JAN-2026';
  }
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Mask mobile numbers to Indian format (+91 XXXXX 12345)
 */
export function maskPhoneNumber(phone: string): string {
  // Extract digits
  const cleaned = phone.replace(/\D/g, '');
  const digits = cleaned.length >= 10 ? cleaned.slice(-10) : cleaned.padStart(10, '0');
  const lastFive = digits.slice(-5);
  return `+91 XXXXX ${lastFive}`;
}

export interface WaterMetricResult {
  percentage: number;
  remainingLiters: number;
  statusLabel: 'Critical' | 'Low' | 'Adequate' | 'Full';
  badgeStyle: {
    bg: string;
    text: string;
  };
}

/**
 * Calculate water tank metrics
 */
export function calculateWaterTankMetrics(
  currentLiters: number,
  capacityLiters: number
): WaterMetricResult {
  const clampedCurrent = Math.max(0, Math.min(currentLiters, capacityLiters));
  const percentage = capacityLiters > 0 ? Math.round((clampedCurrent / capacityLiters) * 100) : 0;
  const remainingLiters = Math.max(0, capacityLiters - clampedCurrent);

  let statusLabel: 'Critical' | 'Low' | 'Adequate' | 'Full';
  let badgeStyle = { bg: '#DBEAFE', text: '#1D4ED8' }; // Default water utility

  if (percentage <= 20) {
    statusLabel = 'Critical';
    badgeStyle = { bg: '#FEE2E2', text: '#B91C1C' }; // Destructive
  } else if (percentage <= 45) {
    statusLabel = 'Low';
    badgeStyle = { bg: '#FEF3C7', text: '#92400E' }; // Warning
  } else if (percentage >= 95) {
    statusLabel = 'Full';
    badgeStyle = { bg: '#DCFCE7', text: '#166534' }; // Success
  } else {
    statusLabel = 'Adequate';
    badgeStyle = { bg: '#DBEAFE', text: '#1D4ED8' }; // Water utility
  }

  return {
    percentage,
    remainingLiters,
    statusLabel,
    badgeStyle,
  };
}

export interface LedgerTotals {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionPercentage: number;
  paidUnitsCount: number;
  pendingUnitsCount: number;
  overdueUnitsCount: number;
  partialUnitsCount: number;
}

/**
 * Calculate totals and breakdown for rent and maintenance ledger
 */
export function calculateLedgerTotals(units: UnitLedgerItem[]): LedgerTotals {
  let totalExpected = 0;
  let totalCollected = 0;
  let paidUnitsCount = 0;
  let pendingUnitsCount = 0;
  let overdueUnitsCount = 0;
  let partialUnitsCount = 0;

  for (const unit of units) {
    const dueForUnit = unit.rentAmount + unit.maintenanceAmount + unit.waterCharges;
    totalExpected += dueForUnit;
    totalCollected += unit.amountPaid;

    if (unit.status === 'paid') paidUnitsCount++;
    else if (unit.status === 'pending') pendingUnitsCount++;
    else if (unit.status === 'overdue') overdueUnitsCount++;
    else if (unit.status === 'partial') partialUnitsCount++;
  }

  const totalOutstanding = Math.max(0, totalExpected - totalCollected);
  const collectionPercentage =
    totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  return {
    totalExpected,
    totalCollected,
    totalOutstanding,
    collectionPercentage,
    paidUnitsCount,
    pendingUnitsCount,
    overdueUnitsCount,
    partialUnitsCount,
  };
}

export interface SubMeterCalculationResult {
  consumptionKL: number;
  totalCharge: number;
  ratePerKL: number;
}

/**
 * Calculate water sub-meter consumption and charges
 */
export function calculateSubMeterCharges(
  previousKL: number,
  currentKL: number,
  ratePerKL: number = 50
): SubMeterCalculationResult {
  const consumptionKL = Math.max(0, +(currentKL - previousKL).toFixed(2));
  const totalCharge = Math.round(consumptionKL * ratePerKL);

  return {
    consumptionKL,
    totalCharge,
    ratePerKL,
  };
}
