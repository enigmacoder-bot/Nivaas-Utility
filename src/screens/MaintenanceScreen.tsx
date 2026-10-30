import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, ShieldCheck, Phone, AlertCircle } from 'lucide-react';
import { MaintenanceTicket, TicketStatus } from '../types';
import { StatusChip } from '../components/StatusChip';
import { formatINR, maskPhoneNumber } from '../utils/formatters';

interface MaintenanceScreenProps {
  tickets: MaintenanceTicket[];
  onOpenTicketModal: () => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  tickets,
  onOpenTicketModal,
  onUpdateTicketStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'active') return t.status !== 'Completed';
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  const activeCount = tickets.filter((t) => t.status !== 'Completed').length;
  const completedCount = tickets.filter((t) => t.status === 'Completed').length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111827]">Maintenance & Service</h2>
          <p className="text-xs text-[#4B5563]">{activeCount} active requests pending</p>
        </div>
        <button
          onClick={onOpenTicketModal}
          type="button"
          className="h-10 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#115E59] active:bg-[#115E59] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F6F7F9]'
          }`}
        >
          All ({tickets.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'active'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F6F7F9]'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F6F7F9]'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => {
          return (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] flex items-center justify-center text-[#0F766E] shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#F1F3FF] text-[#1D4ED8]">
                      {ticket.category}
                    </span>
                    <h3 className="text-base font-semibold text-[#111827] mt-1 leading-snug">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-[#4B5563]">
                      {ticket.location} · Reported by {ticket.reportedBy}
                    </p>
                  </div>
                </div>

                <StatusChip status={ticket.status} size="sm" />
              </div>

              {/* Notes */}
              {ticket.notes && (
                <p className="text-xs text-[#4B5563] bg-[#F6F7F9] p-2.5 rounded-xl border border-[#E5E7EB] leading-relaxed">
                  {ticket.notes}
                </p>
              )}

              {/* Assigned tech & cost */}
              <div className="flex items-center justify-between text-xs text-[#4B5563] pt-1">
                <div>
                  {ticket.assignedTechnician ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#111827] font-medium">Assigned:</span>
                      <span>{ticket.assignedTechnician}</span>
                      {ticket.technicianPhone && (
                        <span className="font-mono text-[#6E7977]">
                          ({maskPhoneNumber(ticket.technicianPhone)})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#92400E]">Pending technician assignment</span>
                  )}
                </div>

                {ticket.estimatedCost && (
                  <span className="font-semibold text-[#111827]">
                    Est: {formatINR(ticket.estimatedCost)}
                  </span>
                )}
              </div>

              {/* Status progression actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                {ticket.status === 'Reported' && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, 'Assigned')}
                    type="button"
                    className="h-8 px-3 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#111827] hover:bg-[#F6F7F9]"
                  >
                    Assign Technician
                  </button>
                )}

                {ticket.status === 'Assigned' && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, 'Verified Visit')}
                    type="button"
                    className="h-8 px-3 rounded-lg bg-[#DBEAFE] text-xs font-medium text-[#1D4ED8] hover:bg-[#BFDBFE]"
                  >
                    Verify Technician Visit
                  </button>
                )}

                {ticket.status === 'Verified Visit' && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, 'Completed')}
                    type="button"
                    className="h-8 px-3 rounded-lg bg-[#DCFCE7] text-xs font-semibold text-[#166534] hover:bg-[#BBF7D0]"
                  >
                    Mark Resolved
                  </button>
                )}

                {ticket.status === 'Completed' && (
                  <span className="text-xs font-semibold text-[#166534] inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Work Inspected & Closed</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
