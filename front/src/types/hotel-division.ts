export type HotelType = 'ラブホテル' | 'シティホテル';
export type SingleRoomEntry = '不可' | '可能';
export type HotelImage = 'あり' | 'なし';
export type ParkingAvailability = 'あり' | 'なし';
export type DispatchCondition = 'possible' | 'impossible' | 'conditional';

export interface HotelDivision {
  no: number;
  type: HotelType;
  firstTwoChars: string; // ホテル名の読み方ひらがな2文字
  hotelName: string;
  areaCategory: string; // 地域区分
  phoneNumber: string;
  singleRoomEntry: SingleRoomEntry; // 独り入室
  restFee?: number; // 休憩料金（円）
  stayFee?: number; // 宿泊料金（円）
  freeTimeFee?: number; // フリータイム料金（円）
  amount?: number; // 金額（円）
  postalCode: string; // 郵便番号（7桁ハイフン無し）
  address: string;
  hotelImage: HotelImage;
  hasParking?: ParkingAvailability; // 駐車場有無
  notes?: string; // 備考
  isFirstGuidance?: boolean; // 初案内フラグ
  dispatchCondition?: DispatchCondition; // 派遣可否
  conditionNote?: string; // 条件メモ
  stationCode?: string; // 駅コード
  transportationFee?: number; // 交通費
  usageLocation?: { // 利用場所
    postalCode?: string;
    address?: string;
  };
}
