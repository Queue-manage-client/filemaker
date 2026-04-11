'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Users,
  Bell,
  Send,
  Search,
  Plus,
  Edit2,
  Trash2,
  Settings,
  MessageSquare,
  Mail,
  User,
  Store,
  TrendingUp,
  Eye,
  Copy,
  Check,
  Filter,
  MoreVertical,
  Award,
  AlertTriangle,
  Download,
  Calendar,
  Star,
  XCircle,
  ChevronUp,
  ChevronDown,
  Clock,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RankUpCandidate, AbsenceGuidanceTarget } from "@/types/hostess";
import { sampleRankUpCandidates, sampleAbsenceGuidanceTargets } from "@/data/hostessSampleData";

type ActiveTab = 'cast-list' | 'announcements' | 'rank-up' | 'absence-guidance' | 'settings';

export default function HostessAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cast-list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [selectedManager, setSelectedManager] = useState('all');
  const [selectedWarningLevel, setSelectedWarningLevel] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ランクアップ候補用フィルター
  const [rankUpStoreFilter, setRankUpStoreFilter] = useState('all');
  const [rankUpManagerFilter, setRankUpManagerFilter] = useState('all');
  const [rankUpSortField, setRankUpSortField] = useState<'avgMonthlyEarnings' | 'attendanceRate' | 'honShimeiCount' | 'consecutiveMonths'>('avgMonthlyEarnings');
  const [rankUpSortOrder, setRankUpSortOrder] = useState<'asc' | 'desc'>('desc');

  // 当欠指導対象用フィルター
  const [absenceStoreFilter, setAbsenceStoreFilter] = useState('all');
  const [absenceManagerFilter, setAbsenceManagerFilter] = useState('all');
  const [absenceWarningFilter, setAbsenceWarningFilter] = useState('all');
  const [absenceSortField, setAbsenceSortField] = useState<'absenceCount' | 'attendanceRate' | 'consecutiveAbsences'>('absenceCount');
  const [absenceSortOrder, setAbsenceSortOrder] = useState<'asc' | 'desc'>('desc');

  React.useEffect(() => {
    document.title = 'ホステス管理 - Dispatch Harmony Hub';
  }, []);

  // 系列店リスト
  const storeList = [
    { id: 'all', name: 'すべての店舗' },
    { id: 'store1', name: '京都本店' },
    { id: 'store2', name: 'FIRST店' },
    { id: 'store3', name: '人妻店' },
  ];

  // 担当者リスト
  const managerList = [
    { id: 'all', name: 'すべての担当者' },
    { id: 'mgr1', name: '田中' },
    { id: 'mgr2', name: '山田' },
    { id: 'mgr3', name: '佐藤' },
    { id: 'mgr4', name: '鈴木' },
  ];

  // カテゴリーリスト
  const categoryList = ['全て', 'レギュラー', '新人', '出稼ぎ', 'フリー'];

  // 警告レベルリスト
  const warningLevelList = [
    { id: 'all', name: 'すべてのレベル' },
    { id: 'critical', name: '緊急' },
    { id: 'high', name: '高' },
    { id: 'medium', name: '中' },
    { id: 'low', name: '低' },
  ];

  // キャストリスト（サンプルデータ）
  const [castList, setCastList] = useState([
    {
      id: '1',
      name: '山田 花子',
      stageName: 'はなこ',
      storeId: 'store1',
      storeName: '京都本店',
      category: 'レギュラー',
      status: 'active',
      thisMonthSales: 850000,
      nominations: 15,
      rank: 3,
      lineNotification: false,
      emailNotification: true,
      lastLogin: '2026-02-14 10:30',
    },
    {
      id: '2',
      name: '佐藤 美咲',
      stageName: 'みさき',
      storeId: 'store1',
      storeName: '京都本店',
      category: 'レギュラー',
      status: 'active',
      thisMonthSales: 920000,
      nominations: 18,
      rank: 1,
      lineNotification: false,
      emailNotification: true,
      lastLogin: '2026-02-14 09:15',
    },
    {
      id: '3',
      name: '鈴木 あやか',
      stageName: 'あやか',
      storeId: 'store2',
      storeName: 'FIRST店',
      category: '新人',
      status: 'active',
      thisMonthSales: 780000,
      nominations: 12,
      rank: 5,
      lineNotification: false,
      emailNotification: false,
      lastLogin: '2026-02-13 22:00',
    },
    {
      id: '4',
      name: '田中 りな',
      stageName: 'りな',
      storeId: 'store3',
      storeName: '人妻店',
      category: '出稼ぎ',
      status: 'inactive',
      thisMonthSales: 450000,
      nominations: 8,
      rank: 12,
      lineNotification: false,
      emailNotification: true,
      lastLogin: '2026-02-10 18:30',
    },
    {
      id: '5',
      name: '高橋 ゆい',
      stageName: 'ゆい',
      storeId: 'store2',
      storeName: 'FIRST店',
      category: 'フリー',
      status: 'active',
      thisMonthSales: 680000,
      nominations: 10,
      rank: 7,
      lineNotification: false,
      emailNotification: true,
      lastLogin: '2026-02-14 08:00',
    },
  ]);

  // ランクアップ候補データ
  const rankUpCandidates: RankUpCandidate[] = sampleRankUpCandidates;

  // 当欠指導対象データ
  const absenceGuidanceTargets: AbsenceGuidanceTarget[] = sampleAbsenceGuidanceTargets;

  // お知らせリスト
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: '【重要】バレンタインキャンペーンについて',
      content: '2月14日はバレンタインキャンペーンを実施します。特別コースのご案内をお願いします。',
      category: 'campaign',
      priority: 'high',
      targetStores: ['all'],
      createdAt: '2026-02-13 10:00',
      isPublished: true,
    },
    {
      id: '2',
      title: '新規ルール制定のお知らせ',
      content: '3月1日より、新しい勤務ルールが適用されます。詳細は添付資料をご確認ください。',
      category: 'rule',
      priority: 'normal',
      targetStores: ['all'],
      createdAt: '2026-02-10 14:30',
      isPublished: true,
    },
    {
      id: '3',
      title: '給与明細配布について',
      content: '今月の給与明細は15日に配布予定です。',
      category: 'info',
      priority: 'normal',
      targetStores: ['store1'],
      createdAt: '2026-02-08 09:00',
      isPublished: true,
    },
  ]);

  // 新規お知らせフォーム
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'info',
    priority: 'normal',
    targetStores: ['all'],
  });

  const [showNewAnnouncementDialog, setShowNewAnnouncementDialog] = useState(false);

  // フィルタリングされたキャストリスト
  const filteredCastList = castList
    .filter(cast => {
      if (selectedStore !== 'all' && cast.storeId !== selectedStore) return false;
      if (selectedCategory !== '全て' && cast.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          cast.name.toLowerCase().includes(query) ||
          cast.stageName.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => b.thisMonthSales - a.thisMonthSales);

  // フィルタリング・ソートされたランクアップ候補
  const filteredRankUpCandidates = useMemo(() => {
    let filtered = [...rankUpCandidates];

    if (rankUpStoreFilter !== 'all') {
      filtered = filtered.filter(c => c.storeId === rankUpStoreFilter);
    }
    if (rankUpManagerFilter !== 'all') {
      filtered = filtered.filter(c => c.managerId === rankUpManagerFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.hostessName.toLowerCase().includes(query) ||
        c.stageName.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[rankUpSortField];
      const bVal = b[rankUpSortField];
      return rankUpSortOrder === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    return filtered;
  }, [rankUpCandidates, rankUpStoreFilter, rankUpManagerFilter, searchQuery, rankUpSortField, rankUpSortOrder]);

  // フィルタリング・ソートされた当欠指導対象
  const filteredAbsenceTargets = useMemo(() => {
    let filtered = [...absenceGuidanceTargets];

    if (absenceStoreFilter !== 'all') {
      filtered = filtered.filter(t => t.storeId === absenceStoreFilter);
    }
    if (absenceManagerFilter !== 'all') {
      filtered = filtered.filter(t => t.managerId === absenceManagerFilter);
    }
    if (absenceWarningFilter !== 'all') {
      filtered = filtered.filter(t => t.warningLevel === absenceWarningFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.hostessName.toLowerCase().includes(query) ||
        t.stageName.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[absenceSortField];
      const bVal = b[absenceSortField];
      return absenceSortOrder === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    return filtered;
  }, [absenceGuidanceTargets, absenceStoreFilter, absenceManagerFilter, absenceWarningFilter, searchQuery, absenceSortField, absenceSortOrder]);

  // 統計情報
  const rankUpStats = useMemo(() => ({
    total: filteredRankUpCandidates.length,
    byStore: storeList.filter(s => s.id !== 'all').map(store => ({
      storeName: store.name,
      count: rankUpCandidates.filter(c => c.storeId === store.id).length
    })),
    avgEarnings: filteredRankUpCandidates.length > 0
      ? Math.round(filteredRankUpCandidates.reduce((sum, c) => sum + c.avgMonthlyEarnings, 0) / filteredRankUpCandidates.length)
      : 0,
  }), [filteredRankUpCandidates, rankUpCandidates]);

  const absenceStats = useMemo(() => ({
    total: filteredAbsenceTargets.length,
    critical: absenceGuidanceTargets.filter(t => t.warningLevel === 'critical').length,
    high: absenceGuidanceTargets.filter(t => t.warningLevel === 'high').length,
    medium: absenceGuidanceTargets.filter(t => t.warningLevel === 'medium').length,
    low: absenceGuidanceTargets.filter(t => t.warningLevel === 'low').length,
  }), [filteredAbsenceTargets, absenceGuidanceTargets]);

  // LINE通知トグル
  const toggleLineNotification = (castId: string) => {
    setCastList(prev => prev.map(cast =>
      cast.id === castId ? { ...cast, lineNotification: !cast.lineNotification } : cast
    ));
  };

  // メール通知トグル
  const toggleEmailNotification = (castId: string) => {
    setCastList(prev => prev.map(cast =>
      cast.id === castId ? { ...cast, emailNotification: !cast.emailNotification } : cast
    ));
  };

  // マイページURL生成
  const generateMyPageUrl = (castId: string) => {
    return `${window.location.origin}/hostess-management?cast_id=${castId}`;
  };

  // URLコピー
  const copyToClipboard = async (castId: string) => {
    const url = generateMyPageUrl(castId);
    await navigator.clipboard.writeText(url);
    setCopiedId(castId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // お知らせ追加
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('タイトルと内容は必須です');
      return;
    }
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAnnouncements(prev => [{
      id: String(Date.now()),
      ...newAnnouncement,
      createdAt: dateStr,
      isPublished: true,
    }, ...prev]);

    setNewAnnouncement({
      title: '',
      content: '',
      category: 'info',
      priority: 'normal',
      targetStores: ['all'],
    });
    setShowNewAnnouncementDialog(false);
  };

  // お知らせ削除
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // CSV出力
  const exportRankUpCSV = () => {
    const headers = ['源氏名', '本名', '店舗', '担当者', '現在ランク', 'カテゴリー', '連続月数', '平均月収', '出勤率', '本指名数', '推薦理由'];
    const rows = filteredRankUpCandidates.map(c => [
      c.stageName,
      c.hostessName,
      c.storeName,
      c.managerName,
      c.currentRank,
      c.currentCategory,
      c.consecutiveMonths,
      c.avgMonthlyEarnings,
      `${(c.attendanceRate * 100).toFixed(1)}%`,
      c.honShimeiCount,
      c.reason,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ランクアップ候補_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAbsenceCSV = () => {
    const headers = ['源氏名', '本名', '店舗', '担当者', '欠勤回数', '最終欠勤日', '予定出勤日数', '出勤率', '連続欠勤', '警告レベル', '備考'];
    const rows = filteredAbsenceTargets.map(t => [
      t.stageName,
      t.hostessName,
      t.storeName,
      t.managerName,
      t.absenceCount,
      t.lastAbsenceDate,
      t.totalScheduledDays,
      `${(t.attendanceRate * 100).toFixed(1)}%`,
      t.consecutiveAbsences,
      t.warningLevel === 'critical' ? '緊急' : t.warningLevel === 'high' ? '高' : t.warningLevel === 'medium' ? '中' : '低',
      t.notes || '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `当欠指導対象_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 警告レベルのバッジ
  const getWarningBadge = (level: 'low' | 'medium' | 'high' | 'critical') => {
    const styles = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white',
    };
    const labels = {
      critical: '緊急',
      high: '高',
      medium: '中',
      low: '低',
    };
    return <Badge className={styles[level]}>{labels[level]}</Badge>;
  };

  // タブメニュー
  const tabItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'cast-list', label: 'キャスト一覧', icon: Users },
    { id: 'rank-up', label: 'ランクアップ候補', icon: Award },
    { id: 'absence-guidance', label: '当欠指導対象', icon: AlertTriangle },
    { id: 'announcements', label: 'お知らせ管理', icon: Bell },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/dashboard">
              <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </button>
            </Link>
            <h1 className="text-white text-lg lg:text-xl font-bold">ホステス管理</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white">管理者</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* タブメニュー */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
              {tab.id === 'rank-up' && rankUpStats.total > 0 && (
                <Badge className="bg-green-500 text-white text-xs px-1.5 py-0">{rankUpStats.total}</Badge>
              )}
              {tab.id === 'absence-guidance' && absenceStats.total > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">{absenceStats.total}</Badge>
              )}
            </button>
          ))}
        </div>

        {/* キャスト一覧 */}
        {activeTab === 'cast-list' && (
          <div className="space-y-4">
            {/* 検索・フィルター */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="キャスト名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Store className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="店舗" />
                </SelectTrigger>
                <SelectContent>
                  {storeList.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="カテゴリー" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 結果件数 */}
            <div className="text-sm text-gray-500">
              {filteredCastList.length}名のキャスト
            </div>

            {/* キャストカード */}
            <div className="grid gap-4">
              {filteredCastList.map(cast => (
                <Card key={cast.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* キャスト情報 */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800">{cast.stageName}</span>
                            <span className="text-sm text-gray-500">({cast.name})</span>
                            <Badge className={cast.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>
                              {cast.status === 'active' ? '在籍' : '休止'}
                            </Badge>
                            <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50">
                              {cast.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              {cast.storeName}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {cast.rank}位
                            </span>
                            <span>¥{cast.thisMonthSales.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* 通知トグル */}
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg">
                          {/* LINE通知 */}
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-600 hidden sm:inline">LINE</span>
                            <Switch
                              checked={cast.lineNotification}
                              onCheckedChange={() => toggleLineNotification(cast.id)}
                            />
                          </div>
                          {/* メール通知 */}
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-gray-600 hidden sm:inline">メール</span>
                            <Switch
                              checked={cast.emailNotification}
                              onCheckedChange={() => toggleEmailNotification(cast.id)}
                            />
                          </div>
                        </div>

                        {/* URLコピー */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => copyToClipboard(cast.id)}
                        >
                          {copiedId === cast.id ? (
                            <><Check className="w-4 h-4 text-green-500" /><span className="hidden sm:inline">コピー済</span></>
                          ) : (
                            <><Copy className="w-4 h-4" /><span className="hidden sm:inline">URL</span></>
                          )}
                        </Button>

                        {/* 詳細ボタン */}
                        <Link href={`/hostess-management?cast_id=${cast.id}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">詳細</span>
                          </Button>
                        </Link>

                        {/* メニュー */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              const url = generateMyPageUrl(cast.id);
                              window.open(`https://line.me/R/msg/text/?${encodeURIComponent(`マイページURL: ${url}`)}`, '_blank');
                            }}>
                              <Send className="w-4 h-4 mr-2" />
                              LINEでURL送信
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ランクアップ候補 */}
        {activeTab === 'rank-up' && (
          <div className="space-y-4">
            {/* 統計カード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">候補者総数</span>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{rankUpStats.total}名</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">平均月収</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">¥{rankUpStats.avgEarnings.toLocaleString()}</div>
                </CardContent>
              </Card>
              {rankUpStats.byStore.slice(0, 2).map((store, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-700 font-medium truncate">{store.storeName}</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">{store.count}名</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* フィルター */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="キャスト名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={rankUpStoreFilter} onValueChange={setRankUpStoreFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Store className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="店舗" />
                </SelectTrigger>
                <SelectContent>
                  {storeList.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rankUpManagerFilter} onValueChange={setRankUpManagerFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="担当者" />
                </SelectTrigger>
                <SelectContent>
                  {managerList.map(mgr => (
                    <SelectItem key={mgr.id} value={mgr.id}>{mgr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2" onClick={exportRankUpCSV}>
                <Download className="w-4 h-4" />
                CSV出力
              </Button>
            </div>

            {/* テーブル */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="whitespace-nowrap">源氏名</TableHead>
                        <TableHead className="whitespace-nowrap">店舗</TableHead>
                        <TableHead className="whitespace-nowrap">担当者</TableHead>
                        <TableHead className="whitespace-nowrap">現在ランク</TableHead>
                        <TableHead className="whitespace-nowrap">カテゴリー</TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (rankUpSortField === 'consecutiveMonths') {
                                setRankUpSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setRankUpSortField('consecutiveMonths');
                                setRankUpSortOrder('desc');
                              }
                            }}
                          >
                            連続月数
                            {rankUpSortField === 'consecutiveMonths' && (rankUpSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (rankUpSortField === 'avgMonthlyEarnings') {
                                setRankUpSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setRankUpSortField('avgMonthlyEarnings');
                                setRankUpSortOrder('desc');
                              }
                            }}
                          >
                            平均月収
                            {rankUpSortField === 'avgMonthlyEarnings' && (rankUpSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (rankUpSortField === 'attendanceRate') {
                                setRankUpSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setRankUpSortField('attendanceRate');
                                setRankUpSortOrder('desc');
                              }
                            }}
                          >
                            出勤率
                            {rankUpSortField === 'attendanceRate' && (rankUpSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (rankUpSortField === 'honShimeiCount') {
                                setRankUpSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setRankUpSortField('honShimeiCount');
                                setRankUpSortOrder('desc');
                              }
                            }}
                          >
                            本指名
                            {rankUpSortField === 'honShimeiCount' && (rankUpSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">推薦理由</TableHead>
                        <TableHead className="whitespace-nowrap">アクション</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRankUpCandidates.map((candidate) => (
                        <TableRow key={candidate.hostessId} className="hover:bg-green-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{candidate.stageName}</div>
                                <div className="text-xs text-gray-500">{candidate.hostessName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{candidate.storeName}</TableCell>
                          <TableCell>{candidate.managerName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                              {candidate.currentRank}位
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{candidate.currentCategory}</Badge>
                          </TableCell>
                          <TableCell>{candidate.consecutiveMonths}ヶ月</TableCell>
                          <TableCell className="font-medium">¥{candidate.avgMonthlyEarnings.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={candidate.attendanceRate >= 0.9 ? 'bg-green-500' : candidate.attendanceRate >= 0.8 ? 'bg-yellow-500' : 'bg-red-500'}>
                              {(candidate.attendanceRate * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{candidate.honShimeiCount}件</TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-gray-600">{candidate.reason}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Link href={`/hostess-ledger?id=${candidate.hostessId}`}>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Eye className="w-3 h-3" />
                                  詳細
                                </Button>
                              </Link>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                                <Award className="w-3 h-3" />
                                承認
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredRankUpCandidates.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                            該当するランクアップ候補がいません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 当欠指導対象 */}
        {activeTab === 'absence-guidance' && (
          <div className="space-y-4">
            {/* 統計カード */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">対象者総数</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{absenceStats.total}名</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700 font-medium">緊急</span>
                  </div>
                  <div className="text-2xl font-bold text-red-800">{absenceStats.critical}名</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-700 font-medium">高</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-800">{absenceStats.high}名</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-50 to-lime-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-700 font-medium">中</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-800">{absenceStats.medium}名</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">低</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{absenceStats.low}名</div>
                </CardContent>
              </Card>
            </div>

            {/* フィルター */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="キャスト名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={absenceStoreFilter} onValueChange={setAbsenceStoreFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Store className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="店舗" />
                </SelectTrigger>
                <SelectContent>
                  {storeList.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={absenceManagerFilter} onValueChange={setAbsenceManagerFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="担当者" />
                </SelectTrigger>
                <SelectContent>
                  {managerList.map(mgr => (
                    <SelectItem key={mgr.id} value={mgr.id}>{mgr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={absenceWarningFilter} onValueChange={setAbsenceWarningFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="警告レベル" />
                </SelectTrigger>
                <SelectContent>
                  {warningLevelList.map(level => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2" onClick={exportAbsenceCSV}>
                <Download className="w-4 h-4" />
                CSV出力
              </Button>
            </div>

            {/* テーブル */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="whitespace-nowrap">警告</TableHead>
                        <TableHead className="whitespace-nowrap">源氏名</TableHead>
                        <TableHead className="whitespace-nowrap">店舗</TableHead>
                        <TableHead className="whitespace-nowrap">担当者</TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (absenceSortField === 'absenceCount') {
                                setAbsenceSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setAbsenceSortField('absenceCount');
                                setAbsenceSortOrder('desc');
                              }
                            }}
                          >
                            欠勤回数
                            {absenceSortField === 'absenceCount' && (absenceSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">最終欠勤日</TableHead>
                        <TableHead className="whitespace-nowrap">予定日数</TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (absenceSortField === 'attendanceRate') {
                                setAbsenceSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setAbsenceSortField('attendanceRate');
                                setAbsenceSortOrder('desc');
                              }
                            }}
                          >
                            出勤率
                            {absenceSortField === 'attendanceRate' && (absenceSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-indigo-600"
                            onClick={() => {
                              if (absenceSortField === 'consecutiveAbsences') {
                                setAbsenceSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                              } else {
                                setAbsenceSortField('consecutiveAbsences');
                                setAbsenceSortOrder('desc');
                              }
                            }}
                          >
                            連続欠勤
                            {absenceSortField === 'consecutiveAbsences' && (absenceSortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                          </button>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">備考</TableHead>
                        <TableHead className="whitespace-nowrap">アクション</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAbsenceTargets.map((target) => (
                        <TableRow
                          key={target.hostessId}
                          className={
                            target.warningLevel === 'critical' ? 'bg-red-50 hover:bg-red-100' :
                            target.warningLevel === 'high' ? 'bg-orange-50 hover:bg-orange-100' :
                            target.warningLevel === 'medium' ? 'bg-yellow-50 hover:bg-yellow-100' :
                            'hover:bg-gray-50'
                          }
                        >
                          <TableCell>{getWarningBadge(target.warningLevel)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                target.warningLevel === 'critical' ? 'bg-red-500' :
                                target.warningLevel === 'high' ? 'bg-orange-500' :
                                target.warningLevel === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}>
                                <AlertTriangle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{target.stageName}</div>
                                <div className="text-xs text-gray-500">{target.hostessName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{target.storeName}</TableCell>
                          <TableCell>{target.managerName}</TableCell>
                          <TableCell>
                            <span className={`font-bold ${
                              target.absenceCount >= 5 ? 'text-red-600' :
                              target.absenceCount >= 3 ? 'text-orange-600' :
                              'text-gray-700'
                            }`}>
                              {target.absenceCount}回
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{target.lastAbsenceDate}</TableCell>
                          <TableCell>{target.totalScheduledDays}日</TableCell>
                          <TableCell>
                            <Badge className={
                              target.attendanceRate >= 0.8 ? 'bg-green-500' :
                              target.attendanceRate >= 0.6 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }>
                              {(target.attendanceRate * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${
                              target.consecutiveAbsences >= 3 ? 'text-red-600' :
                              target.consecutiveAbsences >= 2 ? 'text-orange-600' :
                              'text-gray-700'
                            }`}>
                              {target.consecutiveAbsences}日
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate text-sm text-gray-600">{target.notes || '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Link href={`/hostess-ledger?id=${target.hostessId}`}>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Eye className="w-3 h-3" />
                                  詳細
                                </Button>
                              </Link>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 gap-1">
                                <MessageSquare className="w-3 h-3" />
                                連絡
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredAbsenceTargets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                            該当する当欠指導対象がいません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 担当者別サマリー */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  担当者別サマリー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {managerList.filter(m => m.id !== 'all').map((manager) => {
                    const managerTargets = absenceGuidanceTargets.filter(t => t.managerId === manager.id);
                    const criticalCount = managerTargets.filter(t => t.warningLevel === 'critical').length;
                    const highCount = managerTargets.filter(t => t.warningLevel === 'high').length;
                    return (
                      <div key={manager.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium">{manager.name}</div>
                            <div className="text-xs text-gray-500">担当者</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">指導対象</span>
                            <span className="font-medium">{managerTargets.length}名</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-600">緊急</span>
                            <span className="font-medium text-red-600">{criticalCount}名</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-orange-600">高</span>
                            <span className="font-medium text-orange-600">{highCount}名</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* お知らせ管理 */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {/* 新規作成ボタン */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">お知らせ一覧</h2>
              <Dialog open={showNewAnnouncementDialog} onOpenChange={setShowNewAnnouncementDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新規作成
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>新規お知らせ作成</DialogTitle>
                    <DialogDescription>
                      キャストに伝達するお知らせを作成します
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">タイトル</label>
                      <Input
                        placeholder="お知らせのタイトル"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">内容</label>
                      <Textarea
                        placeholder="お知らせの内容"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">カテゴリ</label>
                        <Select
                          value={newAnnouncement.category}
                          onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">お知らせ</SelectItem>
                            <SelectItem value="campaign">キャンペーン</SelectItem>
                            <SelectItem value="rule">ルール</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">重要度</label>
                        <Select
                          value={newAnnouncement.priority}
                          onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">通常</SelectItem>
                            <SelectItem value="high">重要</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">対象店舗</label>
                      <Select
                        value={newAnnouncement.targetStores[0]}
                        onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, targetStores: [value] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべての店舗</SelectItem>
                          <SelectItem value="store1">京都本店</SelectItem>
                          <SelectItem value="store2">FIRST店</SelectItem>
                          <SelectItem value="store3">人妻店</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewAnnouncementDialog(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={handleAddAnnouncement} className="bg-indigo-600 hover:bg-indigo-700">
                      作成する
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* お知らせリスト */}
            <div className="space-y-3">
              {announcements.map(announcement => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {announcement.priority === 'high' && (
                            <Badge className="bg-red-500">重要</Badge>
                          )}
                          <Badge variant="outline">
                            {announcement.category === 'campaign' ? 'キャンペーン' :
                             announcement.category === 'rule' ? 'ルール' : 'お知らせ'}
                          </Badge>
                          <span className="text-xs text-gray-400">{announcement.createdAt}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Store className="w-3 h-3" />
                          {announcement.targetStores.includes('all')
                            ? 'すべての店舗'
                            : announcement.targetStores.map(s =>
                                storeList.find(store => store.id === s)?.name
                              ).join(', ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>お知らせを削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 設定 */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* 新規キャストのデフォルト設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  新規キャストのデフォルト設定
                  <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded font-bold">初期値</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">LINE通知</div>
                      <div className="text-sm text-gray-500">新規登録時のLINE通知初期値（OFFを推奨）</div>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">メール通知</div>
                      <div className="text-sm text-gray-500">新規登録時のメール通知初期値</div>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>

            {/* LINE通知設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  LINE通知設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">予約通知</div>
                    <div className="text-sm text-gray-500">新規予約が入った際にLINEで通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">キャンセル通知</div>
                    <div className="text-sm text-gray-500">予約がキャンセルされた際にLINEで通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">出勤確認リマインド</div>
                    <div className="text-sm text-gray-500">出勤日の朝に確認リマインドを送信</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>

            {/* メール通知設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  メール通知設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">予約通知</div>
                    <div className="text-sm text-gray-500">新規予約が入った際にメールで通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">キャンセル通知</div>
                    <div className="text-sm text-gray-500">予約がキャンセルされた際にメールで通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">出勤確認リマインド</div>
                    <div className="text-sm text-gray-500">出勤日の朝に確認リマインドを送信</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">給与明細通知</div>
                    <div className="text-sm text-gray-500">給与明細が発行された際にメールで通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">一括操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-2" />
                  全キャストにマイページURLを一括送信
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  全キャストに緊急お知らせを送信
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
