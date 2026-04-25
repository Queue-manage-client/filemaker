// 顧客関連の型定義

// 顧客台帳データ
export interface Customer {
  id: string;
  customerNumber: string; // 顧客番号
  name: string; // 顧客名
  nameKana: string; // 顧客名（カナ）
  storeNumber?: string; // 店舗番号
  referenceMedia?: string; // 参照メディア
  company?: string; // 会社名
  phoneNumber: string; // 電話番号
  email?: string; // メールアドレス
  address: {
    zipCode: string; // 郵便番号
    prefecture: string; // 都道府県
    city: string; // 市区町村
    street: string; // 番地
    building?: string; // 建物名
  };
  registrationDate: string; // 登録日
  lastUsedDate?: string; // 最終利用日
  lastVisitDate?: string; // 最終来店日 (YYYY-MM-DD)
  lastUsedEvent?: string; // 最終利用イベント名
  totalUsageCount: number; // 総利用回数
  totalAmount: number; // 総利用金額
  status: 'active' | 'inactive' | 'suspended'; // ステータス
  preferredPayment: 'cash' | 'card' | 'transfer' | 'other'; // 優先支払い方法
  notes?: string; // 備考
  tags: string[]; // タグ
}

// 操作ログ
export interface OperationLog {
  id: string;
  date: string; // ISO datetime
  operatorName: string; // 操作者
  targetCustomerId: string;
  targetCustomerName: string;
  type: 'plus' | 'minus' | 'adjust'; // 種別
  points: number; // ポイント数（正値）
  remarks?: string; // 備考
}

// 顧客ポイントデータ
export interface CustomerPoints {
  id: string;
  customerId: string;
  customerName: string;
  currentPoints: number; // 現在のポイント
  totalEarnedPoints: number; // 累計獲得ポイント
  totalUsedPoints: number; // 累計使用ポイント
  lastEarnedDate?: string; // 最終獲得日
  lastUsedDate?: string; // 最終使用日
  pointHistory: PointTransaction[]; // ポイント履歴
  expiringPoints: {
    points: number;
    expiryDate: string;
  }[]; // 期限切れ予定ポイント
}

// ポイント取引履歴
export interface PointTransaction {
  id: string;
  date: string;
  type: 'earned' | 'used' | 'expired' | 'adjusted';
  points: number;
  reason: string;
  relatedServiceId?: string; // 関連サービスID
  balance: number; // 取引後残高
}

// 顧客車両情報
export interface CustomerVehicleInfo {
  id: string;
  customerId: string;
  customerName: string;
  vehicleNumber: string; // 車両番号
  vehicleType: string; // 車種
  color: string; // 色
  ownerName: string; // 所有者名
  registrationDate: string; // 登録日
  notes?: string; // 備考
  isActive: boolean; // アクティブ状態
}

// 顧客グループ台帳データ
export interface GroupLedger {
  id: string;
  groupName: string; // グループ名
  groupCode: string; // グループコード
  representativeCustomerId: string; // 代表顧客ID
  representativeCustomerName: string; // 代表顧客名
  memberCount: number; // メンバー数
  totalUsageAmount: number; // 総利用金額
  registrationDate: string; // 登録日
  lastUsedDate?: string; // 最終利用日
  status: 'active' | 'inactive'; // ステータス
  discountRate: number; // 割引率（%）
  members: {
    customerId: string;
    customerName: string;
    role: 'representative' | 'member';
    joinDate: string;
  }[]; // メンバー一覧
  notes?: string; // 備考
}

