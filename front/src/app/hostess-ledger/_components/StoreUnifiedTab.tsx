'use client';

import React, { useState } from 'react';
import CourseRatioTab from './CourseRatioTab';
import CourseFixedTab from './CourseFixedTab';
import CourseCombinedTab from './CourseCombinedTab';
import ClassTab from './ClassTab';
import OptionTab from './OptionTab';

const stores = [
  { id: 'kyoto-deri', name: '京都デリヘル倶楽部' },
  { id: 'kyoto-hote', name: '京都ホテヘル倶楽部' },
  { id: 'shiga-dcp', name: '滋賀DCP' },
];

export default function StoreUnifiedTab() {
  const [selectedStore, setSelectedStore] = useState(stores[0].id);

  return (
    <div className="flex flex-col h-full text-[11px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
        <span className="font-bold">店舗:</span>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="h-7 px-2 text-[11px] border border-gray-400 bg-white"
          aria-label="店舗を選択"
        >
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="text-gray-500">この店舗のすべての設定を1画面で表示</span>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        <Section title="コース料金 / 割合制">
          <CourseRatioTab />
        </Section>
        <Section title="コース料金 / 定額制">
          <CourseFixedTab />
        </Section>
        <Section title="コース料金 / 同一併用">
          <CourseCombinedTab />
        </Section>
        <Section title="クラス">
          <ClassTab />
        </Section>
        <Section title="オプション">
          <OptionTab />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-300 rounded">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-[11px]"
      >
        <span>{title}</span>
        <span className="text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-2">{children}</div>}
    </div>
  );
}
