'use client';

import React, { useState } from 'react';
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
  ExternalLink,
  Search,
  Plus,
  Edit2,
  Trash2,
  Settings,
  MessageSquare,
  Mail,
  User,
  Store,
  Calendar,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  ChevronRight,
  Filter,
  MoreVertical,
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

export default function HostessAdminPage() {
  const [activeTab, setActiveTab] = useState<'cast-list' | 'announcements' | 'settings'>('cast-list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = 'ホステス管理 - Dispatch Harmony Hub';
  }, []);

  // 系列店リスト
  const storeList = [
    { id: 'all', name: 'すべての店舗' },
    { id: 'store1', name: '本店' },
    { id: 'store2', name: '新宿店' },
    { id: 'store3', name: '渋谷店' },
  ];

  // キャストリスト（サンプルデータ）
  const [castList, setCastList] = useState([
    {
      id: '1',
      name: '山田 花子',
      stageName: 'はなこ',
      storeId: 'store1',
      storeName: '本店',
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
      storeName: '本店',
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
      storeName: '新宿店',
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
      storeName: '渋谷店',
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
      storeName: '新宿店',
      status: 'active',
      thisMonthSales: 680000,
      nominations: 10,
      rank: 7,
      lineNotification: false,
      emailNotification: true,
      lastLogin: '2026-02-14 08:00',
    },
  ]);

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

  // タブメニュー
  const tabItems = [
    { id: 'cast-list', label: 'キャスト一覧', icon: Users },
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
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
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
                          <SelectItem value="store1">本店</SelectItem>
                          <SelectItem value="store2">新宿店</SelectItem>
                          <SelectItem value="store3">渋谷店</SelectItem>
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
