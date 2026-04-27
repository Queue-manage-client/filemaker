'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, ShieldAlert, MapPinOff, UserX, X, Ban } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type InputMode = 'schedule' | 'email';

interface AttendanceEntry {
  id: number;
  lastName: string;
  firstName: string;
  status: string;
  startTime: string;
  endTime: string;
  type: string;
  selected: boolean;
  inputMode: InputMode;
  confirmed: boolean;
}

// 出勤希望アルバイトデータ
const initialAttendanceData: AttendanceEntry[] = [
  { id: 1, lastName: '松尾', firstName: '久御', status: '希望', startTime: '9:00', endTime: '23:00', type: 'ドライバ', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 2, lastName: '土居4', firstName: '近江', status: '希望', startTime: '9:00', endTime: '4:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: false },
  { id: 3, lastName: '運村', firstName: '4 堺', status: '希望', startTime: '9:00', endTime: '4:00', type: 'ドライバ', selected: true, inputMode: 'schedule', confirmed: true },
  { id: 4, lastName: '中蔵', firstName: '5 回阪', status: '希望', startTime: '12:00', endTime: '20:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: false },
  { id: 5, lastName: '八塚', firstName: '4佐根', status: '希望', startTime: '18:00', endTime: '4:00', type: 'ドライバ', selected: true, inputMode: 'schedule', confirmed: true },
  { id: 6, lastName: '伊垣', firstName: '4 伏', status: '希望', startTime: '10:00', endTime: '20:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: false },
  { id: 7, lastName: '須賀', firstName: '5上', status: '希望', startTime: '18:00', endTime: '4:00', type: 'ドライバ', selected: true, inputMode: 'schedule', confirmed: true },
  { id: 8, lastName: '水畑', firstName: '7 山', status: '希望', startTime: '18:00', endTime: '23:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: true },
  { id: 9, lastName: '大芦', firstName: '翔太', status: '希望', startTime: '11:00', endTime: '20:00', type: '内勤', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 10, lastName: '大谷', firstName: '大翔', status: '出勤', startTime: '12:00', endTime: '17:30', type: '内勤', selected: false, inputMode: 'email', confirmed: false },
  { id: 11, lastName: '岸本', firstName: '礼人', status: '', startTime: '', endTime: '', type: 'スタッフ', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 12, lastName: '横田', firstName: '武', status: '希望', startTime: '8:00', endTime: '16:00', type: 'スタッフ', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 13, lastName: '田中', firstName: '健太', status: '希望', startTime: '10:00', endTime: '18:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: false },
  { id: 14, lastName: '佐藤', firstName: '裕二', status: '出勤', startTime: '13:00', endTime: '21:00', type: 'ドライバ', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 15, lastName: '鈴木', firstName: '慎吾', status: '希望', startTime: '9:00', endTime: '17:00', type: '内勤', selected: true, inputMode: 'email', confirmed: false },
  { id: 16, lastName: '高橋', firstName: '誠', status: '希望', startTime: '14:00', endTime: '22:00', type: 'ドライバ', selected: false, inputMode: 'schedule', confirmed: true },
  { id: 17, lastName: '渡辺', firstName: '勇気', status: '希望', startTime: '18:00', endTime: '2:00', type: 'ドライバ', selected: false, inputMode: 'email', confirmed: false },
  { id: 18, lastName: '伊藤', firstName: '大介', status: '出勤', startTime: '11:00', endTime: '19:00', type: 'スタッフ', selected: true, inputMode: 'schedule', confirmed: true },
];

// NG顧客データ（ホステス→顧客NG & 顧客→ホステスNG）
interface NGCustomerData {
  customerId: string;
  customerName: string;
  hostessName: string;
  ngType: 'hostess_to_customer' | 'customer_to_hostess' | 'both';
  reason: string;
  severity: 'critical' | 'high' | 'medium';
  registeredDate: string;
}

const ngCustomerData: NGCustomerData[] = [
  { customerId: '63691', customerName: 'ダテ', hostessName: 'うるる', ngType: 'hostess_to_customer', reason: '過去にトラブルあり', severity: 'critical', registeredDate: '2025-01-15' },
  { customerId: '28139', customerName: 'タナカ', hostessName: 'かりん', ngType: 'customer_to_hostess', reason: '顧客からの拒否', severity: 'high', registeredDate: '2025-02-20' },
  { customerId: '72851', customerName: 'サイトウ', hostessName: '美咲', ngType: 'both', reason: '相互拒否', severity: 'critical', registeredDate: '2025-03-10' },
];

// NGエリアデータ
interface NGAreaData {
  hostessName: string;
  ngAreas: { areaName: string; reason: string; severity: 'critical' | 'high' | 'medium' }[];
}

const ngAreaData: NGAreaData[] = [
  { hostessName: 'うるる', ngAreas: [
    { areaName: '南心', reason: '自宅付近のため', severity: 'critical' },
    { areaName: '烏丸今出川', reason: '個人的理由', severity: 'medium' },
  ]},
  { hostessName: 'さくら', ngAreas: [
    { areaName: '京都', reason: '以前のトラブル', severity: 'high' },
  ]},
  { hostessName: '美咲', ngAreas: [
    { areaName: '南心', reason: '知人在住エリア', severity: 'high' },
  ]},
];

// 予約データ（NG情報付き）
interface ReservationWithNG {
  id: string;
  name1: string;
  name2: string;
  startTime: string;
  type1: string;
  type2: string;
  endTime: string;
  location: string;
  store: string;
  color: string;
  hasNGCustomer?: boolean;
  hasNGArea?: boolean;
  ngCustomerInfo?: NGCustomerData;
  ngAreaInfo?: { areaName: string; reason: string; severity: 'critical' | 'high' | 'medium' };
}

const reservationData: ReservationWithNG[] = [
  { id: '63691', name1: 'ダテ', name2: 'うるる', startTime: '1:10', type1: 'RH', type2: 'GIRL', endTime: '2:30', location: '南心', store: 'マイスクラブ(芸川', color: 'pink', hasNGCustomer: true, hasNGArea: true },
  { id: '28139', name1: 'タナカ', name2: 'ミノア', startTime: '1:30', type1: 'S', type2: 'LADY', endTime: '3:30', location: '南心', store: 'ファインガーデン', color: 'pink', hasNGCustomer: true },
  { id: '61610', name1: 'ナガイ', name2: '知里', startTime: '2:00', type1: '確S', type2: 'Stand', endTime: '4:00', location: '南心', store: '', color: 'blue' },
  { id: '45237', name1: 'ヤマダ', name2: 'さくら', startTime: '19:00', type1: 'S', type2: 'GIRL', endTime: '21:00', location: '京都', store: 'クラブエレガンス', color: 'pink', hasNGArea: true },
  { id: '72851', name1: 'サイトウ', name2: '美咲', startTime: '20:30', type1: 'RH', type2: 'LADY', endTime: '22:30', location: '南心', store: 'ラウンジ桜', color: 'blue', hasNGCustomer: true, hasNGArea: true },
  { id: '89214', name1: 'イトウ', name2: 'あやの', startTime: '22:00', type1: '確S', type2: 'Stand', endTime: '0:00', location: '京都', store: 'ナイトクラブMIX', color: 'pink' },
];

// 所属事務所変更データ
const officeChangeData = [
  { id: 1, checkboxes: [false, false, false, false], number: 46, area: '京都', type: 'G', name: 'かりん', count: 2, status: '終了' },
  { id: 2, checkboxes: [false, false, false, false], number: 23, area: '大阪', type: 'L', name: 'みゆき', count: 1, status: '待機' },
  { id: 3, checkboxes: [false, false, false, false], number: 38, area: '南心', type: 'G', name: 'あかり', count: 3, status: '移動中' },
  { id: 4, checkboxes: [false, false, false, false], number: 15, area: '京都', type: 'L', name: 'さくら', count: 1, status: '終了' },
  { id: 5, checkboxes: [true, false, false, false], number: 52, area: '神戸', type: 'G', name: 'ゆうな', count: 4, status: '待機' },
  { id: 6, checkboxes: [false, true, false, false], number: 31, area: '奈良', type: 'L', name: 'まい', count: 2, status: '終了' },
  { id: 7, checkboxes: [false, false, true, false], number: 67, area: '京都', type: 'G', name: 'りこ', count: 1, status: '移動中' },
  { id: 8, checkboxes: [false, false, false, true], number: 19, area: '大阪', type: 'L', name: 'ひな', count: 3, status: '待機' },
  { id: 9, checkboxes: [true, true, false, false], number: 44, area: '南心', type: 'G', name: 'あおい', count: 2, status: '終了' },
  { id: 10, checkboxes: [false, false, true, true], number: 28, area: '神戸', type: 'L', name: 'ここな', count: 1, status: '移動中' },
  { id: 11, checkboxes: [true, false, true, false], number: 55, area: '奈良', type: 'G', name: 'れな', count: 5, status: '待機' },
  { id: 12, checkboxes: [false, true, false, true], number: 12, area: '京都', type: 'L', name: 'なつき', count: 2, status: '終了' },
  { id: 13, checkboxes: [true, true, true, false], number: 73, area: '大阪', type: 'G', name: 'かなで', count: 3, status: '移動中' },
  { id: 14, checkboxes: [false, false, false, false], number: 36, area: '南心', type: 'L', name: 'ゆい', count: 1, status: '待機' },
  { id: 15, checkboxes: [true, false, false, true], number: 61, area: '神戸', type: 'G', name: 'みお', count: 4, status: '終了' },
  { id: 16, checkboxes: [false, true, true, false], number: 8, area: '奈良', type: 'L', name: 'すず', count: 2, status: '移動中' },
  { id: 17, checkboxes: [true, true, false, true], number: 49, area: '京都', type: 'G', name: 'あんな', count: 1, status: '待機' },
  { id: 18, checkboxes: [false, false, true, true], number: 27, area: '大阪', type: 'L', name: 'えま', count: 3, status: '終了' },
  { id: 19, checkboxes: [true, false, true, true], number: 82, area: '南心', type: 'G', name: 'はる', count: 2, status: '移動中' },
  { id: 20, checkboxes: [false, true, true, true], number: 41, area: '神戸', type: 'L', name: 'りん', count: 1, status: '待機' },
  { id: 21, checkboxes: [true, false, false, false], number: 33, area: '京都', type: 'G', name: 'もも', count: 2, status: '終了' },
  { id: 22, checkboxes: [false, true, false, false], number: 58, area: '大阪', type: 'L', name: 'しおり', count: 1, status: '移動中' },
  { id: 23, checkboxes: [false, false, true, false], number: 14, area: '南心', type: 'G', name: 'ふうか', count: 3, status: '待機' },
  { id: 24, checkboxes: [false, false, false, true], number: 71, area: '神戸', type: 'L', name: 'みさき', count: 2, status: '終了' },
  { id: 25, checkboxes: [true, true, false, false], number: 25, area: '奈良', type: 'G', name: 'ちはる', count: 1, status: '移動中' },
  { id: 26, checkboxes: [false, false, true, true], number: 47, area: '京都', type: 'L', name: 'ありさ', count: 4, status: '待機' },
  { id: 27, checkboxes: [true, false, true, false], number: 63, area: '大阪', type: 'G', name: 'めい', count: 2, status: '終了' },
  { id: 28, checkboxes: [false, true, false, true], number: 9, area: '南心', type: 'L', name: 'ゆな', count: 1, status: '移動中' },
  { id: 29, checkboxes: [true, true, true, false], number: 84, area: '神戸', type: 'G', name: 'さな', count: 3, status: '待機' },
  { id: 30, checkboxes: [false, false, false, false], number: 21, area: '奈良', type: 'L', name: 'のあ', count: 2, status: '終了' },
  { id: 31, checkboxes: [true, false, false, true], number: 56, area: '京都', type: 'G', name: 'あいり', count: 1, status: '移動中' },
  { id: 32, checkboxes: [false, true, true, false], number: 39, area: '大阪', type: 'L', name: 'ひより', count: 5, status: '待機' },
  { id: 33, checkboxes: [true, true, false, true], number: 17, area: '南心', type: 'G', name: 'まひろ', count: 2, status: '終了' },
  { id: 34, checkboxes: [false, false, true, true], number: 76, area: '神戸', type: 'L', name: 'ことね', count: 1, status: '移動中' },
  { id: 35, checkboxes: [true, false, true, true], number: 42, area: '奈良', type: 'G', name: 'みなみ', count: 3, status: '待機' },
  { id: 36, checkboxes: [false, true, true, true], number: 68, area: '京都', type: 'L', name: 'せな', count: 2, status: '終了' },
  { id: 37, checkboxes: [true, true, true, true], number: 11, area: '大阪', type: 'G', name: 'ほのか', count: 1, status: '移動中' },
  { id: 38, checkboxes: [false, false, false, false], number: 53, area: '南心', type: 'L', name: 'いろは', count: 4, status: '待機' },
  { id: 39, checkboxes: [true, false, false, false], number: 29, area: '神戸', type: 'G', name: 'つむぎ', count: 2, status: '終了' },
  { id: 40, checkboxes: [false, true, false, false], number: 87, area: '奈良', type: 'L', name: 'あやね', count: 1, status: '移動中' },
  { id: 41, checkboxes: [false, false, true, false], number: 34, area: '京都', type: 'G', name: 'みつき', count: 3, status: '待機' },
  { id: 42, checkboxes: [false, false, false, true], number: 62, area: '大阪', type: 'L', name: 'かのん', count: 2, status: '終了' },
  { id: 43, checkboxes: [true, true, false, false], number: 7, area: '南心', type: 'G', name: 'りお', count: 1, status: '移動中' },
  { id: 44, checkboxes: [false, false, true, true], number: 79, area: '神戸', type: 'L', name: 'ゆあ', count: 5, status: '待機' },
  { id: 45, checkboxes: [true, false, true, false], number: 48, area: '奈良', type: 'G', name: 'まお', count: 2, status: '終了' },
  { id: 46, checkboxes: [false, true, false, true], number: 22, area: '京都', type: 'L', name: 'ここあ', count: 1, status: '移動中' },
];

// 所属事務所データ
const officeAssignmentData = [
  { id: 1, driverArea: '南 和食6', startTime: '17:00', departure: '京都駅八条口', endTime: '22:00', returnTime: '23:30', destination: '鳥丸今出川', staff: '南' },
  { id: 2, driverArea: '北 洋食3', startTime: '18:30', departure: '四条河原町', endTime: '23:00', returnTime: '0:30', destination: '烏丸御池', staff: '北村' },
  { id: 3, driverArea: '東 和食2', startTime: '19:00', departure: '祇園四条', endTime: '1:00', returnTime: '2:00', destination: '三条京阪', staff: '東山' },
];

// 出勤管理データ
const attendanceManagementData = [
  { id: 1, status: '出勤', type: '社員', name: '吉田 峯雅10', startTime: '17:00', endTime: '4:00', statusLabel: '出勤', checkboxes: [true, true], icons: ['✉', '✕', '👤', ''] },
  { id: 2, status: '希望', type: 'アルバイト', name: '田中 一郎', startTime: '18:00', endTime: '2:00', statusLabel: '希望', checkboxes: [true, false], icons: ['✉', '', '👤', '✕'] },
  { id: 3, status: '出勤', type: '社員', name: '佐藤 次郎', startTime: '19:00', endTime: '3:00', statusLabel: '出勤', checkboxes: [true, true], icons: ['✉', '✕', '', ''] },
];

// ポジションデータ（前半）
const positionFirstHalfData = [
  { id: 0, position: '会計', members: [{ name: '', hasAction: true }] },
  { id: 1, position: '配車', members: [{ name: '?63 山岡 嘉和?', hasAction: true }, { name: '', hasAction: true }] },
  { id: 2, position: '京都フロント', members: [{ name: '', hasAction: true }] },
  { id: 3, position: '人妻フロント', members: [{ name: '?15 森川 隆登', hasAction: true }, { name: '', hasAction: true }] },
  { id: 4, position: 'FIRSTフロント', members: [{ name: '?77 植田 武', hasAction: true }, { name: '', hasAction: true }] },
  { id: 5, position: '南ICフロント', members: [{ name: '?54 片山 竜次', hasAction: true }, { name: '', hasAction: true }] },
];

// ポジションデータ（後半）
const positionSecondHalfData = [
  { id: 1, position: '会計', members: [{ name: '?25 松平 篤', hasAction: true }] },
  { id: 2, position: '配車', members: [{ name: '?77 坪平 中尾11', hasAction: true }, { name: '', hasAction: true }] },
  { id: 3, position: '京都フロント', members: [{ name: '?08 杉本 淳', hasAction: true }, { name: '', hasAction: true }] },
  { id: 4, position: '人妻フロント', members: [{ name: '678 中村 南斗', hasAction: true }, { name: '', hasAction: true }] },
  { id: 5, position: 'FIRSTフロント', members: [{ name: '', hasAction: true }] },
  { id: 6, position: '南ICフロント', members: [{ name: '? 汐崎 哲也3', hasAction: true }, { name: '', hasAction: true }] },
];

// スタッフ予定リストデータ
const staffScheduleData = [
  '古田→ラビット話す(割引等)ドメイン変更比、☆前月推迁 南店話す',
  '(次回営業→投入金シメセット→セット)',
  '南☆ よく回る、スタッフの人数出す、空、応時間で手緒列案、シメ確認作不',
  '(南店長、副座05月 2000迄;5決時)',
  '6月度日程発教み',
  'システムの方が会計予定',
  '南→石古遠室不に対象達室大名>前',
  'ドライバ一早畑打ちし半館下さい♪次時',
  '出罰-訓時05H 17:00迄二次時',
  '中林-訓時05H 17:00止前ぷ次時',
];

// 面接予定データ
const interviewScheduleData = [
  { id: 1, time: '15:30', type: '入店', location: 'セブンイレブン新町一条店', position: 'ホステス', staff: '南 和宣6' },
  { id: 2, time: '17:00', type: '面接', location: '京都駅八条口', position: 'ドライバ', staff: '北村 太郎' },
];

export default function TehaiPage() {
  React.useEffect(() => {
    document.title = '手配表 - Dispatch Harmony Hub';
  }, []);

  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>(initialAttendanceData);
  const [attendanceInputMode, setAttendanceInputMode] = useState<InputMode>('schedule');

  // NG警告関連の状態
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithNG | null>(null);
  const [showNGWarningDialog, setShowNGWarningDialog] = useState(false);
  const [showNGConfirmDialog, setShowNGConfirmDialog] = useState(false);

  // 予約データにNG情報を付与
  const reservationsWithNGInfo = useMemo(() => {
    return reservationData.map(res => {
      const ngCustomer = ngCustomerData.find(ng =>
        ng.customerId === res.id || ng.customerName === res.name1
      );
      const ngArea = ngAreaData.find(ng =>
        ng.hostessName === res.name2
      )?.ngAreas.find(area => area.areaName === res.location);

      return {
        ...res,
        hasNGCustomer: !!ngCustomer,
        hasNGArea: !!ngArea,
        ngCustomerInfo: ngCustomer,
        ngAreaInfo: ngArea,
      };
    });
  }, []);

  // 予約クリック時のハンドラー
  const handleReservationClick = (reservation: ReservationWithNG) => {
    setSelectedReservation(reservation);
    if (reservation.hasNGCustomer || reservation.hasNGArea) {
      setShowNGWarningDialog(true);
    }
  };

  // NG警告を無視して続行
  const handleProceedWithNG = () => {
    setShowNGWarningDialog(false);
    setShowNGConfirmDialog(true);
  };

  // NG確認ダイアログで続行
  const handleConfirmProceed = () => {
    setShowNGConfirmDialog(false);
    // ここで予約処理を続行
    alert(`予約 ${selectedReservation?.id} の処理を続行します（NG警告を確認済み）`);
    setSelectedReservation(null);
  };

  // 重要度に応じた色を取得
  const getSeverityColor = (severity: 'critical' | 'high' | 'medium') => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
    }
  };

  const getSeverityLabel = (severity: 'critical' | 'high' | 'medium') => {
    switch (severity) {
      case 'critical': return '最重要';
      case 'high': return '重要';
      case 'medium': return '注意';
    }
  };

  const handleConfirm = (id: number) => {
    setAttendanceData((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, confirmed: !entry.confirmed } : entry
      )
    );
  };

  const visibleAttendance = attendanceData.filter(
    (entry) => attendanceInputMode === 'schedule' || entry.inputMode === 'email'
  );

  return (
    <div className="w-full min-w-[1400px] h-screen min-h-[800px] relative bg-white flex flex-col text-[11px]">
      {/* ヘッダー */}
      <div className="w-full h-[38px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-1">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-7 px-2 text-[11px] flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              ダッシュボードに戻る
            </Button>
          </Link>

          <div className="flex-1 flex items-center justify-center gap-1">
            <h1 className="text-base font-bold mr-1">手配表</h1>

            <Button
              variant="outline"
              className="h-7 px-2 text-[11px] border-black"
              onClick={() => {}}
            >
              日付移動
            </Button>

            <Button
              className="h-7 px-3 text-[11px] bg-lime-400 hover:bg-lime-500 text-black border border-black"
              onClick={() => {}}
            >
              ドライバ精算
            </Button>

            <Link href="/customer-ledger">
              <Button
                variant="outline"
                className="h-7 px-3 text-[11px] border-black"
              >
                新顧客検索
              </Button>
            </Link>

            <Link href="/rt2-panel">
              <Button
                className="h-7 px-3 text-[11px] bg-purple-400 hover:bg-purple-500 text-black border border-black"
              >
                RT IIパネル
              </Button>
            </Link>

            <Button
              className="h-7 px-3 text-[11px] bg-orange-400 hover:bg-orange-500 text-black border border-black"
              onClick={() => {}}
            >
              RTパネル
            </Button>

            <Link href="/dispatch-panel-2d">
              <Button
                className="h-7 px-3 text-[11px] bg-amber-200 hover:bg-amber-300 text-black border border-black"
              >
                配車パネル
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-7 px-3 text-[11px] border-black"
              onClick={() => {}}
            >
              Menu
            </Button>

            <Button
              className="h-7 px-3 text-[11px] bg-cyan-300 hover:bg-cyan-400 text-black border border-black"
              onClick={() => {}}
            >
              チャット表示
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左1列目: 所属事務所変更 */}
        <div className="h-full border-r border-gray-400 w-[260px] bg-white flex flex-col">
          <div className="border-b border-gray-400 py-0.5 px-1">
            <a href="#" className="text-blue-600 underline font-bold text-[11px]">所属事務所変更</a>
          </div>
          <div className="flex items-center border-b border-gray-400 text-[10px] bg-gray-100 font-bold">
            <div className="w-4 text-center border-r border-gray-300">デ</div>
            <div className="w-4 text-center border-r border-gray-300">ホ</div>
            <div className="w-6 text-center border-r border-gray-300 text-[9px]">シフト</div>
            <div className="w-6 text-center border-r border-gray-300"></div>
            <div className="w-10 text-center border-r border-gray-300"></div>
            <div className="w-6 text-center border-r border-gray-300"></div>
            <div className="flex-1 border-r border-gray-300"></div>
            <div className="w-10 text-center"></div>
          </div>
          <div className="flex-1 overflow-y-scroll">
            {officeChangeData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[11px] bg-white">
                {data.checkboxes.map((checked, idx) => {
                  if (idx === 2) return null;
                  return (
                    <div key={idx} className="w-4 text-center border-r border-gray-300">
                      <input type="checkbox" className="w-3 h-3" defaultChecked={checked} />
                    </div>
                  );
                })}
                <div className="w-6 text-center border-r border-pink-300 bg-pink-100 font-bold">{data.number}</div>
                <div className="w-10 text-center border-r border-pink-300 bg-pink-100">{data.area}</div>
                <div className="w-6 text-center border-r border-gray-300 font-bold rounded-sm bg-gradient-to-b from-white via-gray-100 to-gray-200 border border-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.2)]">{data.type}</div>
                <div className="flex-1 flex items-center border-r border-gray-300 rounded-sm bg-gradient-to-b from-white via-gray-100 to-gray-200 border border-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.2)]">
                  <span className="flex-1 text-[11px] text-blue-600">{data.name}</span>
                  <span className="w-5 text-center text-[11px] font-bold border-l border-gray-400">{data.count}</span>
                </div>
                <div className="w-10 text-center bg-gray-200 text-[10px]">{data.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 左2列目: 所属事務所 */}
        <div className="h-full border-r border-gray-400 w-[380px] bg-white flex flex-col">
          <div className="border-b border-gray-400 px-1 bg-gray-100">
            <span className="border border-gray-600 px-1 py-0 text-[10px]">所属事務所:</span>
          </div>
          <div className="flex-1 overflow-y-scroll">
            <div className="flex items-center border-b border-gray-400 text-[10px] bg-gray-100 font-bold sticky top-0 z-10">
              <div className="w-5 text-center border-r border-gray-300"></div>
              <div className="w-14 text-center border-r border-gray-300">迎えドライバ</div>
              <div className="w-10 text-center border-r border-gray-300"></div>
              <div className="flex-1 text-center border-r border-gray-300">出発支場所</div>
              <div className="w-10 text-center border-r border-gray-300">終了</div>
              <div className="w-10 text-center border-r border-gray-300">帰宅</div>
              <div className="w-[65px] text-center border-r border-gray-300">送り場所</div>
              <div className="w-10 text-center">担当者</div>
            </div>
            {officeAssignmentData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[11px] bg-white">
                <div className="w-5 text-center border-r border-gray-300 bg-lime-400 font-bold">{data.id}</div>
                <div className="w-14 border-r border-gray-300 truncate" title={data.driverArea}>{data.driverArea}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.startTime}</div>
                <div className="flex-1 border-r border-gray-300 truncate" title={data.departure}>{data.departure}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.endTime}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.returnTime}</div>
                <div className="w-[65px] border-r border-gray-300 truncate" title={data.destination}>{data.destination}</div>
                <div className="w-10 text-center truncate" title={data.staff}>{data.staff}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 左3列目: 出勤管理テーブル */}
        <div className="h-full border-r border-gray-400 w-[400px] bg-white flex flex-col">
          <div className="flex-1 overflow-y-scroll">
            {attendanceManagementData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[11px] bg-white">
                <div className="w-4 text-center border-r border-gray-300 bg-blue-600 text-white font-bold">{data.id}</div>
                <div className="w-9 text-center border-r border-gray-300 bg-lime-400">{data.status}</div>
                <div className="w-[72px] text-center border-r border-gray-300 bg-lime-400">{data.type}</div>
                <div className="w-22 border-r border-gray-300 truncate" title={data.name}>{data.name}</div>
                <div className="w-11 text-center border-r border-gray-300 text-blue-600 font-bold">{data.startTime}</div>
                <div className="w-11 text-center border-r border-gray-300">{data.endTime}</div>
                <div className="w-[36px] text-center border-r border-gray-300 bg-lime-400 text-[10px]">{data.statusLabel}</div>
                <div className="w-10 flex items-center justify-center gap-0.5 border-r border-gray-300">
                  {data.checkboxes.map((checked, idx) => (
                    <input key={idx} type="checkbox" className="w-3 h-3" defaultChecked={checked} />
                  ))}
                </div>
                <div className="w-20 flex items-center gap-0.5">
                  {data.icons.map((icon, idx) => (
                    <div key={idx} className={`w-4 h-4 flex items-center justify-center text-[10px] ${
                      icon === '✉' ? 'bg-lime-400' :
                      icon === '✕' ? 'bg-gray-200' :
                      icon === '👤' ? 'bg-pink-300' :
                      'border border-gray-400 bg-white'
                    }`}>
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右コラム */}
        <div className="h-full border-r border-gray-400 flex-1 grid grid-rows-[55%_23%_22%]" style={{ gridTemplateColumns: '35% calc(30% + 16px) calc(35% - 116px) 100px' }}>
          {/* ポジションブロック */}
          <div className="row-span-2 border-r border-gray-400 bg-white flex flex-col text-[11px]">
            <div className="text-center text-blue-600 font-bold border-b border-gray-400 py-0.5">ポジション</div>
            <div className="text-center border-b border-gray-400 py-0">
              <span className="text-pink-500 text-[10px]">（配車3区目は責任者）</span>
            </div>
            <div className="flex flex-1">
              {/* 前半列 */}
              <div className="w-1/2 flex flex-col border-r border-gray-400">
                <div className="text-center border-b border-gray-400 bg-gray-100 py-0">前半</div>
                <div className="flex-1 flex flex-col px-0.5 py-0.5 overflow-y-scroll">
                  {positionFirstHalfData.map((position) => (
                    <div key={position.id} className="mb-1">
                      <div className={`text-center mb-0.5 ${position.position === '配車' ? 'font-bold' : ''}`}>
                        {position.position}
                      </div>
                      <div className="border border-gray-800">
                        {position.members.map((member, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between h-4 px-0.5 ${
                              member.name ? 'bg-white' : 'bg-gray-200'
                            } ${idx < position.members.length - 1 ? 'border-b border-gray-300' : ''}`}
                          >
                            {member.name && <span>{member.name}</span>}
                            {member.hasAction && (
                              <div className="w-3 h-3 rounded-full bg-pink-500 flex items-center justify-center ml-auto">
                                <span className="text-white text-[9px] leading-none">×</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 後半列 */}
              <div className="w-1/2 flex flex-col">
                <div className="text-center border-b border-gray-400 bg-gray-100 py-0">後半</div>
                <div className="flex-1 flex flex-col px-0.5 py-0.5 overflow-y-scroll">
                  {positionSecondHalfData.map((position) => (
                    <div key={position.id} className="mb-1">
                      <div className={`text-center mb-0.5 ${position.position === '会計' || position.position === '配車' ? 'font-bold' : ''}`}>
                        {position.position}
                      </div>
                      <div className="border border-gray-800">
                        {position.members.map((member, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between h-4 px-0.5 ${
                              member.name ? 'bg-white' : 'bg-gray-200'
                            } ${idx < position.members.length - 1 ? 'border-b border-gray-300' : ''}`}
                          >
                            {member.name && <span>{member.name}</span>}
                            {member.hasAction && (
                              <div className="w-3 h-3 rounded-full bg-pink-500 flex items-center justify-center ml-auto">
                                <span className="text-white text-[9px] leading-none">×</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 下部セクション */}
            <div className="border-t border-gray-400">
              <div className="flex">
                <div className="w-1/2 border-r border-gray-400 px-0.5 py-0.5">
                  <div className="text-center text-[10px] mb-0.5">有給使用者及び給引き者</div>
                  <div className="border border-gray-800">
                    <div className="flex items-center justify-end h-4 bg-gray-200 px-0.5">
                      <div className="w-3 h-3 rounded-full bg-pink-500 flex items-center justify-center">
                        <span className="text-white text-[9px] leading-none">×</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 px-0.5 py-0.5">
                  <div className="text-center text-[10px] mb-0.5">南IC会計</div>
                  <div className="border border-gray-800">
                    <div className="flex items-center justify-end h-4 bg-gray-200 px-0.5">
                      <div className="w-3 h-3 rounded-full bg-pink-500 flex items-center justify-center">
                        <span className="text-white text-[9px] leading-none">×</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 出勤希望アルバイト（シアン） */}
          <div className="border-r border-gray-400 bg-cyan-300 flex flex-col">
            {/* 一括ボタン行 */}
            <div className="flex gap-1 justify-center items-center py-0.5 border-b border-gray-400">
              <button className="px-2 py-0.5 bg-blue-100 border border-gray-800 text-black text-[11px] font-bold">
                ⬇ 一括戻す ⬇
              </button>
              <button className="px-2 py-0.5 bg-blue-100 border border-gray-800 text-black text-[11px] font-bold">
                ⬇ 一括移動 ⬇
              </button>
            </div>
            {/* タイトル＋モード切替タブ */}
            <div className="flex items-center border-b border-gray-800 bg-cyan-300">
              <div className="flex-1 text-center font-normal text-[11px] py-0.5">出勤希望アルバイト</div>
              <div className="flex border-l border-gray-600">
                <button
                  onClick={() => setAttendanceInputMode('schedule')}
                  className={`px-1.5 py-0.5 text-[10px] border-r border-gray-600 font-bold ${
                    attendanceInputMode === 'schedule'
                      ? 'bg-white text-black'
                      : 'bg-cyan-200 text-gray-600'
                  }`}
                >
                  基本
                </button>
                <button
                  onClick={() => setAttendanceInputMode('email')}
                  className={`px-1.5 py-0.5 text-[10px] font-bold ${
                    attendanceInputMode === 'email'
                      ? 'bg-white text-black'
                      : 'bg-cyan-200 text-gray-600'
                  }`}
                >
                  メール
                </button>
              </div>
            </div>
            {/* カラムヘッダー */}
            <div className="flex items-center bg-cyan-300 text-black text-[10px] border-b border-gray-600">
              <div className="w-5 text-center border-r border-gray-400"></div>
              <div className="flex-1 border-r border-gray-400 px-0.5">氏名</div>
              <div className="w-8 text-center border-r border-gray-400">状態</div>
              <div className="w-8 text-center border-r border-gray-400">出勤</div>
              <div className="w-8 text-center border-r border-gray-400">退社</div>
              <div className="w-10 text-center border-r border-gray-400">配務</div>
              {attendanceInputMode === 'email' && (
                <div className="w-10 text-center">確認</div>
              )}
            </div>
            <div className="flex-1 overflow-y-scroll bg-cyan-300">
              <table className="w-full border-collapse">
                <tbody>
                  {visibleAttendance.map((data) => (
                    <tr
                      key={data.id}
                      className={
                        data.selected
                          ? 'bg-blue-400'
                          : attendanceInputMode === 'email' && data.confirmed
                          ? 'bg-green-100'
                          : 'bg-white'
                      }
                    >
                      <td className="text-center border-b border-r border-gray-400 w-5 text-[10px]">{data.id}</td>
                      <td className="border-b border-r border-gray-400 text-[10px] px-0.5">
                        {data.lastName}{data.firstName}
                      </td>
                      <td className="text-center border-b border-r border-gray-400 text-[10px] w-8">{data.status}</td>
                      <td className="text-center border-b border-r border-gray-400 text-[10px] w-8">{data.startTime}</td>
                      <td className="text-center border-b border-r border-gray-400 text-[10px] w-8">{data.endTime}</td>
                      <td className="border-b border-r border-gray-400 text-[10px] w-10">{data.type}</td>
                      {attendanceInputMode === 'email' && (
                        <td className="border-b border-gray-400 text-center w-10">
                          {data.confirmed ? (
                            <span className="text-[9px] text-green-700 font-bold">済</span>
                          ) : (
                            <button
                              onClick={() => handleConfirm(data.id)}
                              className="px-1 py-0 text-[9px] bg-orange-400 hover:bg-orange-500 text-white border border-orange-600 leading-tight"
                            >
                              確認
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* スタッフ予定リスト（黄色） */}
          <div className="col-span-2 bg-white flex flex-col">
            <div className="bg-yellow-300 text-black text-center py-0.5 text-[11px] font-bold">
              ▲スタッフ予定リスト
            </div>
            <div className="flex-1 overflow-y-scroll text-[11px] relative" style={{
              background: 'repeating-linear-gradient(to bottom, #d4f1d4 0px, #d4f1d4 20px, white 20px, white 40px)',
              lineHeight: '10px'
            }}>
              {staffScheduleData.map((text, idx) => (
                <div key={idx} className="px-1 overflow-hidden whitespace-nowrap" style={{ height: '10px' }}>
                  {text}
                </div>
              ))}
              <div style={{ height: '100px' }}></div>
            </div>
          </div>

          {/* 2行目 - 2列目: 予約 */}
          <div className="col-span-2 border-t border-gray-400 border-r border-gray-400 bg-white flex flex-col">
            <div className="bg-gray-300 text-black text-center py-0 text-[11px] border-b border-gray-400 flex items-center justify-center gap-2">
              <span>予約</span>
              {reservationsWithNGInfo.filter(r => r.hasNGCustomer || r.hasNGArea).length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  NG警告 {reservationsWithNGInfo.filter(r => r.hasNGCustomer || r.hasNGArea).length}件
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-scroll">
              {reservationsWithNGInfo.map((res, index) => {
                const hasNG = res.hasNGCustomer || res.hasNGArea;
                const maxSeverity = res.ngCustomerInfo?.severity === 'critical' || res.ngAreaInfo?.severity === 'critical'
                  ? 'critical'
                  : res.ngCustomerInfo?.severity === 'high' || res.ngAreaInfo?.severity === 'high'
                  ? 'high'
                  : 'medium';

                return (
                  <div
                    key={index}
                    onClick={() => handleReservationClick(res)}
                    className={`flex items-center text-[11px] border-b cursor-pointer hover:opacity-80 transition-all ${
                      hasNG
                        ? maxSeverity === 'critical'
                          ? 'bg-red-200 border-red-400 border-2 animate-pulse'
                          : maxSeverity === 'high'
                          ? 'bg-orange-200 border-orange-400 border-2'
                          : 'bg-yellow-100 border-yellow-400'
                        : `border-gray-300 ${res.color === 'pink' ? 'bg-pink-200' : 'bg-blue-200'}`
                    }`}
                    style={{ height: hasNG ? '24px' : '20px' }}
                  >
                    {/* NG警告アイコン */}
                    <div className="w-[20px] flex items-center justify-center">
                      {hasNG && (
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          maxSeverity === 'critical' ? 'bg-red-600' : maxSeverity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}>
                          <ShieldAlert className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="w-[34px] text-center">{res.id}</div>
                    <div className={`w-[38px] text-left ${res.hasNGCustomer ? 'font-bold text-red-700' : ''}`}>
                      {res.name1}
                      {res.hasNGCustomer && <UserX className="w-3 h-3 inline ml-0.5 text-red-600" />}
                    </div>
                    <div className="w-[38px] text-left">{res.name2}</div>
                    <div className="w-[26px] text-center">{res.startTime}</div>
                    <div className="w-[26px] text-center">{res.type1}</div>
                    <div className="w-[34px] text-center">{res.type2}</div>
                    <div className="w-[26px] text-center">{res.endTime}</div>
                    <div className={`w-[28px] text-center ${res.hasNGArea ? 'font-bold text-red-700' : ''}`}>
                      {res.location}
                      {res.hasNGArea && <MapPinOff className="w-3 h-3 inline ml-0.5 text-red-600" />}
                    </div>
                    <div className="flex-1 text-left pl-1 flex items-center gap-1">
                      {res.store}
                      {hasNG && (
                        <span className={`ml-auto mr-1 px-1 py-0.5 rounded text-[8px] font-bold ${getSeverityColor(maxSeverity)}`}>
                          {res.hasNGCustomer && res.hasNGArea ? 'NG客+エリア' : res.hasNGCustomer ? 'NG客' : 'NGエリア'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2行目 - 3列目: クイックメニュー（2行分） */}
          <div className="row-span-2 border-t border-gray-400 bg-gray-200 flex flex-col">
            <div className="bg-gray-400 text-black text-center py-0.5 text-[11px] font-bold">
              クイック
            </div>
            <div className="flex-1 p-0.5 overflow-y-scroll">
              <button className="w-full mb-0.5 px-1 py-1 bg-red-400 text-black text-[11px] border border-gray-600">緊急連絡</button>
              <button className="w-full mb-0.5 px-1 py-1 bg-cyan-300 text-black text-[11px] border border-gray-600">レポート</button>
              <button className="w-full mb-0.5 px-1 py-1 bg-lime-400 text-black text-[11px] border border-gray-600">集計</button>
              <button className="w-full mb-0.5 px-1 py-1 bg-gray-300 text-black text-[11px] border border-gray-600">設定</button>
            </div>
          </div>

          {/* 3行目 - 未定ブロックと予約詳細のコンテナ */}
          <div className="col-span-3 border-t border-gray-400 flex">
            {/* 面接予定ブロック */}
            <div className="w-1/2 border-r border-gray-400 bg-white flex flex-col">
              <div className="bg-blue-400 text-black text-center py-0.5 text-[11px] font-bold">
                面接予定
              </div>
              <div className="flex-1 overflow-y-scroll">
                {interviewScheduleData.map((interview) => (
                  <div key={interview.id} className="bg-white px-1 py-1 border-b border-gray-300">
                    <div className="text-[11px] flex items-center gap-1">
                      <span className="font-bold">{interview.time}</span>
                      <span className="font-semibold">{interview.type}</span>
                      <span>{interview.location}</span>
                      <span className="font-semibold">{interview.position}</span>
                      <span className="ml-auto font-semibold">{interview.staff}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-pink-200 mx-1 mt-2 mb-1" style={{ height: '80px' }}></div>
                <div className="bg-pink-200 mx-1 mb-2" style={{ height: '80px' }}></div>
              </div>
            </div>

            {/* 予約詳細 */}
            <div className="w-1/2 border-r border-gray-400 bg-white flex flex-col">
              <div className="bg-cyan-400 text-black text-center py-0.5 text-[11px] font-bold">
                予約詳細
              </div>
              <div className="flex-1 p-1 overflow-y-scroll text-[11px]">
                <table className="w-full border border-gray-400">
                  <thead className="bg-cyan-200">
                    <tr>
                      <th className="py-0.5 border-b border-gray-400 border-r border-gray-400">時間</th>
                      <th className="py-0.5 border-b border-gray-400 border-r border-gray-400">顧客</th>
                      <th className="py-0.5 border-b border-gray-400 border-r border-gray-400">コース</th>
                      <th className="py-0.5 border-b border-gray-400">店舗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.map((res, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="py-0.5 text-center border-b border-gray-400 border-r border-gray-400">{res.startTime}</td>
                        <td className="py-0.5 text-center border-b border-gray-400 border-r border-gray-400">{res.name1}</td>
                        <td className="py-0.5 text-center border-b border-gray-400 border-r border-gray-400">{res.type2}</td>
                        <td className="py-0.5 text-center border-b border-gray-400">{res.store}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NG警告ダイアログ */}
      <Dialog open={showNGWarningDialog} onOpenChange={setShowNGWarningDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              NG警告
            </DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              {/* 予約情報 */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm font-bold mb-2">予約情報</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">予約ID:</span> {selectedReservation.id}
                  </div>
                  <div>
                    <span className="text-gray-500">時間:</span> {selectedReservation.startTime} - {selectedReservation.endTime}
                  </div>
                  <div>
                    <span className="text-gray-500">顧客:</span> {selectedReservation.name1}
                  </div>
                  <div>
                    <span className="text-gray-500">キャスト:</span> {selectedReservation.name2}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">場所:</span> {selectedReservation.location} - {selectedReservation.store}
                  </div>
                </div>
              </div>

              {/* NG客警告 */}
              {selectedReservation.ngCustomerInfo && (
                <div className={`p-3 rounded-lg border-2 ${
                  selectedReservation.ngCustomerInfo.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : selectedReservation.ngCustomerInfo.severity === 'high'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <UserX className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-700">NG顧客警告</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(selectedReservation.ngCustomerInfo.severity)}`}>
                      {getSeverityLabel(selectedReservation.ngCustomerInfo.severity)}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">NGタイプ:</span>
                      <span className="ml-2 font-medium">
                        {selectedReservation.ngCustomerInfo.ngType === 'hostess_to_customer'
                          ? 'ホステス→顧客NG'
                          : selectedReservation.ngCustomerInfo.ngType === 'customer_to_hostess'
                          ? '顧客→ホステスNG'
                          : '相互NG'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">対象ホステス:</span>
                      <span className="ml-2 font-medium">{selectedReservation.ngCustomerInfo.hostessName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">理由:</span>
                      <span className="ml-2 font-medium text-red-700">{selectedReservation.ngCustomerInfo.reason}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      登録日: {selectedReservation.ngCustomerInfo.registeredDate}
                    </div>
                  </div>
                </div>
              )}

              {/* NGエリア警告 */}
              {selectedReservation.ngAreaInfo && (
                <div className={`p-3 rounded-lg border-2 ${
                  selectedReservation.ngAreaInfo.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : selectedReservation.ngAreaInfo.severity === 'high'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinOff className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-700">NGエリア警告</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(selectedReservation.ngAreaInfo.severity)}`}>
                      {getSeverityLabel(selectedReservation.ngAreaInfo.severity)}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">NGエリア:</span>
                      <span className="ml-2 font-medium text-red-700">{selectedReservation.ngAreaInfo.areaName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">理由:</span>
                      <span className="ml-2 font-medium">{selectedReservation.ngAreaInfo.reason}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 警告メッセージ */}
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  この予約にはNG条件が含まれています
                </div>
                <p className="text-sm text-red-600 mt-2">
                  この予約を進める場合は、上記のNG条件を十分に確認してください。
                  予期せぬトラブルが発生する可能性があります。
                </p>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNGWarningDialog(false);
                    setSelectedReservation(null);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleProceedWithNG}
                  className="flex-1"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  警告を確認して続行
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* NG確認ダイアログ */}
      <AlertDialog open={showNGConfirmDialog} onOpenChange={setShowNGConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              最終確認
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-bold text-red-600">
                この予約にはNG条件が含まれています。
              </p>
              <p>
                本当にこの予約を進めてもよろしいですか？
              </p>
              <p className="text-sm text-gray-500">
                この操作を行うと、NG警告を確認済みとして予約処理が続行されます。
                発生したトラブルについては責任を負いかねます。
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowNGConfirmDialog(false);
              setSelectedReservation(null);
            }}>
              やっぱりキャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmProceed}
              className="bg-red-600 hover:bg-red-700"
            >
              NG確認済みで続行
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
