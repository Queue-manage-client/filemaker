export interface AreaDivision {
  no: number;
  wideArea: string;
  hiraganaReading: string;
  romanReading: string;
  areaCategory: string;
  administrativeDivision: string;
  addressCity: string;
  // 通称（基本住所表示マーカー）。最大2件を想定。
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
}
