import React, { useState } from 'react';
import { X, Wrench, AlertCircle } from 'lucide-react';
import { TicketCategory, TicketPriority } from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: {
    title: string;
    category: TicketCategory;
    location: string;
    priority: TicketPriority;
    notes: string;
  }) => void;
  defaultLocation?: string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultLocation = 'Flat 201',
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Plumbing');
  const [location, setLocation] = useState(defaultLocation);
  const [priority, setPriority] = useState<TicketPriority>('Normal');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a brief title describing the issue');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      category,
      location: location.trim(),
      priority,
      notes: notes.trim(),
    });
    onClose();
  };

  const categories: TicketCategory[] = ['Plumbing', 'Electrical', 'Elevator', 'Water', 'Cleaning', 'Security'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(17,24,39,0.40)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-title"
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#E5E7EB] shadow-[0_-4px_16px_rgba(17,24,39,0.08)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div>
            <h2 id="new-ticket-title" className="text-lg font-semibold text-[#111827]">
              New Service Ticket
            </h2>
            <p className="text-sm text-[#4B5563]">Log community or flat maintenance work</p>
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
          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#B91C1C] text-sm font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="ticket-title" className="block text-sm font-medium text-[#111827] mb-1.5">
              Issue Summary
            </label>
            <input
              id="ticket-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
              placeholder="e.g. Kitchen sink pipe leakage"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Service Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`h-11 rounded-xl text-sm font-medium border flex items-center justify-center transition-all ${
                    category === cat
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F6F7F9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="ticket-location" className="block text-sm font-medium text-[#111827] mb-1.5">
              Location / Flat
            </label>
            <input
              id="ticket-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors"
              placeholder="e.g. Flat 204 or Common Terrace"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'High', 'Urgent'] as TicketPriority[]).map((p) => {
                const isSelected = priority === p;
                let bgActive = 'bg-[#0F766E] text-white border-[#0F766E]';
                if (p === 'Urgent') bgActive = 'bg-[#B91C1C] text-white border-[#B91C1C]';
                else if (p === 'High') bgActive = 'bg-[#D97706] text-white border-[#D97706]';

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`h-11 rounded-xl text-sm font-medium border flex items-center justify-center transition-all ${
                      isSelected ? bgActive : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F6F7F9]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="ticket-notes" className="block text-sm font-medium text-[#111827] mb-1.5">
              Detailed Notes & Observations
            </label>
            <textarea
              id="ticket-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E5E7EB] bg-white text-base text-[#111827] focus:outline-none focus:border-[#0F766E] transition-colors resize-none"
              placeholder="Add specifics (e.g. water pressure low, dripping since yesterday)"
            />
          </div>

          {/* Actions */}
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
              <Wrench className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
