'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
import {
  Monitor,
  Calendar,
  Users,
  FileText,
  Car,
  Clock,
  Activity,
  Award,
  TrendingUp,
} from "lucide-react";

export const LeftPanel = () => {
  const sections = [
    {
      title: "内勤",
      items: [
        { name: "RTⅡパネル", icon: Monitor, href: "/rt2-panel" },
        { name: "配車パネル2D", icon: Car, href: "/dispatch-panel-2d" },
        { name: "手配表", icon: FileText, href: "/tehai" },
        { name: "キャスト出勤予定票", icon: Calendar, href: "/cast-attendance-schedule" },
        { name: "ホステス出勤予定", icon: Calendar, href: "/hostess-schedule" },
        { name: "従業員出勤予定", icon: Calendar, href: "/employee-schedule" },
        { name: "週間ホステス出勤", icon: Calendar, href: "/weekly-hostess-attendance" },
        { name: "時間帯別ホステス出勤", icon: Clock, href: "/time-based-hostess-attendance" },
        { name: "リアルタイム成績集計", icon: Activity, href: "/realtime-performance-summary" },
        { name: "顧客台帳", icon: Users, href: "/customer-ledger" },
        { name: "顧客ポイント", icon: Award, href: "/customer-points" },
        { name: "ホステスランキング", icon: TrendingUp, href: "/hostess-ranking" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-bold mb-3 text-pink-700">{section.title}</h2>
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
