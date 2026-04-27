'use client';

import React, { useState } from 'react';
import CourseRatioTab from './CourseRatioTab';
import CourseFixedTab from './CourseFixedTab';
import CourseCombinedTab from './CourseCombinedTab';
import ClassTab from './ClassTab';
import OptionTab from './OptionTab';

const stores = [
  { id: 'kyoto-deri', name: '京都デリヘル倶楽部', color: 'bg-pink-100 border-pink-400 text-pink-800' },
  { id: 'kyoto-hote', name: '京都ホテヘル倶楽部', color: 'bg-amber-100 border-amber-400 text-amber-800' },
  { id: 'shiga-dcp', name: '滋賀DCP', color: 'bg-sky-100 border-sky-400 text-sky-800' },
];

export default function StoreUnifiedTab() {
  const [selectedStore, setSelectedStore] = useState(stores[0].id);

  const currentStore = stores.find((s) => s.id === selectedStore) ?? stores[0];

  return (
    <div className="flex flex-col h-full text-[11px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
        <span className="font-bold">店舗:</span>
        <div className="flex gap-1">
          {stores.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStore(s.id)}
              className={`px-2 py-1 text-[11px] rounded border ${
                selectedStore === s.id
                  ? `${s.color} font-bold`
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <span className="ml-auto text-gray-500">この店舗のすべての設定を1画面で表示</span>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        <Section title="コース料金 / 割合制" storeName={currentStore.name} storeColor={currentStore.color}>
          <CourseRatioTab />
        </Section>
        <Section title="コース料金 / 定額制" storeName={currentStore.name} storeColor={currentStore.color}>
          <CourseFixedTab />
        </Section>
        <Section title="コース料金 / 同一併用" storeName={currentStore.name} storeColor={currentStore.color}>
          <CourseCombinedTab />
        </Section>
        <Section title="クラス" storeName={currentStore.name} storeColor={currentStore.color}>
          <ClassTab />
        </Section>
        <Section title="オプション" storeName={currentStore.name} storeColor={currentStore.color}>
          <OptionTab />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  storeName,
  storeColor,
  children,
}: {
  title: string;
  storeName: string;
  storeColor: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-300 rounded">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-[11px]"
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          <span className={`px-1.5 py-0.5 text-[10px] font-normal rounded border ${storeColor}`}>
            {storeName}
          </span>
        </span>
        <span className="text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-2">{children}</div>}
    </div>
  );
}
