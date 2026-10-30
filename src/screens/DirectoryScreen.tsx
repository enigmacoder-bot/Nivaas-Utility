import React, { useState } from 'react';
import { Users, Bell, Phone, Car, Plus, Pin, Check } from 'lucide-react';
import { ResidentUnit, NoticeCircular } from '../types';
import { maskPhoneNumber, formatDate } from '../utils/formatters';

interface DirectoryScreenProps {
  units: ResidentUnit[];
  notices: NoticeCircular[];
  onAddNotice: (notice: Omit<NoticeCircular, 'id'>) => void;
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({
  units,
  notices,
  onAddNotice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'residents' | 'notices'>('residents');
  const [isPostingNotice, setIsPostingNotice] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState<'General' | 'Water Schedule' | 'Maintenance' | 'Urgent'>('General');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddNotice({
      title: newTitle.trim(),
      content: newContent.trim(),
      tag: newTag,
      date: formatDate(new Date()),
      issuedBy: 'Management Committee',
      isPinned: newTag === 'Urgent',
    });
    setNewTitle('');
    setNewContent('');
    setIsPostingNotice(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Sub Tab Switcher */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1 flex">
        <button
          type="button"
          onClick={() => setActiveSubTab('residents')}
          className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeSubTab === 'residents'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Resident Directory ({units.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('notices')}
          className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeSubTab === 'notices'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Circulars ({notices.length})</span>
        </button>
      </div>

      {activeSubTab === 'residents' ? (
        <div className="space-y-3">
          <p className="text-xs text-[#4B5563] px-1">
            Official occupant list & allocated parking slots for Nivaas Residency.
          </p>
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F7F9] border border-[#E5E7EB] flex flex-col items-center justify-center font-bold text-xs text-[#111827]">
                    <span className="text-[10px] text-[#4B5563] font-medium leading-none">FLAT</span>
                    <span>{unit.flatNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#111827] leading-tight">
                      {unit.tenantName}
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-normal mt-0.5">
                      {unit.block} · Owner: {unit.ownerName}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="inline-flex items-center gap-1 text-[#4B5563]">
                    <Car className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="font-semibold text-[#111827]">{unit.parkingSlot}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#4B5563] pt-2 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#6E7977]" />
                  <span>{maskPhoneNumber(unit.phone)}</span>
                </div>
                <span>Intercom: #{unit.intercom}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111827]">Official Society Circulars</h3>
            <button
              onClick={() => setIsPostingNotice(true)}
              type="button"
              className="h-9 px-3 rounded-xl bg-[#0F766E] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#115E59]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>

          {isPostingNotice && (
            <form onSubmit={handlePostNotice} className="bg-white rounded-2xl border border-[#0F766E] p-4 space-y-3">
              <h4 className="text-sm font-semibold text-[#111827]">Publish Community Notice</h4>
              <input
                type="text"
                placeholder="Notice headline (e.g. Lift Servicing Schedule)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#0F766E]"
                required
              />
              <textarea
                placeholder="Notice announcement content..."
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#0F766E]"
                required
              />
              <div className="flex items-center justify-between pt-1">
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="h-10 px-3 rounded-lg border border-[#E5E7EB] text-xs bg-white text-[#111827]"
                >
                  <option value="General">General</option>
                  <option value="Water Schedule">Water Schedule</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostingNotice(false)}
                    className="h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#111827]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59]"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
          )}

          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] space-y-2 ${
                notice.isPinned ? 'border-[#0F766E]' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      notice.tag === 'Urgent'
                        ? 'bg-[#FEE2E2] text-[#B91C1C]'
                        : notice.tag === 'Water Schedule'
                        ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                        : 'bg-[#DCFCE7] text-[#166534]'
                    }`}
                  >
                    {notice.tag}
                  </span>
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-[#0F766E] font-medium">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#4B5563]">{notice.date}</span>
              </div>

              <h4 className="text-base font-semibold text-[#111827] leading-snug">{notice.title}</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">{notice.content}</p>
              <p className="text-[11px] text-[#6E7977] pt-1 border-t border-[#E5E7EB]">
                Issued by: {notice.issuedBy}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
