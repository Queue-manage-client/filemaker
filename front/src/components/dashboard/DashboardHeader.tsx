import { Search, Mail } from "lucide-react";
// LogOut は将来のログアウト機能で使用予定
import { BusinessCard } from "@/components/ui/business-card";

export const DashboardHeader = () => {
  // 現在の日付を取得
  const today = new Date();
  const todayStr = today.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  return (
    <div className="bg-gradient-header p-6 text-white shadow-pink border-t-2 border-pink-400">
      {/* Top row with access rights and user info */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm opacity-90">
          <div>アクセス権：admin</div>
          <div>ログインユーザ：test</div>
        </div>
        <div className="text-sm opacity-90">
          現在：{todayStr}
        </div>
      </div>

      {/* Main title section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">派遣業務管理システム</h1>
          <p className="text-lg opacity-90 italic">Dispatch business management system</p>
        </div>
        
        <div className="flex items-center gap-4">
          <BusinessCard variant="accent" className="flex items-center gap-2 px-4 py-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">顧客検索</span>
          </BusinessCard>
          <Mail className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
        </div>
      </div>

      {/* Version info */}
      <div className="text-right mt-2">
        <span className="text-sm opacity-75">管理者用メニュー ver.3.2</span>
      </div>
    </div>
  );
};