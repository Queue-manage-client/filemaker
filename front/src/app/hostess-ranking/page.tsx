'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Minus, Crown, Award, Star, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { sampleHostessRanking } from "@/data/hostessSampleData";
import type { HostessRanking } from "@/types/hostess";
import type { SortKey, RankingCardProps, RankChangeIconProps } from "@/types/hostess-ranking";
import { SORT_OPTIONS } from "@/types/hostess-ranking";
import RankingTransitionChart from "@/components/hostess/ranking-transition-chart";
import { useHostessRanking } from '@/hooks/use-hostess';

// ランク変動アイコン
const RankChangeIcon = ({ change }: RankChangeIconProps) => {
  switch (change) {
    case 'up':
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    case 'down':
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    case 'same':
      return <Minus className="w-4 h-4 text-gray-400" />;
    case 'new':
      return <Star className="w-4 h-4 text-yellow-500" />;
  }
};

// ランキングカードコンポーネント
const RankingCard = ({
  title,
  icon: Icon,
  sortKey,
  onSortChange,
  hostessRankingData
}: RankingCardProps) => {
  // データをソート（本指名数対応）
  const sortedData = useMemo(() => {
    return [...hostessRankingData].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortKey === 'totalNominationCount') {
        aValue = (a.regularNominationCount || 0) + (a.panelNominationCount || 0);
        bValue = (b.regularNominationCount || 0) + (b.panelNominationCount || 0);
      } else if (sortKey === 'honShimeiCount') {
        aValue = a.honShimeiCount || 0;
        bValue = b.honShimeiCount || 0;
      } else {
        aValue = (a[sortKey] as number) || 0;
        bValue = (b[sortKey] as number) || 0;
      }
      return bValue - aValue;
    });
  }, [hostessRankingData, sortKey]);

  // 現在のソート基準のラベルを取得
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortKey)?.label || '';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </div>

        {/* ソート基準選択 */}
        <Select value={sortKey} onValueChange={(value) => onSortChange(value as SortKey)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ソート基準を選択" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {sortedData.map((hostess, index) => {
            // 表示値の計算
            let displayValue: number;
            if (sortKey === 'totalNominationCount') {
              displayValue = (hostess.regularNominationCount || 0) + (hostess.panelNominationCount || 0);
            } else if (sortKey === 'honShimeiCount') {
              displayValue = hostess.honShimeiCount || 0;
            } else {
              displayValue = (hostess[sortKey] as number) || 0;
            }

            const isPercentage = sortKey === 'repeatCustomerRate' || sortKey === 'extensionRate';
            const isCurrency = sortKey === 'monthlyEarnings' || sortKey === 'nominationRevenue' || sortKey === 'averageCustomerSpending';
            const honShimei = hostess.honShimeiCount ?? 0;

            return (
              <div
                key={hostess.id}
                className={`p-3 rounded-lg border transition-colors ${
                  index === 0 ? 'bg-yellow-50 border-yellow-300' :
                  index === 1 ? 'bg-gray-50 border-gray-300' :
                  index === 2 ? 'bg-orange-50 border-orange-300' :
                  'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* ランク表示 */}
                    <div className="flex flex-col items-center min-w-[40px]">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-800'
                      }`}>
                        {index + 1}
                      </div>
                      <RankChangeIcon change={hostess.rankChange} />
                    </div>

                    {/* ホステス情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{hostess.stageName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          hostess.category === 'VIP' ? 'bg-purple-100 text-purple-700' :
                          hostess.category === 'Lady' ? 'bg-pink-100 text-pink-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {hostess.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{hostess.hostessName}</p>
                      <p className="text-xs text-gray-500">{hostess.storeName}</p>

                      {/* 主要指標 */}
                      <div className="mt-2 text-sm">
                        <div className="font-bold text-blue-600">
                          {currentSortLabel}: {
                            isCurrency ? `¥${displayValue?.toLocaleString()}` :
                            isPercentage ? `${displayValue}%` :
                            displayValue?.toLocaleString()
                          }
                        </div>
                      </div>

                      {/* サブ指標（本指名数を常に表示） */}
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <div>月収: ¥{hostess.monthlyEarnings.toLocaleString()}</div>
                        <div>客数: {hostess.totalCustomers}名</div>
                        <div className="font-semibold text-indigo-600">本指名: {honShimei}件</div>
                        <div>満足度: {hostess.customerSatisfactionScore}</div>
                      </div>

                      {/* 特別な実績 */}
                      {hostess.specialAchievements.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {hostess.specialAchievements.map((achievement, i) => (
                            <span
                              key={i}
                              className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HostessRanking() {
  React.useEffect(() => {
    document.title = 'ホステスランキング - Dispatch Harmony Hub';
  }, []);

  const [sortKeys, setSortKeys] = useState<[SortKey, SortKey, SortKey, SortKey]>([
    'monthlyEarnings',
    'nominationRevenue',
    'honShimeiCount',
    'totalCustomers',
  ]);

  // 月次推移用コントロール
  const [transitionMetric, setTransitionMetric] = useState<SortKey>('monthlyEarnings');
  const [transitionStore, setTransitionStore] = useState<string>('all');
  const [transitionMonths, setTransitionMonths] = useState<number>(6);
  const [transitionTopN, setTransitionTopN] = useState<number>(5);

  // --- Change 1: 1か月単位表示 (月ナビゲーション) ---
  const today = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear(y => y - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    const isCurrentOrFuture =
      selectedYear > today.getFullYear() ||
      (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);
    if (isCurrentOrFuture) return;
    if (selectedMonth === 12) {
      setSelectedYear(y => y + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const isCurrentMonth =
    selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1;

  // --- Change 2: グローバルフィルター (店舗・月範囲指定) ---
  const [globalStore, setGlobalStore] = useState<string>('all');
  const [rangeStartYear, setRangeStartYear] = useState<number>(today.getFullYear());
  const [rangeStartMonth, setRangeStartMonth] = useState<number>(today.getMonth() + 1);
  const [rangeEndYear, setRangeEndYear] = useState<number>(today.getFullYear());
  const [rangeEndMonth, setRangeEndMonth] = useState<number>(today.getMonth() + 1);
  const [periodType, setPeriodType] = useState<'month' | 'range'>('month');

  // 年のオプション生成（過去3年から現在まで）
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = today.getFullYear(); y >= today.getFullYear() - 3; y--) {
      years.push(y);
    }
    return years;
  }, [today]);

  const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // React Queryを使用してデータ取得（フォールバックとしてサンプルデータを使用）
  const { data: rawHostessData = sampleHostessRanking, isLoading, error } = useHostessRanking('monthly');

  // グローバルフィルター適用（店舗 + 月/月範囲）
  const hostessRankingData = useMemo(() => {
    let filtered = rawHostessData;

    // 店舗フィルター
    if (globalStore !== 'all') {
      filtered = filtered.filter(item => item.storeId === globalStore);
    }

    // 月フィルター
    if (periodType === 'month') {
      filtered = filtered.filter(item =>
        item.dataYear === selectedYear && item.dataMonth === selectedMonth
      );
    } else {
      // 月範囲フィルター
      const startVal = rangeStartYear * 12 + rangeStartMonth;
      const endVal = rangeEndYear * 12 + rangeEndMonth;
      filtered = filtered.filter(item => {
        if (!item.dataYear || !item.dataMonth) return true;
        const itemVal = item.dataYear * 12 + item.dataMonth;
        return itemVal >= startVal && itemVal <= endVal;
      });
    }

    return filtered;
  }, [rawHostessData, globalStore, periodType, selectedYear, selectedMonth, rangeStartYear, rangeStartMonth, rangeEndYear, rangeEndMonth]);

  // 店舗一覧（共通）
  const allStores = useMemo(() => {
    const storeMap = new Map<string, string>();
    rawHostessData.forEach(item => {
      if (item.storeId && item.storeName) {
        storeMap.set(item.storeId, item.storeName);
      }
    });
    return Array.from(storeMap.entries()).map(([id, name]) => ({ id, name }));
  }, [rawHostessData]);

  const handleSortChange = (index: number, key: SortKey) => {
    const newSortKeys = [...sortKeys] as [SortKey, SortKey, SortKey, SortKey];
    newSortKeys[index] = key;
    setSortKeys(newSortKeys);
  };

  // 本指名数の合計（フィルター後データ）
  const totalHonShimei = useMemo(() =>
    hostessRankingData.reduce((sum, h) => sum + (h.honShimeiCount ?? 0), 0),
    [hostessRankingData]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">ホステスランキング</h1>
              <p className="text-sm text-gray-600 mt-1">
                指名料金区分や様々な条件で集計し、ランキングを作成します
              </p>
            </div>
          </div>

          {/* Change 1: 月ナビゲーション（1か月単位表示） */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="text-center min-w-[140px]">
                <div className="text-xl font-bold text-gray-900">
                  {selectedYear}年{selectedMonth}月
                </div>
                {isCurrentMonth && (
                  <Badge variant="secondary" className="text-xs mt-0.5">今月</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                disabled={isCurrentMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Change 2: フィルターパネル（店舗・月範囲指定） */}
            <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">フィルター</span>
              </div>

              {/* 店舗フィルター */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">店舗</span>
                <Select value={globalStore} onValueChange={setGlobalStore}>
                  <SelectTrigger className="w-[130px] h-8 text-sm">
                    <SelectValue placeholder="店舗を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全店舗</SelectItem>
                    {allStores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 期間タイプ切替 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">期間</span>
                <Select value={periodType} onValueChange={(v) => setPeriodType(v as 'month' | 'range')}>
                  <SelectTrigger className="w-[110px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">1ヶ月単位</SelectItem>
                    <SelectItem value="range">月範囲指定</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 月範囲指定 */}
              {periodType === 'range' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Select value={String(rangeStartYear)} onValueChange={(v) => setRangeStartYear(Number(v))}>
                    <SelectTrigger className="w-[90px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map(y => (
                        <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={String(rangeStartMonth)} onValueChange={(v) => setRangeStartMonth(Number(v))}>
                    <SelectTrigger className="w-[70px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map(m => (
                        <SelectItem key={m} value={String(m)}>{m}月</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">〜</span>
                  <Select value={String(rangeEndYear)} onValueChange={(v) => setRangeEndYear(Number(v))}>
                    <SelectTrigger className="w-[90px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map(y => (
                        <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={String(rangeEndMonth)} onValueChange={(v) => setRangeEndMonth(Number(v))}>
                    <SelectTrigger className="w-[70px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map(m => (
                        <SelectItem key={m} value={String(m)}>{m}月</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 月次ランキング推移 */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              月次ランキング推移
            </CardTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
            {/* 指標選択 */}
            <Select value={transitionMetric} onValueChange={(v) => setTransitionMetric(v as SortKey)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="指標を選択" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 店舗選択 */}
            <Select value={transitionStore} onValueChange={setTransitionStore}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="店舗を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全店舗</SelectItem>
                {allStores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 期間選択 */}
            <Select value={String(transitionMonths)} onValueChange={(v) => setTransitionMonths(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="期間（月数)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">直近3ヶ月</SelectItem>
                <SelectItem value="6">直近6ヶ月</SelectItem>
                <SelectItem value="12">直近12ヶ月</SelectItem>
              </SelectContent>
            </Select>

            {/* 表示人数 */}
            <Select value={String(transitionTopN)} onValueChange={(v) => setTransitionTopN(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="表示人数" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">上位3名</SelectItem>
                <SelectItem value="5">上位5名</SelectItem>
                <SelectItem value="8">上位8名</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">データの取得に失敗しました</div>
          ) : (
            <RankingTransitionChart
              sourceData={hostessRankingData as HostessRanking[]}
              metric={transitionMetric}
              storeId={transitionStore}
              months={transitionMonths}
              topN={transitionTopN}
            />
          )}
        </CardContent>
      </Card>

      {/* 統計サマリー（Change 3: 本指名数カード追加） */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm text-gray-600">総ホステス数</p>
              <p className="text-2xl font-bold">{hostessRankingData.length}名</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">平均月間売上</p>
              <p className="text-2xl font-bold">
                ¥{hostessRankingData.length > 0
                  ? Math.round(hostessRankingData.reduce((sum, h) => sum + h.monthlyEarnings, 0) / hostessRankingData.length).toLocaleString()
                  : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Change 3: 本指名数カード */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm text-gray-600">総本指名数</p>
              <p className="text-2xl font-bold text-indigo-700">{totalHonShimei}件</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">平均満足度</p>
              <p className="text-2xl font-bold">
                {hostessRankingData.length > 0
                  ? (hostessRankingData.reduce((sum, h) => sum + h.customerSatisfactionScore, 0) / hostessRankingData.length).toFixed(1)
                  : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4つのランキングリスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RankingCard
          title="ランキング1"
          icon={Crown}
          sortKey={sortKeys[0]}
          onSortChange={(key) => handleSortChange(0, key)}
          hostessRankingData={hostessRankingData}
        />
        <RankingCard
          title="ランキング2"
          icon={TrendingUp}
          sortKey={sortKeys[1]}
          onSortChange={(key) => handleSortChange(1, key)}
          hostessRankingData={hostessRankingData}
        />
        <RankingCard
          title="ランキング3"
          icon={Award}
          sortKey={sortKeys[2]}
          onSortChange={(key) => handleSortChange(2, key)}
          hostessRankingData={hostessRankingData}
        />
        <RankingCard
          title="ランキング4"
          icon={Star}
          sortKey={sortKeys[3]}
          onSortChange={(key) => handleSortChange(3, key)}
          hostessRankingData={hostessRankingData}
        />
      </div>
    </div>
  );
}
