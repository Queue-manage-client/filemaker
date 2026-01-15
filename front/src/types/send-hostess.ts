// 送りホステス（右ブロック用）
export interface SendHostess {
  id: number;
  hasPackage: boolean;
  area: string;
  hostessName: string;
  driverName: string;
  endTime: string;
  returnTime: string;
  destination: string;
  destinationMark?: string;
  count: number;
}
