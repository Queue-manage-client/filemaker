'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Search, Filter, Users, Download, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleWeeklyAttendance, sampleStoreCategoryStats, sampleManagerHostessStats } from "@/data/hostessSampleData";
import type { WeeklyHostessAttendance } from "@/types/hostess";

// 日付を加算する関数
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// 日付をフォーマットする関数
const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 曜日を取得する関数
const getDayOfWeek = (date: Date): string => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
};

// ステータスに応じたバッジカラーを取得
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return <Badge className="bg-green-500 text-white text-[10px] px-1">出勤</Badge>;
    case 'absent':
      return <Badge className="bg-red-500 text-white text-[10px] px-1">欠勤</Badge>;
    case 'late':
      return <Badge className="bg-yellow-500 text-white text-[10px] px-1">遅刻</Badge>;
    case 'early_leave':
      return <Badge className="bg-orange-500 text-white text-[10px] px-1">早退</Badge>;
    case 'day_off':
      return <Badge className="bg-gray-400 text-white text-[10px] px-1">休み</Badge>;
    default:
      return <Badge className="bg-gray-300 text-[10px] px-1">-</Badge>;
  }
};

export default function WeeklyHostessAttendance() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // 月曜日を取得
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // フィルター状態
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterManager, setFilterManager] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAttendance, setFilterAttendance] = useState<string>('all'); // all, present, absent
  const [searchText, setSearchText] = useState<string>('');

  React.useEffect(() => {
    document.title = '週間ホステス出勤 - Dispatch Harmony Hub';
  }, []);

  // 週の日付リストを生成
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeekStart, i);
      dates.push({
        date: formatDate(date),
        display: `${date.getMonth() + 1}/${date.getDate()}(${getDayOfWeek(date)})`,
        dayOfWeek: getDayOfWeek(date),
        isToday: formatDate(date) === formatDate(new Date())
      });
    }
    return dates;
  }, [currentWeekStart]);

  // フィルター適用されたデータ
  const filteredData = useMemo(() => {
    let data = [...sampleWeeklyAttendance];

    // 店舗フィルター
    if (filterStore !== 'all') {
      data = data.filter(item => item.storeId === filterStore);
    }

    // 担当者フィルター
    if (filterManager !== 'all') {
      data = data.filter(item => item.managerId === filterManager);
    }

    // カテゴリーフィルター
    if (filterCategory !== 'all') {
      data = data.filter(item => item.category === filterCategory);
    }

    // 出勤有無フィルター
    if (filterAttendance === 'present') {
      data = data.filter(item => {
        const hasPresent = weekDates.some(d => {
          const attendance = item.dailyAttendance[d.date];
          return attendance && ['present', 'late', 'early_leave'].includes(attendance.status);
        });
        return hasPresent;
      });
    } else if (filterAttendance === 'absent') {
      data = data.filter(item => {
        const hasAbsent = weekDates.some(d => {
          const attendance = item.dailyAttendance[d.date];
          return attendance && attendance.status === 'absent';
        });
        return hasAbsent;
      });
    }

    // テキスト検索
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      data = data.filter(item =>
        item.hostessName.toLowerCase().includes(lowerSearch) ||
        (item.storeName && item.storeName.toLowerCase().includes(lowerSearch)) ||
        (item.managerName && item.managerName.toLowerCase().includes(lowerSearch))
      );
    }

    return data;
  }, [filterStore, filterManager, filterCategory, filterAttendance, searchText, weekDates]);

  // 店舗リスト
  const stores = useMemo(() => {
    const storeMap = new Map<string, string>();
    sampleWeeklyAttendance.forEach(item => {
      if (item.storeId && item.storeName) {
        storeMap.set(item.storeId, item.storeName);
      }
    });
    return Array.from(storeMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // 担当者リスト
  const managers = useMemo(() => {
    const managerMap = new Map<string, string>();
    sampleWeeklyAttendance.forEach(item => {
      if (item.managerId && item.managerName) {
        managerMap.set(item.managerId, item.managerName);
      }
    });
    return Array.from(managerMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // カテゴリーリスト
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    sampleWeeklyAttendance.forEach(item => {
      if (item.category) categorySet.add(item.category);
    });
    return Array.from(categorySet);
  }, []);

  // 週のナビゲーション
  const handlePrevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  // CSV出力
  const exportToCSV = () => {
    const headers = ['名前', 'カテゴリー', '店舗', '担当者', ...weekDates.map(d => d.display), '出勤率'];
    const csvData = filteredData.map(item => {
      const dailyData = weekDates.map(d => {
        const attendance = item.dailyAttendance[d.date];
        if (!attendance) return '-';
        if (attendance.status === 'day_off') return '休';
        if (attendance.status === 'absent') return '欠';
        if (attendance.status === 'present') return `${attendance.startTime || ''}-${attendance.endTime || ''}`;
        if (attendance.status === 'late') return `遅${attendance.startTime || ''}`;
        if (attendance.status === 'early_leave') return `早${attendance.endTime || ''}`;
        return '-';
      });
      return [
        item.hostessName,
        item.category,
        item.storeName || '',
        item.managerName || '',
        ...dailyData,
        `${item.attendanceRate}%`
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `weekly_attendance_${formatDate(currentWeekStart)}.csv`;
    link.click();
  };

  // 統計サマリー
  const stats = useMemo(() => {
    const total = filteredData.length;
    const presentCount = filteredData.filter(item => {
      return weekDates.some(d => {
        const attendance = item.dailyAttendance[d.date];
        return attendance && ['present', 'late', 'early_leave'].includes(attendance.status);
      });
    }).length;
    const avgAttendance = filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.attendanceRate, 0) / filteredData.length
      : 0;
    const newbies = filteredData.filter(item => item.isNewbie).length;
    return { total, presentCount, avgAttendance: avgAttendance.toFixed(1), newbies };
  }, [filteredData, weekDates]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">週間ホステス出勤</h1>
                <p className="text-sm text-gray-600">担当キャスト日別・店舗別（週単位）出勤管理</p>
              </div>
            </div>

            {/* 週ナビゲーション */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                <ChevronLeft className="w-4 h-4" />
                前週
              </Button>
              <Button variant="outline" size="sm" onClick={handleThisWeek}>
                今週
              </Button>
              <div className="px-4 py-2 bg-blue-50 rounded-lg font-bold text-blue-700">
                {`${currentWeekStart.getFullYear()}年${currentWeekStart.getMonth() + 1}月${currentWeekStart.getDate()}日週`}
              </div>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                翌週
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-1" />
              CSV出力
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* フィルター */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">フィルター:</span>
            </div>

            {/* 店舗フィルター */}
            <Select value={filterStore} onValueChange={setFilterStore}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="店舗" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全店舗</SelectItem>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 担当者フィルター */}
            <Select value={filterManager} onValueChange={setFilterManager}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="担当者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全担当者</SelectItem>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* カテゴリーフィルター */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="カテゴリー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全カテゴリー</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 出勤有無フィルター */}
            <Select value={filterAttendance} onValueChange={setFilterAttendance}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="出勤状況" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="present">出勤あり</SelectItem>
                <SelectItem value="absent">欠勤あり</SelectItem>
              </SelectContent>
            </Select>

            {/* テキスト検索 */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="名前・店舗・担当者で検索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-[200px]"
              />
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計サマリー */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">表示中の人数</p>
                <p className="text-xl font-bold">{stats.total}名</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">今週出勤あり</p>
                <p className="text-xl font-bold">{stats.presentCount}名</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-purple-600 font-bold">%</div>
              <div>
                <p className="text-xs text-gray-500">平均出勤率</p>
                <p className="text-xl font-bold">{stats.avgAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">新人</p>
                <p className="text-xl font-bold">{stats.newbies}名</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインテーブル */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="sticky left-0 bg-gray-50 z-10 min-w-[100px]">名前</TableHead>
                  <TableHead className="min-w-[80px]">カテゴリー</TableHead>
                  <TableHead className="min-w-[100px]">店舗</TableHead>
                  <TableHead className="min-w-[100px]">担当者</TableHead>
                  {weekDates.map(d => (
                    <TableHead
                      key={d.date}
                      className={`text-center min-w-[100px] ${d.isToday ? 'bg-blue-100' : ''} ${d.dayOfWeek === '土' ? 'bg-blue-50' : ''} ${d.dayOfWeek === '日' ? 'bg-red-50' : ''}`}
                    >
                      <div className={`${d.dayOfWeek === '土' ? 'text-blue-600' : ''} ${d.dayOfWeek === '日' ? 'text-red-600' : ''}`}>
                        {d.display}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[80px]">出勤率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(item => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="sticky left-0 bg-white z-10 font-medium">
                      <div className="flex items-center gap-1">
                        {item.isNewbie && (
                          <Badge className="bg-green-500 text-white text-[9px] px-1">新人</Badge>
                        )}
                        {item.hostessName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${
                        item.category === 'VIP' ? 'border-purple-500 text-purple-700' :
                        item.category === 'Lady' ? 'border-pink-500 text-pink-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.storeName || '-'}</TableCell>
                    <TableCell className="text-sm">{item.managerName || '-'}</TableCell>
                    {weekDates.map(d => {
                      const attendance = item.dailyAttendance[d.date];
                      return (
                        <TableCell
                          key={d.date}
                          className={`text-center ${d.isToday ? 'bg-blue-50' : ''} ${d.dayOfWeek === '土' ? 'bg-blue-50/50' : ''} ${d.dayOfWeek === '日' ? 'bg-red-50/50' : ''}`}
                        >
                          {attendance ? (
                            <div className="flex flex-col items-center gap-1">
                              {getStatusBadge(attendance.status)}
                              {attendance.startTime && attendance.endTime && (
                                <span className="text-[10px] text-gray-600">
                                  {attendance.startTime}-{attendance.endTime}
                                </span>
                              )}
                              {attendance.notes && (
                                <span className="text-[9px] text-orange-600 truncate max-w-[90px]" title={attendance.notes}>
                                  {attendance.notes}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <div className={`font-bold ${
                        item.attendanceRate >= 90 ? 'text-green-600' :
                        item.attendanceRate >= 70 ? 'text-blue-600' :
                        item.attendanceRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {item.attendanceRate}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={weekDates.length + 5} className="text-center py-8 text-gray-500">
                      該当するデータがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 店舗別カテゴリー統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {sampleStoreCategoryStats.map(store => (
          <Card key={store.storeId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{store.storeName}</span>
                <Badge variant="outline">
                  {store.totalHostesses}名 / {store.overallAttendanceRate.toFixed(1)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {store.categories.map(cat => (
                  <div key={cat.categoryName} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${
                        cat.categoryName === 'VIP' ? 'border-purple-500 text-purple-700' :
                        cat.categoryName === 'Lady' ? 'border-pink-500 text-pink-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {cat.categoryName}
                      </Badge>
                      <span className="text-gray-600">{cat.totalCount}名</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium ${
                        cat.attendanceRate >= 90 ? 'text-green-600' :
                        cat.attendanceRate >= 70 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {cat.attendanceRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 担当者別統計 */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">担当者別在籍統計</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>担当者名</TableHead>
                <TableHead className="text-center">総人数</TableHead>
                <TableHead className="text-center">2ヶ月以上</TableHead>
                <TableHead className="text-center">2ヶ月未満</TableHead>
                <TableHead className="text-center">新人</TableHead>
                <TableHead className="text-center">定着率</TableHead>
                <TableHead className="text-center">平均出勤率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleManagerHostessStats.map(manager => (
                <TableRow key={manager.managerId}>
                  <TableCell className="font-medium">{manager.managerName}</TableCell>
                  <TableCell className="text-center">{manager.totalHostesses}名</TableCell>
                  <TableCell className="text-center text-green-600 font-medium">{manager.hostessesOver2Months}名</TableCell>
                  <TableCell className="text-center text-orange-600">{manager.hostessesUnder2Months}名</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-500 text-white">{manager.newbies}名</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${manager.retentionRate >= 90 ? 'text-green-600' : manager.retentionRate >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {manager.retentionRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${manager.avgAttendanceRate >= 85 ? 'text-green-600' : manager.avgAttendanceRate >= 75 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {manager.avgAttendanceRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
