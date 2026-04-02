'use client';

import React, { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { WorkStyleType, TRANSPORTATION_PAYMENT_METHOD_LABELS, TransportationPaymentMethod } from '@/types/hostess';

// A9: コース料金計算の型
interface CourseRate {
  basePrice: string;
  hostessRatio: string; // ホステス取分（%）
}

function calcHostessShare(basePrice: string, ratio: string): string {
  const price = parseFloat(basePrice.replace(/,/g, ''));
  const r = parseFloat(ratio);
  if (isNaN(price) || isNaN(r)) return '-';
  return Math.round(price * (r / 100)).toLocaleString();
}

function calcStoreShare(basePrice: string, ratio: string): string {
  const price = parseFloat(basePrice.replace(/,/g, ''));
  const r = parseFloat(ratio);
  if (isNaN(price) || isNaN(r)) return '-';
  return Math.round(price * (1 - r / 100)).toLocaleString();
}

export default function ProfileTab() {
  // A7: 勤務形態（出稼ぎを含む選択肢）
  const [workStyle, setWorkStyle] = useState<WorkStyleType | null>(null);

  // A8: 出稼ぎ選択時に連動（workStyle === 'dekasegi' で導出）
  const isDekasegi = workStyle === 'dekasegi';
  const [transportationFee, setTransportationFee] = useState('');
  const [dormitoryFee, setDormitoryFee] = useState('');
  const [transportationMethod, setTransportationMethod] = useState<TransportationPaymentMethod | ''>('');

  // A9: コース料金自動計算の状態
  const [specialNomination, setSpecialNomination] = useState<CourseRate>({ basePrice: '', hostessRatio: '60' });
  const [classBonus, setClassBonus] = useState<CourseRate>({ basePrice: '', hostessRatio: '60' });
  const [extensionFee, setExtensionFee] = useState<CourseRate>({ basePrice: '', hostessRatio: '60' });

  const specialNominationResult = useMemo(() => ({
    hostess: calcHostessShare(specialNomination.basePrice, specialNomination.hostessRatio),
    store: calcStoreShare(specialNomination.basePrice, specialNomination.hostessRatio),
  }), [specialNomination]);

  const classBonusResult = useMemo(() => ({
    hostess: calcHostessShare(classBonus.basePrice, classBonus.hostessRatio),
    store: calcStoreShare(classBonus.basePrice, classBonus.hostessRatio),
  }), [classBonus]);

  const extensionFeeResult = useMemo(() => ({
    hostess: calcHostessShare(extensionFee.basePrice, extensionFee.hostessRatio),
    store: calcStoreShare(extensionFee.basePrice, extensionFee.hostessRatio),
  }), [extensionFee]);

  return (
    <div className="bg-pink-200 p-2 text-[11px] h-full flex gap-2">
      {/* 左側セクション */}
      <div className="flex flex-col gap-1 shrink-0">
        {/* サイズ行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">サイズ</span>
          <span className="text-[10px] whitespace-nowrap">B</span>
          <input type="text" className="w-[28px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="83" />
          <span className="text-[10px] whitespace-nowrap">カップ</span>
          <input type="text" className="w-[20px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="B" />
          <span className="text-[10px] whitespace-nowrap">W</span>
          <input type="text" className="w-[28px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="58" />
          <span className="text-[10px] whitespace-nowrap">H</span>
          <input type="text" className="w-[28px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="86" />
        </div>

        {/* 身長・体重行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">身長</span>
          <input type="text" className="w-[36px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="158" />
          <span className="text-[10px] whitespace-nowrap">体重</span>
          <input type="text" className="w-[28px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="43" />
        </div>

        {/* 公称年齢行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">公称年齢</span>
          <input type="text" className="w-[28px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="33" />
          <span className="text-[10px] whitespace-nowrap">歳</span>
          <button type="button" className="h-[18px] px-1 text-[10px] bg-yellow-200 border border-gray-400 hover:bg-yellow-300 whitespace-nowrap">誕生日逆算</button>
          <span className="text-[10px] whitespace-nowrap">年齢初期値変更日</span>
          <input type="text" className="w-[70px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="2013/04/01" />
        </div>

        {/* 公称誕生日行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">公称誕生日</span>
          <span className="text-[11px] whitespace-nowrap ml-[11px] font-semibold">1984(昭和59)年1月1日生</span>
        </div>

        {/* 干支行 */}
        <div className="flex items-center gap-1 ml-[55px]">
          <span className="text-[11px] whitespace-nowrap font-semibold">甲子（きのえね）</span>
        </div>

        {/* 新人チェック */}
        <div className="flex items-center gap-1 ml-[44px]">
          <label className="flex items-center">
            <input type="checkbox" className="w-3 h-3" />
            <span className="ml-0.5 whitespace-nowrap">新人</span>
          </label>
        </div>

        {/* 指名料行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">指名料</span>
          <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
        </div>

        {/* ブログ用メアド行 */}
        <div className="flex items-center gap-1">
          <span className="w-[60px] whitespace-nowrap">ブログ用メアド</span>
          <input type="text" className="w-[200px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-[12px]" defaultValue="odette.e.odile-swan.lake@docomo.ne.jp" />
        </div>

        {/* 外部写メURL行 */}
        <div className="flex items-center gap-1">
          <span className="w-[60px] whitespace-nowrap">外部写メURL</span>
          <input type="text" className="w-[200px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-[12px]" />
        </div>

        {/* アイコンマスタ編集セクション */}
        <div className="flex flex-col mt-1">
          {/* ヘッダー行 */}
          <div className="flex">
            <div className="w-[50px]"></div>
            <div className="w-[70px] text-center text-[11px] whitespace-nowrap">アイコン1</div>
            <div className="w-[70px] text-center text-[11px] whitespace-nowrap">アイコン2</div>
            <div className="w-[70px] text-center text-[11px] whitespace-nowrap">アイコン3</div>
            <div className="w-[70px] text-center text-[11px] whitespace-nowrap">アイコン4</div>
          </div>
          {/* 数値行 + ラベル行 */}
          <div className="flex">
            {/* アイコンマスタ編集（黄色背景） */}
            <div className="w-[50px] bg-yellow-200 border border-gray-400 flex flex-col items-center justify-center">
              <span className="text-[11px] whitespace-nowrap">アイコン</span>
              <span className="text-[11px] whitespace-nowrap">マスタ</span>
              <span className="text-[11px] whitespace-nowrap">編集</span>
            </div>
            {/* 4つのカラム */}
            <div className="flex">
              <div className="flex flex-col">
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 flex items-center justify-center">2</div>
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-t-0 flex items-center justify-center">綺麗系</div>
              </div>
              <div className="flex flex-col">
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-l-0 flex items-center justify-center">16</div>
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-t-0 border-l-0 flex items-center justify-center">プレミア</div>
              </div>
              <div className="flex flex-col">
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-l-0 flex items-center justify-center">49</div>
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-t-0 border-l-0 flex items-center justify-center">真面目</div>
              </div>
              <div className="flex flex-col">
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-l-0 flex items-center justify-center">51</div>
                <div className="w-[70px] h-[22px] text-[11px] text-center bg-white border border-gray-400 border-t-0 border-l-0 flex items-center justify-center">おしとやか</div>
              </div>
            </div>
          </div>
          {/* アイコン行 */}
          <div className="flex -mt-1">
            <div className="w-[50px]"></div>
            <div className="w-[70px] flex justify-center">
              <div className="w-[50px] h-[30px] bg-gray-900 rounded-md flex items-center justify-center text-[10px] text-white font-bold leading-tight text-center">キレイ<br/>系</div>
            </div>
            <div className="w-[70px] flex justify-center">
              <div className="w-[50px] h-[30px] bg-gray-900 rounded-md flex items-center justify-center text-[10px] text-white font-bold">プレミア</div>
            </div>
            <div className="w-[70px] flex justify-center">
              <div className="w-[50px] h-[30px] bg-gray-900 rounded-md flex items-center justify-center text-[10px] text-white font-bold">真面目</div>
            </div>
            <div className="w-[70px] flex justify-center">
              <div className="w-[50px] h-[30px] bg-gray-900 rounded-md flex items-center justify-center text-[10px] text-white font-bold leading-tight text-center">おしと<br/>やか</div>
            </div>
          </div>
          {/* Web番号行 */}
          <div className="flex items-center">
            <div className="w-[50px] text-[11px] whitespace-nowrap">Web番号</div>
            <div className="w-[70px] text-center text-[11px]">15</div>
            <div className="w-[70px] text-center text-[11px]">31</div>
            <div className="w-[70px] text-center text-[11px]">23</div>
            <div className="w-[70px] text-center text-[11px]">13</div>
          </div>
        </div>

        {/* GIDNo行 */}
        <div className="flex items-center gap-2 mt-1">
          <span className="w-[50px] whitespace-nowrap">GIDNo</span>
          <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
          <span className="text-[10px] whitespace-nowrap">ck</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
        </div>
      </div>

      {/* 中央セクション */}
      <div className="flex flex-col gap-1 shrink-0">
        {/* 担当者行 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] whitespace-nowrap">担当者</span>
          <input type="text" className="w-[30px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="105" />
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="南 和貴" />
          <label className="flex items-center ml-1">
            <input type="radio" name="half" className="w-3 h-3" />
            <span className="ml-0.5 text-[10px] whitespace-nowrap">前半</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="half" className="w-3 h-3" />
            <span className="ml-0.5 text-[10px] whitespace-nowrap">後半</span>
          </label>
        </div>

        {/* 迎え場所行 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] whitespace-nowrap">迎え場所</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="団栗橋" />
        </div>

        {/* 送り場所行 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] whitespace-nowrap">送り場所</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="団栗橋" />
        </div>

        {/* シフトメール行 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] whitespace-nowrap">シフトメール</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="chuyochi.s.toy-mayu@disney.ne.jp" />
        </div>

        {/* 通常出勤時間行 */}
        <div className="flex items-center gap-1">
          <span className="w-[90px] whitespace-nowrap">通常出勤時間</span>
          <input type="text" className="w-[45px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="10:00" />
          <span className="w-[50px] ml-2 whitespace-nowrap">備品保持</span>
          <input type="text" className="w-[30px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="無" />
        </div>

        {/* 通常受付終了時間行 */}
        <div className="flex items-center gap-1">
          <span className="w-[90px] whitespace-nowrap">通常受付終了時間</span>
          <input type="text" className="w-[45px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="14:00" />
          <span className="w-[50px] ml-2 whitespace-nowrap">名刺持帰り</span>
          <input type="text" className="w-[30px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="無" />
        </div>

        {/* 通常帰宅時間行 */}
        <div className="flex items-center gap-1">
          <span className="w-[90px] whitespace-nowrap">通常帰宅時間</span>
          <input type="text" className="w-[45px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
        </div>

        {/* HPID行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">HPID</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400 font-bold" defaultValue="8003" />
          <button type="button" className="h-[18px] px-2 text-[10px] bg-gray-200 border border-gray-400 hover:bg-gray-300 whitespace-nowrap">メール送信</button>
        </div>

        {/* password行 */}
        <div className="flex items-center gap-1">
          <span className="w-[40px] whitespace-nowrap">password</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 font-bold ml-[11px]" defaultValue="w8v4" />
          <button type="button" className="h-[18px] px-2 text-[10px] bg-gray-200 border border-gray-400 hover:bg-gray-300 whitespace-nowrap">パスワード作成</button>
        </div>

        {/* 特記事項行 */}
        <div className="flex items-start gap-1">
          <span className="w-[50px] whitespace-nowrap">特記事項</span>
          <textarea className="w-[220px] h-[100px] text-[11px] px-0.5 bg-white border border-gray-400 resize-none" defaultValue="chuyochi.s.toy-mayu@disney.ne.jp" />
        </div>
      </div>

      {/* 右側セクション */}
      <div className="flex-1 flex flex-col bg-pink-200 p-1">
        {/* 上部: 左（新HPWeb送信+勤務形態）と 右（併用登録テーブル）*/}
        <div className="flex gap-2">
          {/* 左カラム: 新HPWeb送信ボタン + 勤務形態 */}
          <div className="flex flex-col gap-0 shrink-0">
            {/* 新HPWeb送信ボタン */}
            <button type="button" className="border border-gray-400 bg-pink-400 px-2 py-0.5 text-[11px] text-left leading-tight hover:bg-pink-500 text-black">
              新HPWeb送信<br />
              （モデル一覧順<br />
              最後尾になる）
            </button>

            {/* 勤務形態 */}
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-[11px]">勤務形態</span>
              <button type="button" className="w-[18px] h-[18px] bg-gray-200 border border-gray-400 hover:bg-gray-300 flex items-center justify-center">
                <Settings className="w-3 h-3" />
              </button>
            </div>

            {/* A7: 勤務形態ラジオボタン（出稼ぎは下の独立チェックボックスで選択） */}
            <div className="border border-gray-400 bg-white px-1 py-0.5 mt-0.5">
              <div className="flex flex-col text-[11px] leading-tight">
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'regular'} onChange={() => setWorkStyle('regular')} /><span className="ml-0.5">1 レギュラー</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'semi-regular'} onChange={() => setWorkStyle('semi-regular')} /><span className="ml-0.5">2 準レギュラー</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'last-minute'} onChange={() => setWorkStyle('last-minute')} /><span className="ml-0.5">3 直前</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'newbie'} onChange={() => setWorkStyle('newbie')} /><span className="ml-0.5">4 新人</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'emergency'} onChange={() => setWorkStyle('emergency')} /><span className="ml-0.5">5 緊急</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'irregular'} onChange={() => setWorkStyle('irregular')} /><span className="ml-0.5">6 不定期</span></label>
                <label className="flex items-center"><input type="radio" name="workStyle" className="w-3 h-3" checked={workStyle === 'retired'} onChange={() => setWorkStyle('retired')} /><span className="ml-0.5">7 退店</span></label>
              </div>
            </div>

            {/* A7/A8: 出稼ぎ（独立したラジオボタン相当の選択肢として配置） */}
            <div className="border border-orange-300 bg-orange-50 px-1 py-0.5 mt-1">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-orange-500"
                  checked={isDekasegi}
                  onChange={(e) => setWorkStyle(e.target.checked ? 'dekasegi' : null)}
                />
                <span className="text-[11px] font-bold text-orange-700">出稼ぎ</span>
              </label>
            </div>

            {/* A8: 出稼ぎON時の詳細入力 */}
            {isDekasegi && (
              <div className="border border-blue-400 bg-blue-50 px-1 py-1 mt-0.5 flex flex-col gap-0.5">
                <div className="text-[10px] text-blue-700 font-bold mb-0.5">出稼ぎ情報</div>
                <div className="flex items-center gap-1">
                  <span className="w-[68px] text-right whitespace-nowrap text-[11px]">交通費支給</span>
                  <input
                    type="text"
                    className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400"
                    placeholder="¥"
                    value={transportationFee}
                    onChange={(e) => setTransportationFee(e.target.value)}
                  />
                  <span className="text-[11px]">円</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-[68px] text-right whitespace-nowrap text-[11px]">寮費</span>
                  <input
                    type="text"
                    className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400"
                    placeholder="¥"
                    value={dormitoryFee}
                    onChange={(e) => setDormitoryFee(e.target.value)}
                  />
                  <span className="text-[11px]">円</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-[68px] text-right whitespace-nowrap text-[10px]">支給方法</span>
                  <select
                    className="h-[18px] text-[11px] px-0.5 bg-white border border-gray-400"
                    value={transportationMethod}
                    onChange={(e) => setTransportationMethod(e.target.value as TransportationPaymentMethod | '')}
                  >
                    <option value="">選択</option>
                    {(Object.entries(TRANSPORTATION_PAYMENT_METHOD_LABELS) as [TransportationPaymentMethod, string][]).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 右カラム: 併用登録エリア */}
          <div className="flex-1 flex flex-col border border-pink-400 bg-pink-100">
            {/* 併用登録タイトル */}
            <div className="text-center text-[11px] py-0.5 border-b border-pink-400">併用登録</div>

            {/* テーブルヘッダー */}
            <div className="flex text-[11px] border-b border-pink-400">
              <div className="w-[45px] text-center border-r border-pink-400 py-0.5">HSNo</div>
              <div className="flex-1 text-center border-r border-pink-400 py-0.5">ホステス名</div>
              <div className="w-[35px] text-center border-r border-pink-400 py-0.5">SNo</div>
              <div className="w-[55px] text-center py-0.5">バック率</div>
            </div>

            {/* テーブル空白行（複数行） */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex border-b border-pink-400">
                <div className="w-[45px] h-[18px] border-r border-pink-400 bg-white"></div>
                <div className="flex-1 h-[18px] border-r border-pink-400 bg-white"></div>
                <div className="w-[35px] h-[18px] border-r border-pink-400 bg-white"></div>
                <div className="w-[55px] h-[18px] bg-white"></div>
              </div>
            ))}

            {/* 併用バック平均・併用所属店舗数 */}
            <div className="flex text-[11px] py-1 px-1">
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">併用バック平均</span>
                <input type="text" className="w-[60px] h-[16px] text-[10px] bg-white border border-gray-400" />
              </div>
              <div className="flex items-center gap-1 ml-4">
                <span className="whitespace-nowrap">併用所属店舗数</span>
                <input type="text" className="w-[60px] h-[16px] text-[10px] bg-white border border-gray-400" />
              </div>
            </div>

            {/* 併用バック率確認・併用所属店舗チェック */}
            <div className="flex text-[11px] px-1 pb-1">
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">併用バック率確認</span>
                <input type="text" className="w-[60px] h-[16px] text-[10px] bg-white border border-gray-400" />
              </div>
              <div className="flex items-center gap-1 ml-4">
                <span className="whitespace-nowrap">併用所属店舗チェック</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下部入力エリア */}
        <div className="flex flex-col gap-0.5 text-[11px] mt-1">
          {/* 併用店内名 */}
          <div className="flex items-center gap-1">
            <input type="text" className="w-[30px] h-[18px] text-[11px] text-center bg-white border border-gray-400" defaultValue="99" />
            <span className="whitespace-nowrap">併用店内名</span>
            <input type="text" className="w-[60px] h-[18px] text-[11px] bg-white border border-gray-400" />
            <input type="text" className="w-[60px] h-[18px] text-[11px] bg-white border border-gray-400" />
          </div>

          {/* 併用店舗行1 */}
          <div className="flex items-center gap-1">
            <span className="w-[70px] text-right pr-1 whitespace-nowrap">併用店舗</span>
            <input type="text" className="w-[30px] h-[18px] text-[11px] bg-white border border-gray-400" />
            <input type="text" className="w-[150px] h-[18px] text-[11px] bg-white border border-gray-400" />
          </div>

          {/* 併用店舗行2 */}
          <div className="flex items-center gap-1">
            <span className="w-[70px] text-right pr-1 whitespace-nowrap">併用店舗</span>
            <input type="text" className="w-[50px] h-[18px] text-[11px] bg-orange-200 border border-gray-400" />
            <input type="text" className="w-[100px] h-[18px] text-[11px] bg-orange-100 border border-gray-400" />
            <span className="whitespace-nowrap">同一併用</span>
            <label className="flex items-center border border-gray-400 bg-white px-1">
              <input type="checkbox" className="w-3 h-3" />
              <span className="ml-0.5">有</span>
            </label>
          </div>

          {/* 自動入力ボタン */}
          <div className="flex items-center gap-1">
            <button type="button" className="h-[18px] px-2 text-[10px] bg-orange-400 border border-gray-400 hover:bg-orange-500 text-white font-bold whitespace-nowrap">自動入力</button>
            <input type="text" className="w-[50px] h-[18px] text-[11px] bg-orange-200 border border-gray-400" />
            <input type="text" className="w-[50px] h-[18px] text-[11px] bg-orange-100 border border-gray-400" />
          </div>
        </div>

        {/* A9: コース料金自動計算（割合制） */}
        <div className="border border-purple-300 bg-purple-50 px-2 py-1 mt-1 text-[11px]">
          <div className="text-[11px] font-bold text-purple-700 mb-1">コース料金 自動計算（割合制）</div>
          {/* ヘッダー */}
          <div className="grid grid-cols-[90px_60px_40px_60px_60px] gap-x-1 text-[10px] text-gray-500 mb-0.5 font-bold">
            <span>項目</span>
            <span>基本料金(¥)</span>
            <span>取分(%)</span>
            <span>ホステス取分</span>
            <span>店舗取分</span>
          </div>
          {/* 特別指名料金 */}
          <div className="grid grid-cols-[90px_60px_40px_60px_60px] gap-x-1 items-center mb-0.5">
            <span className="whitespace-nowrap">特別指名料金</span>
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              placeholder="0"
              value={specialNomination.basePrice}
              onChange={(e) => setSpecialNomination((prev) => ({ ...prev, basePrice: e.target.value }))}
            />
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              value={specialNomination.hostessRatio}
              onChange={(e) => setSpecialNomination((prev) => ({ ...prev, hostessRatio: e.target.value }))}
            />
            <span className="text-right pr-1 font-bold text-purple-700">¥{specialNominationResult.hostess}</span>
            <span className="text-right pr-1 font-bold text-gray-600">¥{specialNominationResult.store}</span>
          </div>
          {/* クラス加算金 */}
          <div className="grid grid-cols-[90px_60px_40px_60px_60px] gap-x-1 items-center mb-0.5">
            <span className="whitespace-nowrap">クラス加算金</span>
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              placeholder="0"
              value={classBonus.basePrice}
              onChange={(e) => setClassBonus((prev) => ({ ...prev, basePrice: e.target.value }))}
            />
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              value={classBonus.hostessRatio}
              onChange={(e) => setClassBonus((prev) => ({ ...prev, hostessRatio: e.target.value }))}
            />
            <span className="text-right pr-1 font-bold text-purple-700">¥{classBonusResult.hostess}</span>
            <span className="text-right pr-1 font-bold text-gray-600">¥{classBonusResult.store}</span>
          </div>
          {/* 延長料金 */}
          <div className="grid grid-cols-[90px_60px_40px_60px_60px] gap-x-1 items-center">
            <span className="whitespace-nowrap">延長料金</span>
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              placeholder="0"
              value={extensionFee.basePrice}
              onChange={(e) => setExtensionFee((prev) => ({ ...prev, basePrice: e.target.value }))}
            />
            <input
              type="text"
              className="h-[18px] text-[11px] px-1 bg-white border border-gray-400"
              value={extensionFee.hostessRatio}
              onChange={(e) => setExtensionFee((prev) => ({ ...prev, hostessRatio: e.target.value }))}
            />
            <span className="text-right pr-1 font-bold text-purple-700">¥{extensionFeeResult.hostess}</span>
            <span className="text-right pr-1 font-bold text-gray-600">¥{extensionFeeResult.store}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
