import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  formatDate,
  maskPhoneNumber,
  calculateWaterTankMetrics,
  calculateLedgerTotals,
  calculateSubMeterCharges,
  UnitLedgerItem,
} from './formatters';

test('formatINR formats numbers into Indian numbering system correctly', () => {
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(500), '₹500');
  assert.equal(formatINR(12450), '₹12,450');
  assert.equal(formatINR(150000), '₹1,50,000');
  assert.equal(formatINR(2500000), '₹25,00,000');
});

test('formatDate converts dates to DD-MMM-YYYY format', () => {
  const d = new Date(2024, 9, 5); // Month index 9 is October
  assert.equal(formatDate(d), '05-OCT-2024');
});

test('maskPhoneNumber formats to +91 XXXXX 12345', () => {
  assert.equal(maskPhoneNumber('9845112345'), '+91 XXXXX 12345');
  assert.equal(maskPhoneNumber('+91 98451 12345'), '+91 XXXXX 12345');
});

test('calculateWaterTankMetrics returns correct percentage and thresholds', () => {
  // Critical (<20%)
  const critical = calculateWaterTankMetrics(1500, 10000);
  assert.equal(critical.percentage, 15);
  assert.equal(critical.statusLabel, 'Critical');
  assert.equal(critical.remainingLiters, 8500);

  // Adequate (45-95%)
  const adequate = calculateWaterTankMetrics(7800, 10000);
  assert.equal(adequate.percentage, 78);
  assert.equal(adequate.statusLabel, 'Adequate');
  assert.equal(adequate.remainingLiters, 2200);

  // Full (>=95%)
  const full = calculateWaterTankMetrics(9800, 10000);
  assert.equal(full.percentage, 98);
  assert.equal(full.statusLabel, 'Full');
});

test('calculateLedgerTotals computes expected, collected and counts', () => {
  const mockUnits: UnitLedgerItem[] = [
    {
      id: '1',
      flatNumber: '101',
      tenantName: 'Aarav Patel',
      ownerName: 'Sunil Rao',
      phone: '9845012345',
      rentAmount: 18000,
      maintenanceAmount: 2500,
      waterCharges: 450,
      amountPaid: 20950,
      status: 'paid',
      dueDate: '05-NOV-2026',
    },
    {
      id: '2',
      flatNumber: '102',
      tenantName: 'Sneha Reddy',
      ownerName: 'Vikas Sharma',
      phone: '9845023456',
      rentAmount: 20000,
      maintenanceAmount: 2500,
      waterCharges: 500,
      amountPaid: 0,
      status: 'overdue',
      dueDate: '01-NOV-2026',
    },
  ];

  const totals = calculateLedgerTotals(mockUnits);
  // Unit 1 total = 18000 + 2500 + 450 = 20950, paid = 20950
  // Unit 2 total = 20000 + 2500 + 500 = 23000, paid = 0
  assert.equal(totals.totalExpected, 43950);
  assert.equal(totals.totalCollected, 20950);
  assert.equal(totals.totalOutstanding, 23000);
  assert.equal(totals.paidUnitsCount, 1);
  assert.equal(totals.overdueUnitsCount, 1);
});

test('calculateSubMeterCharges computes consumption and billing correctly', () => {
  const result = calculateSubMeterCharges(142.5, 151.5, 50);
  assert.equal(result.consumptionKL, 9.0);
  assert.equal(result.totalCharge, 450);
  assert.equal(result.ratePerKL, 50);

  // Guard negative current reading
  const zeroResult = calculateSubMeterCharges(150, 140, 50);
  assert.equal(zeroResult.consumptionKL, 0);
  assert.equal(zeroResult.totalCharge, 0);
});
