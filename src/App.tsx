import React, { useState } from 'react';
import {
  ActiveTab,
  UserRole,
  ResidentUnit,
  WaterTank,
  SubMeterReading,
  TankerDelivery,
  MaintenanceTicket,
  NoticeCircular,
  TicketStatus,
} from './types';
import {
  INITIAL_UNITS,
  INITIAL_TANKS,
  INITIAL_SUB_METERS,
  INITIAL_TANKER_LOGS,
  INITIAL_TICKETS,
  INITIAL_NOTICES,
} from './mockData';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { OverviewScreen } from './screens/OverviewScreen';
import { LedgerScreen } from './screens/LedgerScreen';
import { UtilitiesScreen } from './screens/UtilitiesScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { NewTicketModal } from './components/NewTicketModal';
import { LogWaterModal } from './components/LogWaterModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ExpoCodeViewerModal } from './components/ExpoCodeViewerModal';
import { LogSubMeterModal } from './components/LogSubMeterModal';
import { UpiPaymentModal } from './components/UpiPaymentModal';
import { formatDate } from './utils/formatters';

export default function App() {
  // Main Data States
  const [units, setUnits] = useState<ResidentUnit[]>(INITIAL_UNITS);
  const [tanks, setTanks] = useState<WaterTank[]>(INITIAL_TANKS);
  const [subMeters, setSubMeters] = useState<SubMeterReading[]>(INITIAL_SUB_METERS);
  const [tankerLogs, setTankerLogs] = useState<TankerDelivery[]>(INITIAL_TANKER_LOGS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [notices, setNotices] = useState<NoticeCircular[]>(INITIAL_NOTICES);

  // App Shell Navigation & Role State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('manager');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  // Modals & Sheets
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSelectedUnitId, setPaymentSelectedUnitId] = useState<string | undefined>();
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isExpoCodeOpen, setIsExpoCodeOpen] = useState(false);
  const [isSubMeterModalOpen, setIsSubMeterModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [upiTargetUnit, setUpiTargetUnit] = useState<ResidentUnit | null>(null);
  const [receiptUnit, setReceiptUnit] = useState<ResidentUnit | null>(null);

  // Handlers
  const handleToggleRole = () => {
    setCurrentRole((prev) => (prev === 'manager' ? 'tenant' : 'manager'));
  };

  const handleResetData = () => {
    setUnits(INITIAL_UNITS);
    setTanks(INITIAL_TANKS);
    setSubMeters(INITIAL_SUB_METERS);
    setTankerLogs(INITIAL_TANKER_LOGS);
    setTickets(INITIAL_TICKETS);
    setNotices(INITIAL_NOTICES);
    setActiveTab('overview');
  };

  const handleOpenPaymentModal = (unitId?: string) => {
    setPaymentSelectedUnitId(unitId);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = (
    unitId: string,
    amount: number,
    method: 'UPI' | 'NEFT' | 'Cash' | 'Cheque',
    ref: string,
    date: string
  ) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id !== unitId) return unit;
        const totalDue = unit.rentAmount + unit.maintenanceAmount + unit.waterCharges;
        const newPaid = unit.amountPaid + amount;
        const status = newPaid >= totalDue ? 'paid' : 'partial';

        const updatedUnit: ResidentUnit = {
          ...unit,
          amountPaid: newPaid,
          status,
          paymentMethod: method,
          transactionRef: ref,
          lastPaymentDate: date,
        };

        // Open receipt modal automatically when settled!
        setReceiptUnit(updatedUnit);
        return updatedUnit;
      })
    );
  };

  const handleUpdateTankLevel = (tankId: string, newLiters: number) => {
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? {
              ...t,
              currentLiters: newLiters,
              lastUpdated: `${formatDate(new Date())} 09:30 AM`,
            }
          : t
      )
    );
  };

  const handleAddTankerDelivery = (delivery: Omit<TankerDelivery, 'id'>) => {
    const newDelivery: TankerDelivery = {
      ...delivery,
      id: `tk-${Date.now()}`,
    };
    setTankerLogs((prev) => [newDelivery, ...prev]);

    // Also increase storage in Sump or Overhead tank
    setTanks((prev) =>
      prev.map((t) => {
        if (t.name.includes('Sump') || t.id === 'tank-3') {
          const updated = Math.min(t.capacityLiters, t.currentLiters + delivery.volumeLiters);
          return {
            ...t,
            currentLiters: updated,
            lastUpdated: `${delivery.deliveryDate} ${delivery.deliveryTime}`,
          };
        }
        return t;
      })
    );
  };

  const handleCreateTicket = (ticketData: {
    title: string;
    category: any;
    location: string;
    priority: any;
    notes: string;
  }) => {
    const newTicket: MaintenanceTicket = {
      id: `tk-${Date.now()}`,
      title: ticketData.title,
      category: ticketData.category,
      location: ticketData.location,
      priority: ticketData.priority,
      notes: ticketData.notes,
      reportedBy: currentRole === 'manager' ? 'Management Committee' : 'Flat 201 (Deepak)',
      reportedDate: formatDate(new Date()),
      status: 'Reported',
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddNotice = (noticeData: Omit<NoticeCircular, 'id'>) => {
    const newNotice: NoticeCircular = {
      ...noticeData,
      id: `not-${Date.now()}`,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const handleSaveSubMeterReading = (reading: {
    flatNumber: string;
    tenantName: string;
    previousReadingKL: number;
    currentReadingKL: number;
    consumptionKL: number;
    ratePerKL: number;
    totalAmount: number;
    recordedDate: string;
  }) => {
    // 1. Update subMeters
    setSubMeters((prev) => {
      const existingIdx = prev.findIndex((s) => s.flatNumber === reading.flatNumber);
      const newRecord: SubMeterReading = {
        id: `sm-${reading.flatNumber}`,
        ...reading,
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRecord;
        return copy;
      }
      return [newRecord, ...prev];
    });

    // 2. Update unit's water charge in ledger
    setUnits((prev) =>
      prev.map((u) => {
        if (u.flatNumber === reading.flatNumber) {
          const newWaterCharge = reading.totalAmount;
          const totalDue = u.rentAmount + u.maintenanceAmount + newWaterCharge;
          const status = u.amountPaid >= totalDue ? 'paid' : 'partial';
          return {
            ...u,
            waterCharges: newWaterCharge,
            status: u.amountPaid > 0 ? status : u.status,
          };
        }
        return u;
      })
    );
  };

  const handleStartUpiPayment = (unitId?: string) => {
    const target = units.find((u) => u.id === unitId) || units.find((u) => u.flatNumber === '201') || units[0];
    setUpiTargetUnit(target);
    setIsUpiModalOpen(true);
  };

  const handleConfirmUpiPayment = (amount: number, txRef: string) => {
    if (!upiTargetUnit) return;
    handleRecordPayment(upiTargetUnit.id, amount, 'UPI', txRef, formatDate(new Date()));
  };

  const pendingLedgerCount = units.filter((u) => u.status !== 'paid').length;
  const activeTicketsCount = tickets.filter((t) => t.status !== 'Completed').length;

  return (
    <MobileFrame
      isDeviceFrame={isDeviceFrame}
      onToggleFrame={() => setIsDeviceFrame((prev) => !prev)}
    >
      {/* Header Bar */}
      <Header
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
        onOpenExpoCode={() => setIsExpoCodeOpen(true)}
        onResetData={handleResetData}
      />

      {/* Screen Body */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'overview' && (
          <OverviewScreen
            units={units}
            tanks={tanks}
            notices={notices}
            currentRole={currentRole}
            onOpenPaymentModal={currentRole === 'tenant' ? handleStartUpiPayment : handleOpenPaymentModal}
            onOpenWaterModal={() => setIsWaterModalOpen(true)}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            onSelectUnitReceipt={(unit) => setReceiptUnit(unit)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerScreen
            units={units}
            onOpenPaymentModal={handleOpenPaymentModal}
            onSelectUnitReceipt={(unit) => setReceiptUnit(unit)}
          />
        )}

        {activeTab === 'utilities' && (
          <UtilitiesScreen
            tanks={tanks}
            subMeters={subMeters}
            tankerLogs={tankerLogs}
            onOpenWaterModal={() => setIsWaterModalOpen(true)}
            onOpenSubMeterModal={() => setIsSubMeterModalOpen(true)}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceScreen
            tickets={tickets}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryScreen
            units={units}
            notices={notices}
            onAddNotice={handleAddNotice}
          />
        )}
      </main>

      {/* Native Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        pendingLedgerCount={pendingLedgerCount}
        activeTicketsCount={activeTicketsCount}
      />

      {/* Modals & Dialogs */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        units={units}
        initialSelectedUnitId={paymentSelectedUnitId}
        onRecordPayment={handleRecordPayment}
      />

      <LogWaterModal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        tanks={tanks}
        onUpdateTankLevel={handleUpdateTankLevel}
        onAddTankerDelivery={handleAddTankerDelivery}
      />

      <NewTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
        defaultLocation={currentRole === 'tenant' ? 'Flat 201' : 'Common Duct / Area'}
      />

      <LogSubMeterModal
        isOpen={isSubMeterModalOpen}
        onClose={() => setIsSubMeterModalOpen(false)}
        units={units}
        subMeters={subMeters}
        onSaveReading={handleSaveSubMeterReading}
      />

      {upiTargetUnit && (
        <UpiPaymentModal
          isOpen={isUpiModalOpen}
          onClose={() => setIsUpiModalOpen(false)}
          unit={upiTargetUnit}
          onConfirmUpiPayment={handleConfirmUpiPayment}
        />
      )}

      <ReceiptModal
        isOpen={receiptUnit !== null}
        onClose={() => setReceiptUnit(null)}
        unit={receiptUnit}
      />

      <ExpoCodeViewerModal
        isOpen={isExpoCodeOpen}
        onClose={() => setIsExpoCodeOpen(false)}
      />
    </MobileFrame>
  );
}
