// 新人勤務形態の自動解除ヘルパー
// FAQ Row 44-45: 「勤務形態が「新人」の場合20日経ったら自動で外れる仕組み」

export const NEWBIE_AUTO_RELEASE_DAYS = 20;

/** newbieStartDate から今日までの経過日数を返す (初日を1日目) */
export const calcNewbieDays = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
};

/** 20日経過後は新人扱いを自動解除 (フラグベース) */
export const isStillNewbie = (cast: { isNewbie?: boolean; newbieStartDate?: string }): boolean => {
  if (!cast.isNewbie || !cast.newbieStartDate) return false;
  return calcNewbieDays(cast.newbieStartDate) < NEWBIE_AUTO_RELEASE_DAYS;
};

/**
 * 表示上の勤務形態を返す。
 * `workStyle === '新人'` で 20日経過済みなら自動的に「レギュラー」に切り替わる。
 * バックエンド連携時はDBの値を直接更新するが、フロント側は本ヘルパーで暫定対応。
 */
export const getEffectiveWorkStyle = (cast: {
  workStyle?: string;
  newbieStartDate?: string;
}): string | undefined => {
  if (cast.workStyle === '新人' && cast.newbieStartDate) {
    const days = calcNewbieDays(cast.newbieStartDate);
    if (days >= NEWBIE_AUTO_RELEASE_DAYS) return 'レギュラー';
  }
  return cast.workStyle;
};
