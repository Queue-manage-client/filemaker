// 店舗台帳関連の型定義

// 店舗基本情報
export interface StoreBasicInfo {
  id: string;
  storeName: string;
  storeCode: string;
  address: string;
  phoneNumber: string;
  email?: string;
  businessHours: {
    open: string;
    close: string;
  };
  capacity: number;
  isActive: boolean;
  notes?: string;
}

// GM区分（旧）
export interface GMDivisionOld {
  id: string;
  storeId: string;
  gmName: string;
  gmType: 'main' | 'sub' | 'trainee';
  startDate: string;
  endDate?: string;
  commission: number; // %
  isActive: boolean;
}

// GM区分（新）
export interface GMDivision {
  id: string;
  storeId: string;
  gmDivisionName: string; // GM区分（例：ガールズ、レディ）
  hostessType: 'A' | 'B'; // ホステス種別
  webName: string; // Web名称（例：GIRL、LADY）
  hpNumber: number; // HP番号（0~4）
  sortOrder: number; // ソート順
}

// コース料金（旧）
export interface CoursePrice {
  id: string;
  storeId: string;
  courseName: string;
  duration: number; // 分
  price: number;
  taxIncluded: boolean;
  isActive: boolean;
  description?: string;
}

// コース料金（新）
export interface CourseFee {
  id: string;
  storeId: string;
  courseName: string;
  gmDivision: string;
  courseType: 'Standard' | 'Gold' | 'Premium';
  type: 'A' | 'B'; // Aは左側、Bは右側
  duration: number; // 分
  price: number;
  hostessShare: {
    free: {
      percentage: number;
      amount: number;
    };
    panel: {
      percentage: number;
      amount: number;
    };
    nomination: {
      percentage: number;
      amount: number;
    };
  };
  storeShare: {
    free: {
      amount: number;
    };
    panel: {
      amount: number;
    };
    nomination: {
      amount: number;
    };
  }; // 計算される値（料金 - ホステス取分）
  isActive: boolean;
}

// 特別料金
export interface SpecialPrice {
  id: string;
  storeId: string;
  eventName: string;
  eventType: 'holiday' | 'season' | 'campaign' | 'other';
  startDate: string;
  endDate: string;
  priceModifier: number; // %（100%基準）
  isActive: boolean;
  description?: string;
}

// 人事構成
export interface StaffComposition {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

// クラス別料金
export interface ClassPrice {
  id: string;
  storeId: string;
  className: string;
  classLevel: number;
  basePrice: number;
  hourlyRate: number;
  isActive: boolean;
  requirements?: string;
}

// ボーナス支給基準
export interface BonusCriteria {
  id: string;
  storeId: string;
  criteriaName: string;
  criteriaType: 'sales' | 'performance' | 'attendance' | 'other';
  threshold: number;
  bonusAmount: number;
  bonusPercentage?: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  isActive: boolean;
}

// 指名
export interface Nomination {
  id: string;
  storeId: string;
  hostessId: string;
  hostessName: string;
  customerId: string;
  customerName: string;
  nominationDate: string;
  nominationType: 'regular' | 'special' | 'temporary';
  fee: number;
  isActive: boolean;
}

// 出勤
export interface Attendance {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime?: number; // 分
  overtimeHours?: number;
  attendanceType: 'normal' | 'early' | 'late' | 'absent';
  notes?: string;
}

// 連絡
export interface Communication {
  id: string;
  storeId: string;
  fromStaffId: string;
  fromStaffName: string;
  toStaffId?: string;
  toStaffName?: string;
  messageType: 'announcement' | 'notice' | 'urgent' | 'memo';
  subject: string;
  content: string;
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  readAt?: string;
}

// 売上/単価/ロング
export interface SalesData {
  id: string;
  storeId: string;
  date: string;
  totalSales: number;
  customerCount: number;
  averageSpend: number;
  longSessionCount: number;
  longSessionRevenue: number;
  averageSessionDuration: number; // 分
}

// その他ポイント
export interface OtherPoints {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  pointType: 'service' | 'teamwork' | 'improvement' | 'customer_satisfaction' | 'other';
  points: number;
  reason: string;
  awardedDate: string;
  awardedBy: string;
}

// マイナスポイント
export interface MinusPoints {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  penaltyType: 'late' | 'absence' | 'violation' | 'complaint' | 'other';
  points: number;
  reason: string;
  incurredDate: string;
  issuedBy: string;
  isResolved: boolean;
}

// 顧客ポイント
export interface StoreCustomerPoints {
  id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  pointType: 'visit' | 'spending' | 'referral' | 'loyalty' | 'bonus';
  points: number;
  currentBalance: number;
  earnedDate: string;
  expiryDate?: string;
  description?: string;
}

// 割引
export interface Discount {
  id: string;
  storeId: string;
  discountName: string; // 割引名
  amount: number; // 金額
  status: '使用中' | '中止' | '廃棄'; // 現状
  notes?: string; // 備考
  sortOrder?: number; // ソート順
}

// 表示設定
export interface DisplaySettings {
  id: string;
  storeId: string;
  settingName: string;
  settingType: 'menu' | 'price' | 'layout' | 'theme' | 'other';
  settingValue: string;
  isEnabled: boolean;
  lastUpdated: string;
  updatedBy: string;
}

// メディア
export interface Media {
  id: string;
  storeId: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  category: 'menu' | 'promotion' | 'staff' | 'interior' | 'other';
  description?: string;
  isActive: boolean;
  uploadedAt: string;
  uploadedBy: string;
}

// オプション
export interface StoreOptions {
  id: string;
  storeId: string;
  type: 'A' | 'B'; // 種別
  optionName: string; // オプション名
  amount: number; // 金額
  storeShare: number; // 店舗取分
  hostessShare: number; // ホステス取分
  webCode: string; // Webコード
  displayOrder?: number; // 表示順
}

// 店舗台帳のタブ定義
export type StoreLedgerTab = 
  | 'basic'
  | 'gm-division'
  | 'course-prices'
  | 'special-prices'
  | 'staff-composition'
  | 'class-prices'
  | 'bonus-criteria'
  | 'nominations'
  | 'attendance'
  | 'communications'
  | 'sales-data'
  | 'other-points'
  | 'customer-points'
  | 'discounts'
  | 'display-settings'
  | 'media'
  | 'options';

// タブ情報
export interface TabInfo {
  id: StoreLedgerTab;
  label: string;
  icon?: string;
}

// タブ表示ラベル
export const storeLedgerTabLabels: Record<StoreLedgerTab, string> = {
  'basic': '基本',
  'gm-division': 'GM区分',
  'course-prices': 'コース料金',
  'special-prices': '特別料金',
  'staff-composition': '人事構成',
  'class-prices': 'クラス別料金',
  'bonus-criteria': 'ボーナス支給基準',
  'nominations': '指名',
  'attendance': '出勤',
  'communications': '連絡',
  'sales-data': '売上/単価/ロング',
  'other-points': 'その他ポイント',
  'customer-points': '顧客ポイント',
  'discounts': '割引',
  'display-settings': '表示',
  'media': 'メディア',
  'options': 'オプション'
};

// 全タブ情報
export const storeLedgerTabs: TabInfo[] = [
  { id: 'basic', label: '基本' },
  { id: 'gm-division', label: 'GM区分' },
  { id: 'course-prices', label: 'コース料金' },
  { id: 'special-prices', label: '特別料金' },
  { id: 'staff-composition', label: '人事構成' },
  { id: 'class-prices', label: 'クラス別料金' },
  { id: 'bonus-criteria', label: 'ボーナス支給基準' },
  { id: 'nominations', label: '指名' },
  { id: 'attendance', label: '出勤' },
  { id: 'communications', label: '連絡' },
  { id: 'sales-data', label: '売上/単価/ロング' },
  { id: 'other-points', label: 'その他ポイント' },
  { id: 'customer-points', label: '顧客ポイント' },
  { id: 'discounts', label: '割引' },
  { id: 'display-settings', label: '表示' },
  { id: 'media', label: 'メディア' },
  { id: 'options', label: 'オプション' }
];
