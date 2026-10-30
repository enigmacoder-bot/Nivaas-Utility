export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface ResidentUnit {
  id: string;
  flatNumber: string;
  floor: number;
  block: string;
  tenantName: string;
  ownerName: string;
  phone: string;
  intercom: string;
  parkingSlot: string;
  rentAmount: number;
  maintenanceAmount: number;
  waterCharges: number;
  amountPaid: number;
  status: PaymentStatus;
  dueDate: string; // DD-MMM-YYYY
  lastPaymentDate?: string; // DD-MMM-YYYY
  paymentMethod?: 'UPI' | 'NEFT' | 'Cash' | 'Cheque';
  transactionRef?: string;
}

export interface WaterTank {
  id: string;
  name: string;
  location: string;
  currentLiters: number;
  capacityLiters: number;
  lastUpdated: string;
  supplySource: 'BWSSB Municipal' | 'Borewell #1' | 'Water Tanker';
  pumpStatus: 'Active' | 'Idle' | 'Cutoff Armed';
}

export interface SubMeterReading {
  id: string;
  flatNumber: string;
  tenantName: string;
  previousReadingKL: number;
  currentReadingKL: number;
  consumptionKL: number;
  ratePerKL: number;
  totalAmount: number;
  recordedDate: string;
}

export interface TankerDelivery {
  id: string;
  vendorName: string;
  volumeLiters: number;
  cost: number;
  deliveryDate: string;
  deliveryTime: string;
  status: 'Verified' | 'Pending Verification';
  driverPhone: string;
  receiptNumber: string;
}

export type TicketCategory = 'Plumbing' | 'Electrical' | 'Elevator' | 'Water' | 'Cleaning' | 'Security';
export type TicketPriority = 'Normal' | 'High' | 'Urgent';
export type TicketStatus = 'Reported' | 'Assigned' | 'Verified Visit' | 'Completed';

export interface MaintenanceTicket {
  id: string;
  title: string;
  category: TicketCategory;
  location: string;
  reportedBy: string;
  reportedDate: string; // DD-MMM-YYYY
  priority: TicketPriority;
  status: TicketStatus;
  assignedTechnician?: string;
  technicianPhone?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface NoticeCircular {
  id: string;
  title: string;
  tag: 'Water Schedule' | 'Maintenance' | 'General' | 'Urgent';
  date: string; // DD-MMM-YYYY
  content: string;
  issuedBy: string;
  isPinned: boolean;
}

export type ActiveTab = 'overview' | 'ledger' | 'utilities' | 'maintenance' | 'directory';
export type UserRole = 'manager' | 'tenant';
