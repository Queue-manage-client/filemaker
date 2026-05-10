'use client';

import React, { useState } from 'react';

type StoreData = {
  id: string;
  name: string;
  color: string;
  courseRatio: { name: string; minutes: number; price: number; rate: number }[];
  courseFixed: { name: string; minutes: number; price: number; hostessShare: number }[];
  courseCombined: { name: string; minutes: number; price: number; note: string }[];
  classes: { name: string; bonus: number }[];
  options: { name: string; price: number; hostessShare: number }[];
};

const stores: StoreData[] = [
  {
    id: 'kyoto-deri',
    name: '京都デリヘル倶楽部',
    color: 'bg-pink-100 border-pink-400 text-pink-800',
    courseRatio: [
      { name: '60分コース', minutes: 60, price: 18000, rate: 60 },
      { name: '90分コース', minutes: 90, price: 25000, rate: 60 },
      { name: '120分コース', minutes: 120, price: 32000, rate: 60 },
    ],
    courseFixed: [
      { name: '60分標準', minutes: 60, price: 18000, hostessShare: 9000 },
      { name: '90分標準', minutes: 90, price: 25000, hostessShare: 13000 },
    ],
    courseCombined: [
      { name: '60分併用', minutes: 60, price: 17000, note: '京都ホテヘル併用可' },
    ],
    classes: [
      { name: 'ガールズ', bonus: 0 },
      { name: 'レディ', bonus: 2000 },
      { name: 'スーパー', bonus: 5000 },
    ],
    options: [
      { name: 'ローション', price: 2000, hostessShare: 1500 },
      { name: '衣装変更', price: 1500, hostessShare: 1000 },
      { name: '延長30分', price: 9000, hostessShare: 5000 },
    ],
  },
  {
    id: 'kyoto-hote',
    name: '京都ホテヘル倶楽部',
    color: 'bg-amber-100 border-amber-400 text-amber-800',
    courseRatio: [
      { name: '70分コース', minutes: 70, price: 22000, rate: 55 },
      { name: '100分コース', minutes: 100, price: 30000, rate: 58 },
    ],
    courseFixed: [
      { name: '70分標準', minutes: 70, price: 22000, hostessShare: 11000 },
      { name: '100分標準', minutes: 100, price: 30000, hostessShare: 16000 },
      { name: '150分プレミアム', minutes: 150, price: 45000, hostessShare: 25000 },
    ],
    courseCombined: [
      { name: '70分併用', minutes: 70, price: 21000, note: '京都デリ併用可' },
      { name: '100分併用', minutes: 100, price: 29000, note: '京都デリ併用可' },
    ],
    classes: [
      { name: 'ガールズ', bonus: 1000 },
      { name: 'レディ', bonus: 3000 },
    ],
    options: [
      { name: 'ローション', price: 2500, hostessShare: 1800 },
      { name: 'コスプレ', price: 3000, hostessShare: 2000 },
    ],
  },
  {
    id: 'shiga-dcp',
    name: '滋賀DCP',
    color: 'bg-sky-100 border-sky-400 text-sky-800',
    courseRatio: [
      { name: '60分コース', minutes: 60, price: 16000, rate: 65 },
      { name: '90分コース', minutes: 90, price: 23000, rate: 62 },
    ],
    courseFixed: [
      { name: '60分標準', minutes: 60, price: 16000, hostessShare: 9000 },
    ],
    courseCombined: [],
    classes: [
      { name: 'スタンダード', bonus: 0 },
      { name: 'プレミアム', bonus: 2500 },
    ],
    options: [
      { name: 'ローション', price: 1800, hostessShare: 1200 },
      { name: '延長30分', price: 7000, hostessShare: 4500 },
    ],
  },
];

export default function StoreUnifiedTab() {
  const [selectedStore, setSelectedStore] = useState(stores[0].id);
  const store = stores.find((s) => s.id === selectedStore) ?? stores[0];

  return (
    <div className="flex flex-col h-full text-[11px]">
      <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-gray-300">
        <span className="font-bold">店舗:</span>
        <div className="flex gap-1">
          {stores.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStore(s.id)}
              className={`px-2 py-1 text-[11px] rounded border ${
                selectedStore === s.id ? `${s.color} font-bold` : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <span className="ml-auto text-gray-500">店舗を切り替えると下記の全データが切替わります</span>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        <Section title="コース料金 / 割合制" storeName={store.name} storeColor={store.color}>
          {store.courseRatio.length === 0 ? (
            <Empty />
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">コース</th>
                  <th className="border border-gray-300 px-2 py-1">時間</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">料金</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">取分率</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">ホステス取分</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">店舗取分</th>
                </tr>
              </thead>
              <tbody>
                {store.courseRatio.map((c) => {
                  const hostess = Math.round(c.price * (c.rate / 100));
                  return (
                    <tr key={c.name}>
                      <td className="border border-gray-300 px-2 py-1">{c.name}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{c.minutes}分</td>
                      <td className="border border-gray-300 px-2 py-1 text-right">¥{c.price.toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{c.rate}%</td>
                      <td className="border border-gray-300 px-2 py-1 text-right text-pink-700">¥{hostess.toLocaleString()}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right text-cyan-700">¥{(c.price - hostess).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="コース料金 / 定額制" storeName={store.name} storeColor={store.color}>
          {store.courseFixed.length === 0 ? (
            <Empty />
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">コース</th>
                  <th className="border border-gray-300 px-2 py-1">時間</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">料金</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">ホステス取分</th>
                </tr>
              </thead>
              <tbody>
                {store.courseFixed.map((c) => (
                  <tr key={c.name}>
                    <td className="border border-gray-300 px-2 py-1">{c.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{c.minutes}分</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">¥{c.price.toLocaleString()}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right text-pink-700">¥{c.hostessShare.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="コース料金 / 同一併用" storeName={store.name} storeColor={store.color}>
          {store.courseCombined.length === 0 ? (
            <Empty text="この店舗には併用コースの設定がありません" />
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">コース</th>
                  <th className="border border-gray-300 px-2 py-1">時間</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">料金</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {store.courseCombined.map((c) => (
                  <tr key={c.name}>
                    <td className="border border-gray-300 px-2 py-1">{c.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{c.minutes}分</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">¥{c.price.toLocaleString()}</td>
                    <td className="border border-gray-300 px-2 py-1">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="クラス" storeName={store.name} storeColor={store.color}>
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-1 text-left">クラス名</th>
                <th className="border border-gray-300 px-2 py-1 text-right">加算金</th>
              </tr>
            </thead>
            <tbody>
              {store.classes.map((c) => (
                <tr key={c.name}>
                  <td className="border border-gray-300 px-2 py-1">{c.name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">+¥{c.bonus.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="オプション" storeName={store.name} storeColor={store.color}>
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-1 text-left">オプション名</th>
                <th className="border border-gray-300 px-2 py-1 text-right">料金</th>
                <th className="border border-gray-300 px-2 py-1 text-right">ホステス取分</th>
              </tr>
            </thead>
            <tbody>
              {store.options.map((o) => (
                <tr key={o.name}>
                  <td className="border border-gray-300 px-2 py-1">{o.name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">¥{o.price.toLocaleString()}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right text-pink-700">¥{o.hostessShare.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}

function Empty({ text = 'データがありません' }: { text?: string }) {
  return <div className="text-center text-gray-400 py-3 text-[11px]">{text}</div>;
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
          <span className={`px-1.5 py-0.5 text-[10px] font-normal rounded border ${storeColor}`}>{storeName}</span>
        </span>
        <span className="text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-2">{children}</div>}
    </div>
  );
}
