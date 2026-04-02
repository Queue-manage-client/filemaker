// ホステス関連の型定義

// 勤務形態 (Item 46) ※出稼ぎを独立した選択肢として含む
export type WorkStyleType = 'regular' | 'semi-regular' | 'last-minute' | 'dekasegi' | 'newbie' | 'emergency' | 'irregular' | 'retired' | 'no-attendance-2months';

export const WORK_STYLE_LABELS: Record<WorkStyleType, string> = {
  regular: 'レギュラー',
  'semi-regular': '準レギュラー',
  'last-minute': '直前',
  dekasegi: '出稼ぎ',
  newbie: '新人',
  emergency: '緊急',
  irregular: '不定期',
  retired: '退店',
  'no-attendance-2months': '2ヶ月出勤ナシ',
};

// スケジュールステータスラベル
export const SCHEDULE_STATUS_LABELS: Record<'draft' | 'confirmed' | 'published', string> = {
  draft: '確認依頼',
  confirmed: '確認済',
  published: '公開中',
};

// 交通費支給方法
export type TransportationPaymentMethod = 'cash' | 'transfer' | 'prepaid' | 'included';

export const TRANSPORTATION_PAYMENT_METHOD_LABELS: Record<TransportationPaymentMethod, string> = {
  cash: '現金支給',
  transfer: '振込支給',
  prepaid: '前払い',
  included: 'バック込み',
};

// ホステス台帳データ
export interface HostessLedger {
  id: string;
  hostessNumber: string; // ホステス番号
  name: string; // 名前
  nameKana: string; // 名前（カナ）
  stageName: string; // 源氏名
  birthDate: string; // 生年月日
  age: number; // 年齢
  phoneNumber: string; // 電話番号
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  }; // 緊急連絡先
  address: {
    zipCode: string;
    prefecture: string;
    city: string;
    street: string;
    building?: string;
  }; // 住所
  registrationDate: string; // 登録日
  lastWorkDate?: string; // 最終勤務日
  status: 'active' | 'inactive' | 'suspended' | 'retired'; // ステータス
  category: '内子系' | '内妻系' | 'VIP' | 'Lady' | 'Girls' | 'SUP' | '新人'; // カテゴリー
  workStyle?: WorkStyleType; // 勤務形態 (Item 46)
  isOutsideWork?: boolean; // 出稼ぎ (Item 45)
  outsideWorkInfo?: { // 出稼ぎ情報 (Item 47)
    transportationCost?: number; // 交通費
    dormitoryFee?: number; // 寮費
    transportationPaymentMethod?: TransportationPaymentMethod; // 交通費支給方法
    notes?: string; // 備考
  };
  totalWorkDays: number; // 総勤務日数
  totalEarnings: number; // 総収入
  averageRating: number; // 平均評価
  specialNotes?: string; // 特記事項
  ngAreas: string[]; // NG地域
  preferences: {
    workStartTime?: string;
    workEndTime?: string;
    preferredAreas: string[];
    availableDays: string[];
  }; // 勤務希望
}

// ホステスランキングデータ
export interface HostessRanking {
  id: string;
  rank: number; // 順位
  hostessId: string;
  hostessName: string;
  stageName: string;
  category: string;
  storeId?: string; // 店舗ID
  storeName?: string; // 店舗名
  monthlyEarnings: number; // 月間収入
  totalCustomers: number; // 総客数
  averageServiceTime: number; // 平均サービス時間（分）
  customerSatisfactionScore: number; // 顧客満足度スコア
  workDaysInMonth: number; // 月間勤務日数
  earningsGrowthRate: number; // 収入成長率（%）
  specialAchievements: string[]; // 特別な実績
  previousRank?: number; // 前回順位
  rankChange: 'up' | 'down' | 'same' | 'new'; // 順位変動
  // 指名関連
  regularNominationCount: number; // 通常指名数
  panelNominationCount: number; // パネル指名数
  freeNominationCount: number; // フリー指名数
  honShimeiCount?: number; // 本指名数（Item 38）
  dataYear?: number; // データ対象年
  dataMonth?: number; // データ対象月
  nominationRevenue: number; // 指名売上
  // 詳細集計
  totalServiceTime: number; // 総サービス時間（分）
  averageCustomerSpending: number; // 平均客単価
  repeatCustomerRate: number; // リピート率（%）
  newCustomerCount: number; // 新規客数
  extensionRate: number; // 延長率（%）
}

// ホステスマネージャー一覧データ
export interface HostessManager {
  id: string;
  managerNumber: string; // マネージャー番号
  name: string; // 名前
  nameKana: string; // 名前（カナ）
  phoneNumber: string; // 電話番号
  email?: string; // メールアドレス
  hireDate: string; // 雇用日
  position: 'manager' | 'sub_manager' | 'leader' | 'assistant'; // 役職
  managedHostesses: string[]; // 担当ホステスID一覧
  totalManagedHostesses: number; // 担当ホステス数
  monthlyPerformance: {
    totalRevenue: number; // 総売上
    averageHostessEarnings: number; // 平均ホステス収入
    newRecruits: number; // 新規採用数
    retentionRate: number; // 定着率（%）
  }; // 月間実績
  status: 'active' | 'inactive' | 'on_leave'; // ステータス
  notes?: string; // 備考
}

// ホステスマネージャリスト（シンプル表示用）
export interface HostessManagerListItem {
  no: number; // 通し番号
  name: string; // 氏名
  standardHours: number; // 基準時間
  peopleCount: number; // 人数
}

// 勤務形態の型定義
export type WorkType = 'full_time' | 'part_time' | 'contract' | 'dispatch' | 'temp';

// 曜日の型定義
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// 1日の勤務時間データ
export interface DailyWorkSchedule {
  isWorkDay: boolean; // 勤務日かどうか
  startTime?: string; // 開始時間（例: "18:00"）
  endTime?: string; // 終了時間（例: "02:00"）
  breakTime?: number; // 休憩時間（分）
  workHours?: number; // 実働時間
  notes?: string; // 備考
}

// 新しいホステススケジュールデータ
export interface HostessScheduleData {
  id: string;
  hostessId: string; // ホステスID
  workType: WorkType; // 勤務形態
  name: string; // 名前（旧店内名フィールド）
  isNewcomer?: boolean; // 新人フラグ
  assignedStaff: string; // 担当者
  hostessManager: string; // HM（ホステスマネージャー）
  remarks?: string; // 備考（一覧用の自由記述）
  store?: { id: string; name: string }; // 店舗情報（色分け用）
  
  // 1週間分の勤務時間
  weeklySchedule: {
    monday: DailyWorkSchedule;
    tuesday: DailyWorkSchedule;
    wednesday: DailyWorkSchedule;
    thursday: DailyWorkSchedule;
    friday: DailyWorkSchedule;
    saturday: DailyWorkSchedule;
    sunday: DailyWorkSchedule;
  };
  
  // 週間統計
  weeklyStats: {
    totalWorkDays: number; // 総勤務日数
    totalWorkHours: number; // 総勤務時間
    averageDailyHours: number; // 1日平均勤務時間
    expectedEarnings: number; // 予想収入
  };
  
  // メタデータ
  weekStartDate: string; // 週開始日（YYYY-MM-DD）
  weekEndDate: string; // 週終了日（YYYY-MM-DD）
  lastUpdated: string; // 最終更新日時
  status: 'draft' | 'confirmed' | 'published'; // スケジュールステータス
}

// ホステススケジュール一覧用の型
export interface HostessScheduleListItem {
  id: string;
  hostessId: string;
  workType: WorkType;
  name: string;
  hostessManager: string;
  totalWorkDays: number;
  totalWorkHours: number;
  status: 'draft' | 'confirmed' | 'published';
  weekStartDate: string;
}

// 時間別ホステス出勤データ
export interface TimeBasedHostessAttendance {
  id: string;
  date: string;
  timeSlot: string; // 時間帯（例: "18:00-19:00"）
  hostesses: {
    hostessId: string;
    hostessName: string;
    category: string;
    status: 'working' | 'waiting' | 'break' | 'absent';
    location?: string;
    customerId?: string;
    customerName?: string;
    serviceStartTime?: string;
    estimatedEndTime?: string;
  }[];
  totalCount: number; // 総出勤者数
  workingCount: number; // 稼働中
  waitingCount: number; // 待機中
  breakCount: number; // 休憩中
}

// 週間ホステス出勤データ
export interface WeeklyHostessAttendance {
  id: string;
  weekStartDate: string; // 週開始日
  weekEndDate: string; // 週終了日
  hostessId: string;
  hostessName: string;
  category: string;
  dailyAttendance: {
    [date: string]: {
      startTime?: string;
      endTime?: string;
      workHours: number;
      status: 'present' | 'absent' | 'late' | 'early_leave';
      earnings: number;
      customerCount: number;
      notes?: string;
    };
  };
  weeklyTotals: {
    totalHours: number;
    totalDays: number;
    totalEarnings: number;
    totalCustomers: number;
    averageHoursPerDay: number;
  };
  attendanceRate: number; // 出勤率（%）
}

