// キャストデータの型定義
export interface TodayCastData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  homeTime: string;
  deliverPlace: string;
  achieve: string;
  finalCustomer: string;
  finalCustomerTime?: string; // 最終接客の予定時刻
  nowCustomer: string;
  nowCustomerTime?: string; // 接客中の開始時刻
  inDriverMoving: string;
  next1: string;
  next2: string;
  next3: string;
  next4: string;
  next5: string;
  remark: string;
  special: string;
  ngPlace: string;
  waitTime: string;
  webStatus: string;
  mode: string;
  ranking: string;
  concurrent?: string; // 併用
  deliverCount?: string; // 送場所実績の数値
  isAttendanceConfirmed?: boolean; // 出勤確認済みフラグ
  category?: 'VIP' | 'Lady' | 'Girls' | 'SUP' | '新人'; // カテゴリー
  storeColor?: string; // 店舗の背景色
  isNewbie?: boolean; // 新人フラグ
  newbieStartDate?: string; // 新人開始日 (例: "2026-03-25")
  hasGuarantee?: boolean; // 保証有無
  guaranteeRemaining?: number; // 保証残金
  weeklyRemarks?: string; // 週間備考
  workStyle?: string; // 勤務形態
  manager?: string; // 担当者
  store?: string; // 所属店舗
  luggageDetails?: string; // 預り荷物の詳細（例：「紙袋1、ポーチ1」）
}
