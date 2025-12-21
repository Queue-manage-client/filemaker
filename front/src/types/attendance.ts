/**
 * 出勤ステータスの型定義
 */
export type AttendanceStatus = '出勤中' | '休憩中' | '退勤';

/**
 * 出勤管理用スタッフステータスの型定義
 */
export type AttendanceStaffStatus = '出勤' | '退社';

/**
 * 雇用形態の型定義
 */
export type EmploymentType = 'employee' | 'part_time';

/**
 * 雇用形態の表示ラベル
 */
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  employee: '社員',
  part_time: 'アルバイト'
};

/**
 * 色別数量の型定義（バスタオル・備品用）
 */
export interface ColorQuantity {
  /** 青 */
  blue: number;
  /** 赤 */
  red: number;
  /** 黒 */
  black: number;
}

/**
 * 出勤スタッフの型定義
 */
export interface AttendingStaff {
  /** スタッフID */
  id: string;
  /** 雇用形態（employee: 社員, part_time: アルバイト） */
  employmentType: EmploymentType;
  /** スタッフ名 */
  staffName: string;
  /** ステータス（出勤または退社） */
  status: AttendanceStaffStatus;
  /** 数字1 */
  number1: number;
  /** 給与 */
  salary: number;
  /** 回収額 */
  collectionAmount: number;
  /** 預り金 */
  depositAmount: number;
  /** 返金 */
  refundAmount: number;
  /** 高速等 */
  expressway: number;
  /** 調整額 */
  adjustmentAmount: number;
  /** 差引精算額 */
  netSettlementAmount: number;
  /** 数字2 */
  number2: number;
  /** バスタオル（青・赤・黒） */
  bathTowel: ColorQuantity;
  /** 備品（青・赤・黒） */
  equipment: ColorQuantity;
  /** 数字3 */
  number3: number;
  /** 数字4 */
  number4: number;
  /** 数字5 */
  number5: number;
  /** 管理者承認 */
  managerApproval: boolean;
}

/**
 * 出勤ホステスの型定義
 */
export interface AttendingHostess {
  /** ホステスID */
  id: string;
  /** ホステス名 */
  hostessName: string;
  /** 出勤時刻 */
  startTime: string;
  /** 退勤予定時刻 */
  endTime?: string;
  /** 現在のステータス */
  status: AttendanceStatus;
  /** 勤務店舗 */
  store: string;
  /** 今日の売上 */
  todaySales: number;
  /** 備考 */
  notes?: string;
  /** 送り場所 (Item 72) */
  sendLocation?: string;
  /** 交通費 (Item 72) */
  transportationFee?: number;
  /** 雑費 (Item 72) */
  miscExpenses?: number;
  /** 預り金 (Item 72) */
  hostessDeposit?: number;
  /** 支払額 (Item 72) */
  paymentAmount?: number;
  /** 支払済み (Item 72) */
  isPaid?: boolean;
  /** 精算済み (Item 71) */
  isSettled?: boolean;
  /** 送信済み (Item 71) */
  isSent?: boolean;
}
