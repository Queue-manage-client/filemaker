// キャストデータの型定義
export interface TodayCastData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  homeTime: string;
  deliverPlace: string;
  achieve: string;
  finalCustomer: string;
  nowCustomer: string;
  inDriverMoving: string;
  next1: string;
  next2: string;
  next3: string;
  next4: string;
  next5: string;
  remark: string;
  special: string;
  ngPlace: string;
  waitTime: string;
  webStatus: string;
  mode: string;
  ranking: string;
  concurrent?: string; // 併用
  deliverCount?: string; // 送場所実績の数値
}
