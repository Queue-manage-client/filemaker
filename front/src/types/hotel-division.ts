export type HotelType = 'ラブホテル' | 'シティホテル';
export type SingleRoomEntry = '不可' | '可能';
export type HotelImage = 'あり' | 'なし';
export type ParkingAvailability = 'あり' | 'なし';
export type DispatchCondition = 'possible' | 'impossible' | 'conditional';

// 金額設定
export interface HotelPricing {
  // 休憩
  restFee?: number;
  restTime?: string; // 例: "90分"
  // 宿泊
  stayFee?: number;
  stayCheckIn?: string; // 例: "22:00"
  stayCheckOut?: string; // 例: "10:00"
  // フリータイム
  freeTimeFee?: number;
  freeTimeStart?: string; // 例: "06:00"
  freeTimeEnd?: string; // 例: "18:00"
  freeTimeDuration?: string; // 例: "最大12時間"
  // ショートタイム
  shortTimeFee?: number;
  shortTimeDuration?: string; // 例: "60分"
  // 延長料金
  extensionFee?: number;
  extensionUnit?: string; // 例: "30分"
  // 深夜料金
  lateNightSurcharge?: number;
  lateNightStart?: string; // 例: "24:00"
  // 指名料
  nominationFee?: number;
  // サービス料
  serviceFee?: number;
  serviceRate?: number; // 例: 10 (%)
}

export interface HotelDivision {
  no: number;
  type: HotelType;
  // 名称関連
  abbreviatedName?: string; // 名称省略
  nameReading?: string; // 名所ふりがな
  firstTwoChars: string; // ホテル名の読み方ひらがな2文字
  hotelName: string; // 正式名称
  officialName?: string; // 正式名称（別名義）
  // 連絡先
  phoneNumber: string;
  subPhoneNumber?: string; // サブ電話番号
  url?: string; // URL
  // 住所関連
  postalCode: string; // 郵便番号（7桁ハイフン無し）
  prefecture?: string; // 都道府県
  city?: string; // 市区町村
  addressDetail?: string; // 丁目、番地、号（半角数字）
  address: string; // 完全住所
  // 地域・分類
  areaCategory: string; // 地域区分
  mark?: string; // マーク
  // 設備・条件
  singleRoomEntry: SingleRoomEntry; // 独り入室
  hasParking?: ParkingAvailability; // 駐車場有無
  hotelImage: HotelImage;
  // 派遣条件
  dispatchCondition?: DispatchCondition; // 派遣可否
  conditionNote?: string; // 条件メモ
  // 料金（旧フィールド - 互換性のため残す）
  restFee?: number;
  stayFee?: number;
  freeTimeFee?: number;
  amount?: number;
  // 新料金構造
  pricing?: HotelPricing;
  // その他
  cautions?: string; // 注意事項
  notes?: string; // 備考
  isFirstGuidance?: boolean; // 初案内フラグ
  stationCode?: string; // 駅コード
  transportationFee?: number; // 交通費
  usageLocation?: {
    postalCode?: string;
    address?: string;
  };
}
