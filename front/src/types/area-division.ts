export interface AreaDivision {
  no: number;
  wideArea: string;
  hiraganaReading: string;
  romanReading: string;
  areaCategory: string;
  administrativeDivision: string;
  addressCity: string;
  // 通称（基本住所表示マーカー）。通常は最大2件、特例で追加可能
  addressNicknames?: string[];
  // 基本住所（地図上で代表となる住所）
  baseAddress?: string;
  // マーカー色（hex形式 例: "#FF5733"）
  markerColor?: string;
  totalHotels: number;
  loveHotels: number;
  cityHotels: number;
  // 交通費設定用デフォルト基本交通費（円）
  defaultTransportFee?: number;
  // 配車担当者
  dispatchStaff?: string;
  // 特例フラグ（2件以上のマーカーを許可）
  isException?: boolean;
  // 特例承認者
  exceptionApprovedBy?: string;
  // 登録者
  createdBy?: string;
  // 登録日時
  createdAt?: string;
  // 更新者
  updatedBy?: string;
  // 更新日時
  updatedAt?: string;
}
