import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Droplet, ShieldCheck, Wrench } from 'lucide-react';
import { PaymentStatus, TicketStatus } from '../types';

interface StatusChipProps {
  status: PaymentStatus | TicketStatus | 'Water' | 'Critical' | 'Adequate' | 'Verified' | 'Pending Verification';
  customLabel?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, customLabel, size = 'sm' }) => {
  let bg = '#DCFCE7';
  let text = '#166534';
  let label = customLabel || status;
  let Icon = CheckCircle2;

  switch (status) {
    case 'paid':
    case 'Completed':
    case 'Verified':
      bg = '#DCFCE7';
      text = '#166534';
      label = customLabel || (status === 'paid' ? 'Paid' : status);
      Icon = CheckCircle2;
      break;

    case 'pending':
    case 'partial':
    case 'Assigned':
    case 'Pending Verification':
      bg = '#FEF3C7';
      text = '#92400E';
      label = customLabel || (status === 'pending' ? 'Pending' : status === 'partial' ? 'Partial' : status);
      Icon = Clock;
      break;

    case 'overdue':
    case 'Critical':
      bg = '#FEE2E2';
      text = '#B91C1C';
      label = customLabel || (status === 'overdue' ? 'Overdue' : 'Critical');
      Icon = AlertTriangle;
      break;

    case 'Reported':
      bg = '#FEF3C7';
      text = '#92400E';
      label = customLabel || 'Reported';
      Icon = Wrench;
      break;

    case 'Verified Visit':
      bg = '#DCFCE7';
      text = '#166534';
      label = customLabel || 'Verified Visit';
      Icon = ShieldCheck;
      break;

    case 'Water':
    case 'Adequate':
    default:
      bg = '#DBEAFE';
      text = '#1D4ED8';
      label = customLabel || 'Water Utility';
      Icon = Droplet;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === 'sm' ? 'px-2.5 py-1 text-sm leading-5' : 'px-3 py-1.5 text-sm leading-5'
      }`}
      style={{ backgroundColor: bg, color: text }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </span>
  );
};
