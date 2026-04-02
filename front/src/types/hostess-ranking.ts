// ホステスランキング関連の型定義

// ソート基準の型定義
export type SortKey =
  | 'monthlyEarnings'
  | 'totalCustomers'
  | 'regularNominationCount'
  | 'panelNominationCount'
  | 'freeNominationCount'
  | 'totalNominationCount' // 本指名数（Item 36）
  | 'honShimeiCount' // 本指名数カテゴリー（Item 38）
  | 'nominationRevenue'
  | 'averageCustomerSpending'
  | 'repeatCustomerRate'
  | 'extensionRate'
  | 'workDaysInMonth'
  | 'customerSatisfactionScore'
  | 'newCustomerCount';

// ソートオプションの型定義
export interface SortOption {
  value: SortKey;
  label: string;
}

// ソートオプション定数
export const SORT_OPTIONS: SortOption[] = [
  { value: 'monthlyEarnings', label: '月間収入' },
  { value: 'nominationRevenue', label: '指名売上' },
  { value: 'totalCustomers', label: '総客数' },
  { value: 'honShimeiCount', label: '本指名数' }, // Item 38
  { value: 'totalNominationCount', label: '総指名数' }, // Item 36
  { value: 'regularNominationCount', label: '通常指名数' },
  { value: 'panelNominationCount', label: 'パネル指名数' },
  { value: 'freeNominationCount', label: 'フリー指名数' },
  { value: 'averageCustomerSpending', label: '平均客単価' },
  { value: 'repeatCustomerRate', label: 'リピート率' },
  { value: 'extensionRate', label: '延長率' },
  { value: 'workDaysInMonth', label: '月間勤務日数' },
  { value: 'customerSatisfactionScore', label: '顧客満足度' },
  { value: 'newCustomerCount', label: '新規客数' },
];

// ランキングカードのProps型定義
export interface RankingCardProps {
  title: string;
  icon: React.ElementType;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  hostessRankingData: import('@/types/hostess').HostessRanking[];
}

// ランク変動アイコンのProps型定義
export interface RankChangeIconProps {
  change: 'up' | 'down' | 'same' | 'new';
}

