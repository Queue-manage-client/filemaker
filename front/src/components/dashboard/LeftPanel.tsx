'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
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
  const sections = [
    {
      title: "A",
      items: [
        { name: "RTⅡパネル", icon: Monitor, href: "/rt2-panel" },
        { name: "配車パネル2D", icon: Car, href: "/dispatch-panel-2d" },
        { name: "キャスト出勤予定票", icon: Calendar, href: "/cast-attendance-schedule" },
        { name: "ホステス出勤予定", icon: Calendar, href: "/hostess-schedule" },
        { name: "従業員出勤予定", icon: Calendar, href: "/employee-schedule" },
        { name: "手配表", icon: FileText, href: "/tehai" },
        { name: "ホステスランキング", icon: TrendingUp, href: "/hostess-ranking" }
      ]
    },
    {
      title: "B",
      items: [
        { name: "入金伝票", icon: DollarSign, href: "/income-slip" },
        { name: "出金伝票", icon: DollarSign, href: "/expense-slip" },
        { name: "売上伝票", icon: DollarSign, href: "/sales-slip" }
      ]
    },
    {
      title: "C",
      items: [
        { name: "管理用リスト", icon: FileText, href: "/management-list" },
        { name: "日報", icon: BarChart3, href: "/daily-report" },
        { name: "集計・グラフ", icon: TrendingUp, href: "/summary-graph" },
        { name: "従業員給与集計", icon: DollarSign, href: "/employee-salary" },
        { name: "会計集計", icon: BarChart3, href: "/accounting-summary" },
        { name: "面接リスト・集計", icon: Users, href: "/interview-list" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 gap-2">
            {section.items.map((item) => (
              <Link key={item.name} href={item.href}>
                <BusinessCard
                  variant="primary"
                  className="flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </BusinessCard>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};