// new-rt2ページ用の型定義

// 出勤予定ホステス
export interface ScheduledHostess {
  id: string;
  hostessName: string; // ホステス名（例：「すすす」）
  driverName: string; // ドライバー名（例：「松尾」）
  location: string; // 場所（例：「南ICコイン」）
  area: string; // エリア（例：「南」）
  startTime: string; // 開始時間（例：「00:00」）
  endTime: string; // 終了時間（例：「00:00」）
  arrivalTime: string; // 到着時間（例：「00:00」）
  count: number; // 件数（例：1）
}

// INドラ未定予約リスト
export interface UndecidedDriverReservation {
  id: string;
  departureTime: string; // 出勤時間（例：「00:00」）
  isConfirmed: boolean; // 確認済みフラグ（「確」表示）
  pickupLocation: string; // 迎え場所（例：「南IC」）
  area: string; // エリア（例：「南」）
  hostessName: string; // ホステス名（例：「リョウナ」）
  sColumn: string; // S列（例：「S」）
  timeTotal: number; // 時間計（分）（例：120）
  isHighlighted: boolean; // ハイライト表示フラグ（背景色）
  hasOption1?: boolean; // オプション1（領収書）
  hasOption2?: boolean; // オプション2（待合せ）
  hasOption3?: boolean; // オプション3（着TEL）
  hasOption4?: boolean; // オプション4（カード）
  hasOption5?: boolean; // オプション5（オプション）
}

// ホステス送り・帰宅
export interface HostessTransport {
  id: string;
  hostessName: string; // ホステス名（例：「南 リョウナ」）
  departureTime: string; // 出発時間（例：「00:00」）
  destination: string; // 送り場所
  returnTime?: string; // 帰宅時間
  count?: number; // 件数
}

// 帰宅ホステス
export interface ReturningHostess {
  id: string;
  hostessName: string; // ホステス名
  returnTime: string; // 帰宅時間
  location: string; // 場所（例：「自宅or寮　待機」）
}

// 予定(打ち合わせ・撮影など)
export interface ScheduleItem {
  id: string;
  title: string; // タイトル（例：「ああああ」）
  description: string; // 説明（例：「ああああ」）
}

// 面接予定
export interface InterviewSchedule {
  id: string;
  title: string; // タイトル
  description: string; // 説明
}

// ドライバ配車パネル
export interface DriverDispatchPanel {
  id: string;
  status: 'completed' | 'pending'; // 済/未済
  type: 'entry' | 'other'; // 入店/その他
  time: string; // 時間
  location: string; // 場所（例：「セブンイレブン新町一条店」）
  hostessName1: string; // ホステス名1
  hostessName2?: string; // ホステス名2（オプション）
}

// スタッフ予定リスト
export interface StaffSchedule {
  id: string;
  driverName: string; // ドライバー名（例：「吉田」）
  destination: string; // 行き先（例：「ああああ」）
  note: string; // 備考（例：「ほげほげほげ」）
  isHighlighted: boolean; // ハイライト表示フラグ
}

// OUTドラ未定・接客中リスト
export interface OutDriverUndecided {
  id: string;
  status: 'start' | 'hp'; // 開始/HP
  hostessName: string; // ホステス名（例：「南 リョウナ」）
  pickupTime: string; // 迎え時間
  arrivalTime: string; // 到着時間
  timeTotal: number; // 時間計（分）
  destination: string; // 送り場所
  station: string; // 駅名
  in_driver?: string; // INドラ
  out_driver?: string; // OUTドラ
  hasOption1?: boolean; // オプション1（領収書）
  hasOption2?: boolean; // オプション2（待合せ）
  hasOption3?: boolean; // オプション3（着TEL）
  hasOption4?: boolean; // オプション4（カード）
  hasOption5?: boolean; // オプション5（オプション）
}

// 終了リスト
export interface CompletedList {
  id: string;
  hostessName: string; // ホステス名
  pickupTime: string; // 迎え時間
  arrivalTime: string; // 到着時間
  destination: string; // 送り場所
  option1?: string; // オプション1
}

// 南IC事務所待機
export interface OfficeWaiting {
  id: string;
  hostessName: string; // ホステス名
  departureTime: string; // 出発時間
}

// FGCS他撮影中
export interface Shooting {
  id: string;
  hostessName: string; // ホステス名
  departureTime: string; // 出発時間
}

// メモ・引継事項
export interface MemoItem {
  id: string;
  content: string; // 内容
}

// 南IC徒歩派遣or仮置き
export interface WalkingDispatch {
  id: string;
  hostessName: string; // ホステス名（例：「南 リョウナ」）
  departureTime: string; // 出発時間（例：「00:00」）
}

// 送りホステス
export interface SendHostess {
  id: string;
  hasPackage: boolean; // 荷物有無
  area: string; // エリア（例：「南」）
  hostessName: string; // ホステス名
  driverName: string; // 送りドライバー名
  endTime: string; // 終了時間
  returnTime: string; // 帰宅時間
  destination: string; // 送り場所
  destinationMark?: string; // 送り場所マーク（例：「■」）
  count: number; // 件数
}

