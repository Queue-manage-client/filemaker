export type HotelType = 'ラブホテル' | 'シティホテル';
export type SingleRoomEntry = '不可' | '可能';
export type HotelImage = 'あり' | 'なし';

export interface HotelDivision {
  no: number;
  type: HotelType;
  firstTwoChars: string; // ホテル名の読み方ひらがな2文字
  hotelName: string;
  areaCategory: string; // 地域区分
  phoneNumber: string;
  singleRoomEntry: SingleRoomEntry; // 独り入室
  discount: string; // 割引（サンプルデータは空）
  amount?: number; // 金額（円）
  postalCode: string; // 郵便番号（7桁ハイフン無し）
  address: string;
  hotelImage: HotelImage;
  stationCode?: string; // 駅コード (Item 63)
  transportationFee?: number; // 交通費 (Item 59-62)
  usageLocation?: { // 利用場所 (Item 64)
    postalCode?: string;
    address?: string;
  };
}
