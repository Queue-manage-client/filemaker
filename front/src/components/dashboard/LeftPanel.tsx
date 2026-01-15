'use client';

import { BusinessCard } from "@/components/ui/business-card";
import { useRouter } from "next/navigation";
import { 
  Monitor, 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  // Search,
  TrendingUp,
  // Camera,
  // Star,
  Car,
  // Building
} from "lucide-react";

export const LeftPanel = () => {
  const router = useRouter();

  const handleNavigation = (name: string) => {
    // 配車パネル2Dはメイン画面に遷移し、サブ画面を別ウィンドウで開く
    if (name === "配車パネル2D") {
      const baseUrl = window.location.origin;
      // サブ画面を別ウィンドウで開く
      window.open(`${baseUrl}/dispatch-panel-2d-sub`, 'dispatch-panel-2d-sub', 'width=800,height=600');
      // メイン画面に遷移
      router.push('/dispatch-panel-2d');
      return;
    }

    const routeMap: { [key: string]: string } = {
      "RTⅡパネル": "/rt2-panel",
      "ホステス出勤予定": "/hostess-schedule",
      "従業員出勤予定": "/employee-schedule",
      "手配表": "/tehai",
      "ホステスランキング": "/hostess-ranking",
      "入金伝票": "/income-slip",
      "出金伝票": "/expense-slip",
      "売上伝票": "/sales-slip",
      "管理用リスト": "/management-list",
      "日報": "/daily-report",
      "集計・グラフ": "/summary-graph",
      "従業員給与集計": "/employee-salary",
      "会計集計": "/accounting-summary",
      "面接リスト・集計": "/interview-list",
      "アルバイト給与月計": "/part-time-salary"
    };

    const route = routeMap[name];
    if (route) {
      router.push(route);
    }
  };

  const sections = [
    {
      title: "A",
      items: [
        { name: "RTⅡパネル", icon: Monitor },
        { name: "配車パネル2D", icon: Car },
        { name: "ホステス出勤予定", icon: Calendar },
        { name: "従業員出勤予定", icon: Calendar },
        { name: "手配表", icon: FileText },
        { name: "ホステスランキング", icon: TrendingUp }
      ]
    },
    {
      title: "B",
      items: [
        { name: "入金伝票", icon: DollarSign },
        { name: "出金伝票", icon: DollarSign },
        { name: "売上伝票", icon: DollarSign }
      ]
    },
    {
      title: "C",
      items: [
        { name: "管理用リスト", icon: FileText },
        { name: "日報", icon: BarChart3 },
        { name: "集計・グラフ", icon: TrendingUp },
        { name: "従業員給与集計", icon: DollarSign },
        { name: "会計集計", icon: BarChart3 },
        { name: "面接リスト・集計", icon: Users },
        { name: "アルバイト給与月計", icon: DollarSign }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 gap-2">
            {section.items.map((item) => (
              <BusinessCard 
                key={item.name} 
                variant="primary"
                className="flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                onClick={() => handleNavigation(item.name)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </BusinessCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};