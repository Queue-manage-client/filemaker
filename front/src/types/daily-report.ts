// 日報ヘッダー用の Props 型

export interface DailyReportHeaderProps {
  currentDate?: Date;
  closingDateTime?: Date | string;
  manager?: string;
  serialNumber?: string | number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  onMenuClick?: () => void;
  onListClick?: () => void;
  onCreditCheckClick?: () => void;
  onStoreCardSummaryClick?: () => void;
  onAClick?: () => void;
  onBClick?: () => void;
  onWeekBackClick?: () => void;
  onPreviousDayClick?: () => void;
  onNextDayClick?: () => void;
  onWeekForwardClick?: () => void;
  onNewClick?: () => void;
  onDeleteClick?: () => void;
  onSearchClick?: () => void;
  onOwnerClick?: () => void;
  /** Item 73: カレンダーによる日付選択 */
  onDateChange?: (date: Date) => void;
}


