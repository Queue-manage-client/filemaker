'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
import {
  Edit3,
  Calendar,
  // TrendingUp,
  // Globe,
  // Users,
  // Store,
  // DollarSign,
  BarChart3,
  Clock,
  Activity,
  // FileSpreadsheet,
  Unlock,
  // Download,
  // CreditCard,
  UserCircle,
  Database,
  LogOut
} from "lucide-react";

export const RightPanel = () => {
  const sections = [
    {
      title: "F",
      items: [
        { name: "各店リスト", icon: Edit3, href: "/store-list" },
        { name: "ホステスマネージャリスト", icon: Calendar, href: "/hostess-manager-list" },
        { name: "店舗別実績ノルマ集計表", icon: BarChart3, href: "/store-customer-route-summary" },
        { name: "時間帯別ホステス出勤", icon: Clock, href: "/time-based-hostess-attendance" },
        { name: "リアルタイム自動成績集計表", icon: Activity, href: "/realtime-performance-summary" },
        { name: "店舗別メディア利用集計", icon: BarChart3, href: "/store-media-usage-summary" },
        { name: "ロック解除承認リスト", icon: Unlock, href: "/unlock-approval-list" }
      ]
    },
    {
      title: "G",
      items: [
        { name: "ホステス管理", icon: UserCircle, href: "/hostess-admin" },
        { name: "在籍・担当データ管理", icon: Database, href: "#" },
        { name: "退店管理", icon: LogOut, href: "#" }
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
                  variant="accent"
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