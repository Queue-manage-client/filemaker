// 共通型定義ファイル
// プロジェクト全体で使用される型を定義

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

// 各カテゴリーの型定義をエクスポート
export * from './accounting';
export * from './customer';
export * from './hostess';
export * from './employee';
export * from './area-division';
export * from './hotel-division';

// dispatch-extendedの型定義
export type {
  DispatchPanel2D,
  RT2Panel,
  DispatchAreaDivision,
  DispatchAreaTransportFee,
  Tehai
} from './dispatch-extended';

export * from './reports';
export * from './management';
export * from './vehicle';
export * from './cast';
export * from './shop';

// dispatchの型定義（DispatchPostalCodeTransportFeeを含む）
export * from './dispatch';

// 面接管理関連の型定義
export type InterviewType = 'driver' | 'staff' | 'hostess';
export type InterviewResult = 'hired' | 'cancelled' | 'pending' | 'rejected';
export type EmploymentStatus = '' | 'retired';

export interface InterviewRecord {
  id: string;
  date: string; // YYYY-MM-DD形式
  startTime: string; // HH:MM形式
  interviewType: InterviewType;
  isRemoteWork: boolean; // 出稼ぎ
  name: string;
  age: number;
  media: string; // 媒体（募集元）
  interviewer: string; // 面接者
  result: InterviewResult;
  assignedStore: string; // 所属店舗
  storeName: string; // 店内名
  employmentStatus: EmploymentStatus; // 在職
  assignedStaff: string; // 担当者
  phoneNumber?: string; // 電話番号
  email?: string; // メールアドレス
  location?: string; // 面接場所
  notes?: string; // 備考
  createdAt: string;
  updatedAt: string;
}

// 店舗リスト
export const STORE_LIST = [
  '本店',
  '2F店舗',
  'VIPルーム',
  'プライベートルーム',
  'バーカウンター',
  '銀座支店',
  '新宿支店',
  '渋谷支店',
  '池袋支店'
] as const;

// 店舗番号と店舗名のマッピング
export const STORE_MAPPING: Record<string, string> = {
  '001': '本店',
  '002': '2F店舗',
  '003': 'VIPルーム',
  '004': 'プライベートルーム',
  '005': 'バーカウンター',
  '006': '銀座支店',
  '007': '新宿支店',
  '008': '渋谷支店',
  '009': '池袋支店'
};

// 面接種類の表示ラベル
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  driver: 'ドライバー',
  staff: 'スタッフ',
  hostess: 'ホステス'
};

// 面接結果の表示ラベル
export const INTERVIEW_RESULT_LABELS: Record<InterviewResult, string> = {
  hired: '入店',
  cancelled: '取消',
  pending: '保留',
  rejected: '不採用'
};

// 在職状態の表示ラベル
export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  '': '在職',
  'retired': '退職'
};

// スタッフ台帳関連の型定義
import type { EmploymentType } from './staff-attendance';

export type JobType = 'driver' | 'office';
export type RoleType = 'chairman' | 'advisor' | 'president' | 'general_manager' | 'manager' | 'admin_manager' | 'office_manager' | 'female_manager' | 'office_staff' | 'pr';
export type EmploymentStatusType = 'active' | '';
export type AccessType = 'admin' | 'manager' | 'accounting_manager' | 'staff';
export type AccessStatusType = 'active' | 'inactive';

export interface StaffLedgerRecord {
  id: string;
  sfid: string; // 従業員番号
  lastName: string; // 姓
  firstName: string; // 名
  lastNameKana?: string; // 姓かな
  firstNameKana?: string; // 名かな
  employmentDate: string; // 就労日 YYYY-MM-DD
  retirementDate?: string; // 退職日 YYYY-MM-DD
  employmentType: EmploymentType; // 雇用区分
  jobTypes: JobType[]; // 職務（複数選択可能）
  role: RoleType;
  employmentStatus: EmploymentStatusType; // 在職
  adjustmentRate: number; // 調整率
  displayOrder: number; // 表示順
  accountName: string; // アカウント名（英語）
  accessType: AccessType; // アクセス権
  accessStatus: AccessStatusType; // アクセス権のステータス
  remarks?: string; // 備考
  createdAt: string; // 登録日時
  updatedAt: string; // 更新日時
}

// 職務の表示ラベル
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  driver: 'ドライバ',
  office: '内勤'
};

// 役割の表示ラベル
export const ROLE_LABELS: Record<RoleType, string> = {
  chairman: '会長',
  advisor: '顧問',
  president: '社長',
  general_manager: '統括部長',
  manager: 'マネージャ',
  admin_manager: '管理部長',
  office_manager: '内勤部長',
  female_manager: '女子管理責任',
  office_staff: '内勤',
  pr: '広報'
};

// 在職状態の表示ラベル（スタッフ台帳用）
export const STAFF_EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatusType, string> = {
  active: '在職',
  '': ''
};

// アクセス権の表示ラベル
export const ACCESS_TYPE_LABELS: Record<AccessType, string> = {
  admin: '管理者',
  manager: '責任者',
  accounting_manager: '会計責任者',
  staff: 'スタッフ'
};

// アクセス権ステータスの表示ラベル
export const ACCESS_STATUS_LABELS: Record<AccessStatusType, string> = {
  active: '有効',
  inactive: '無効'
};

// 店舗台帳関連の型定義
export * from './store-ledger';

// 基本タグ関連の型定義
export * from './basic-tag';

// グループ台帳関連のエクスポート
export * from './group-ledger';

// 有料道路関連の型定義  
export * from './toll-road';

// 売上レポート関連の型定義
export * from './sales-report';

// クレジットカード関連の型定義
export * from './credit-card';

// スタッフ関連の型定義
export * from './staff';

// 出勤管理関連の型定義
export * from './attendance';

// 手配表関連の型定義
export * from './tehai';

// スタッフ出勤管理関連の型定義（重複を避けるため特定の型のみエクスポート）
export type {
  StaffAttendanceData,
  WorkType as StaffWorkType,
  EmploymentType,
  AttendanceStatus as StaffAttendanceStatus
} from './staff-attendance';

export {
  WORK_TYPE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_VARIANTS,
  determineAttendanceStatus
} from './staff-attendance';

// 部署別名簿関連の型定義
export * from './department-roster';

// 出勤希望アルバイト関連の型定義
export * from './part-time-attendance';

// 有給使用者及び給料引き者関連の型定義
export * from './leave-and-deduction';

// 予約関連の型定義
export * from './reservation';

// 時間別ホステス出勤管理関連の型定義
export type HostessAttendanceStatus = 'scheduled' | 'confirmed' | 'working' | 'break' | 'finished';

export interface TimeBasedHostessAttendance {
  id: string;
  date: string; // YYYY-MM-DD形式
  hostessId: string;
  hostessName: string;
  startTime: string; // HH:MM形式
  endTime: string; // HH:MM形式
  status: HostessAttendanceStatus;
  location?: string; // 勤務場所
  notes?: string; // 備考
}

// ステータスの表示ラベル
export const hostessAttendanceStatusLabels: Record<HostessAttendanceStatus, string> = {
  scheduled: '予定',
  confirmed: '確定',
  working: '勤務中',
  break: '休憩中',
  finished: '終了'
};

// ステータスの色設定
export const HOSTESS_ATTENDANCE_STATUS_COLORS: Record<HostessAttendanceStatus, string> = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  working: 'bg-green-100 text-green-800',
  break: 'bg-orange-100 text-orange-800',
  finished: 'bg-gray-100 text-gray-800'
};
