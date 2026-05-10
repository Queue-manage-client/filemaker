'use client';

import React, { useState } from 'react';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const parseNonNeg = (raw: string) => {
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, n);
};

type Course = {
  id: string;
  name: string;
  minutes: number;
  basePrice: number;
  freeFee: number;
  panelFee: number;
  specialFee: number;
};

const initialCourses: Course[] = [
  { id: 'c60', name: '60分コース', minutes: 60, basePrice: 18000, freeFee: 0, panelFee: 1000, specialFee: 3000 },
  { id: 'c90', name: '90分コース', minutes: 90, basePrice: 25000, freeFee: 0, panelFee: 1000, specialFee: 3000 },
  { id: 'c120', name: '120分コース', minutes: 120, basePrice: 32000, freeFee: 0, panelFee: 1500, specialFee: 4000 },
];

const classOptions = ['ガールズ', 'レディ', 'スーパー'] as const;
type ClassKey = (typeof classOptions)[number];

export default function CourseRatioTab() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [hostessRate, setHostessRate] = useState(60);
  const [extensionMin, setExtensionMin] = useState(30);
  const [extensionUnit, setExtensionUnit] = useState(3000);
  const [classBonus, setClassBonus] = useState<Record<ClassKey, number>>({
    'ガールズ': 0,
    'レディ': 2000,
    'スーパー': 5000,
  });
  const [selectedClass, setSelectedClass] = useState<ClassKey>('ガールズ');

  const bonus = classBonus[selectedClass];

  const calcShares = (subtotal: number) => {
    const hostess = Math.round(subtotal * (hostessRate / 100));
    return { hostess, store: subtotal - hostess };
  };

  const updateCourse = <K extends keyof Course>(id: string, key: K, value: Course[K]) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const addCourse = () => {
    const id = `c-new-${Date.now()}`;
    setCourses(prev => [...prev, { id, name: '新規コース', minutes: 60, basePrice: 0, freeFee: 0, panelFee: 0, specialFee: 0 }]);
  };

  const removeCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  const reset = () => {
    setCourses(initialCourses);
    setHostessRate(60);
    setExtensionMin(30);
    setExtensionUnit(3000);
    setClassBonus({ 'ガールズ': 0, 'レディ': 2000, 'スーパー': 5000 });
    setSelectedClass('ガールズ');
  };

  const extShares = calcShares(extensionUnit);

  return (
    <div className="bg-gray-100 p-2 text-[11px] h-full flex flex-col gap-2 overflow-auto">
      {/* 上部: 全体設定 */}
      <div className="bg-white border border-gray-300 rounded p-2 space-y-2">
        <div className="text-[11px] font-bold text-gray-700">▼ 全体設定 (変更すると下表が全行連動します)</div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span>取分率</span>
            <input
              type="number"
              min={0}
              max={100}
              value={hostessRate}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isNaN(n)) return;
                setHostessRate(clamp(n, 0, 100));
              }}
              className="w-[50px] h-[20px] text-[11px] px-1 bg-yellow-100 border border-gray-400"
            />
            <span>%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>延長</span>
            <input
              type="number"
              min={0}
              value={extensionMin}
              onChange={(e) => setExtensionMin(parseNonNeg(e.target.value))}
              className="w-[40px] h-[20px] text-[11px] px-1 bg-white border border-gray-400 text-center"
            />
            <span>分毎</span>
            <input
              type="number"
              min={0}
              value={extensionUnit}
              onChange={(e) => setExtensionUnit(parseNonNeg(e.target.value))}
              className="w-[60px] h-[20px] text-[11px] px-1 bg-white border border-gray-400"
            />
            <span>円 → ホ取分 ¥{extShares.hostess.toLocaleString()} / 店取分 ¥{extShares.store.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-[11px] font-bold">クラス加算金:</div>
          {classOptions.map((cls) => (
            <div key={cls} className="flex items-center gap-1">
              <span>{cls}</span>
              <input
                type="number"
                min={0}
                value={classBonus[cls]}
                onChange={(e) => setClassBonus(prev => ({ ...prev, [cls]: parseNonNeg(e.target.value) }))}
                className="w-[60px] h-[20px] text-[11px] px-1 bg-white border border-gray-400"
              />
              <span>円</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">プレビュー対象クラス:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassKey)}
            className="h-[22px] text-[11px] px-1 bg-white border border-gray-400"
          >
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls} (+¥{classBonus[cls].toLocaleString()})</option>
            ))}
          </select>
          <span className="text-gray-500">下表は「{selectedClass}」のクラス加算金 ¥{bonus.toLocaleString()} 込みで計算</span>
        </div>
      </div>

      {/* コース料金テーブル */}
      <div className="bg-white border border-gray-300 rounded">
        <div className="flex items-center justify-between px-2 py-1 bg-gray-100 border-b border-gray-300">
          <span className="font-bold">▼ コース料金テーブル (全セル自動連動)</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={addCourse}
              className="px-2 py-0.5 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + コース追加
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-2 py-0.5 text-[10px] bg-gray-300 rounded hover:bg-gray-400"
            >
              リセット
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan={2} className="border border-gray-300 px-1 py-1">コース名</th>
                <th rowSpan={2} className="border border-gray-300 px-1 py-1 w-[50px]">時間</th>
                <th rowSpan={2} className="border border-gray-300 px-1 py-1 w-[80px]">基本料金</th>
                <th colSpan={2} className="border border-gray-300 px-1 py-1 bg-pink-100">フリー指名 (+0円)</th>
                <th colSpan={2} className="border border-gray-300 px-1 py-1 bg-amber-100">パネル指名</th>
                <th colSpan={2} className="border border-gray-300 px-1 py-1 bg-rose-100">特別指名</th>
                <th rowSpan={2} className="border border-gray-300 px-1 py-1 w-[40px]">操作</th>
              </tr>
              <tr>
                <th className="border border-gray-300 px-1 py-0.5 bg-pink-50 text-[10px]">指名料</th>
                <th className="border border-gray-300 px-1 py-0.5 bg-pink-50 text-[10px]">ホ/店</th>
                <th className="border border-gray-300 px-1 py-0.5 bg-amber-50 text-[10px]">指名料</th>
                <th className="border border-gray-300 px-1 py-0.5 bg-amber-50 text-[10px]">ホ/店</th>
                <th className="border border-gray-300 px-1 py-0.5 bg-rose-50 text-[10px]">指名料</th>
                <th className="border border-gray-300 px-1 py-0.5 bg-rose-50 text-[10px]">ホ/店</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const subtotalFree = c.basePrice + c.freeFee + bonus;
                const subtotalPanel = c.basePrice + c.panelFee + bonus;
                const subtotalSpecial = c.basePrice + c.specialFee + bonus;
                const free = calcShares(subtotalFree);
                const panel = calcShares(subtotalPanel);
                const special = calcShares(subtotalSpecial);

                return (
                  <tr key={c.id}>
                    <td className="border border-gray-300 px-1 py-1">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCourse(c.id, 'name', e.target.value)}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <input
                        type="number"
                        min={0}
                        value={c.minutes}
                        onChange={(e) => updateCourse(c.id, 'minutes', parseNonNeg(e.target.value))}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5 text-right"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <input
                        type="number"
                        min={0}
                        value={c.basePrice}
                        onChange={(e) => updateCourse(c.id, 'basePrice', parseNonNeg(e.target.value))}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5 text-right"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-pink-50">
                      <input
                        type="number"
                        min={0}
                        value={c.freeFee}
                        onChange={(e) => updateCourse(c.id, 'freeFee', parseNonNeg(e.target.value))}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5 text-right"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-pink-50 text-right">
                      <span className="text-pink-700 font-bold">¥{free.hostess.toLocaleString()}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-cyan-700 font-bold">¥{free.store.toLocaleString()}</span>
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-amber-50">
                      <input
                        type="number"
                        min={0}
                        value={c.panelFee}
                        onChange={(e) => updateCourse(c.id, 'panelFee', parseNonNeg(e.target.value))}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5 text-right"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-amber-50 text-right">
                      <span className="text-pink-700 font-bold">¥{panel.hostess.toLocaleString()}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-cyan-700 font-bold">¥{panel.store.toLocaleString()}</span>
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-rose-50">
                      <input
                        type="number"
                        min={0}
                        value={c.specialFee}
                        onChange={(e) => updateCourse(c.id, 'specialFee', parseNonNeg(e.target.value))}
                        className="w-full text-[11px] border border-gray-200 px-1 py-0.5 text-right"
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 bg-rose-50 text-right">
                      <span className="text-pink-700 font-bold">¥{special.hostess.toLocaleString()}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-cyan-700 font-bold">¥{special.store.toLocaleString()}</span>
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeCourse(c.id)}
                        className="px-1 text-[10px] bg-red-100 text-red-700 rounded hover:bg-red-200"
                        title="この行を削除"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={10} className="border border-gray-300 px-1 py-3 text-center text-gray-400">
                    コースが登録されていません。「+ コース追加」を押してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] text-gray-500">
        ※ ホ = ホステス取分 / 店 = 店舗取分 / 緑バー値はクラス加算金「{selectedClass} ¥{bonus.toLocaleString()}」込み
      </div>
    </div>
  );
}
