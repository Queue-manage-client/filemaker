'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  Database,
} from "lucide-react";

export const RightPanel = () => {
  const sections = [
    {
      title: "経理",
      variant: "accent" as const,
      titleColor: "text-rose-700",
      items: [
        { name: "入金伝票", icon: DollarSign, href: "/income-slip" },
        { name: "出金伝票", icon: DollarSign, href: "/expense-slip" },
        { name: "売上伝票", icon: DollarSign, href: "/sales-slip" },
        { name: "日報", icon: BarChart3, href: "/daily-report" },
        { name: "集計・グラフ", icon: TrendingUp, href: "/summary-graph" },
        { name: "従業員給与集計", icon: DollarSign, href: "/employee-salary" },
        { name: "アルバイト給与", icon: DollarSign, href: "/part-time-salary" },
        { name: "会計集計", icon: BarChart3, href: "/accounting-summary" },
      ],
    },
    {
      title: "広報",
      variant: "accent" as const,
      titleColor: "text-violet-700",
      items: [
        { name: "メディア管理", icon: Database, href: "/media-management" },
        { name: "店舗別メディア利用集計", icon: BarChart3, href: "/store-media-usage-summary" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <h2 className={`text-sm font-bold mb-3 ${section.titleColor}`}>{section.title}</h2>
          <div className="grid grid-cols-1 gap-2">
            {section.items.map((item) => (
              <Link key={item.name} href={item.href}>
                <BusinessCard
                  variant={section.variant}
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
