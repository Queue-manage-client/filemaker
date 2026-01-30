'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
import {
  Building,
  Users,
  // UserCheck,
  Award,
  MapPin,
  Hotel,
  // Calculator,
  Settings,
  Database,
  Map,
  Calendar
} from "lucide-react";

export const CenterPanel = () => {
  const sections = [
    {
      title: "D",
      items: [
        { name: "グループ台帳", icon: Building, href: "/group-ledger" },
        { name: "店舗台帳", icon: Building, href: "/store-ledger" },
        { name: "顧客台帳", icon: Users, href: "/customer-ledger" },
        { name: "顧客ポイント", icon: Award, href: "/customer-points" },
        { name: "ホステス台帳", icon: Users, href: "/hostess-ledger" },
        { name: "プロフィール設定", icon: Settings, href: "/hostess-management" },
        { name: "スタッフ台帳", icon: Users, href: "/staff-ledger" },
        { name: "週間ホステス出勤", icon: Calendar, href: "/weekly-hostess-attendance" },
        { name: "地域区分", icon: Map, href: "/area-division" },
        { name: "ホテル", icon: Hotel, href: "/hotel" },
        { name: "有料道路", icon: MapPin, href: "/toll-road" }
      ]
    },
    {
      title: "E",
      items: [
        { name: "燃料・エコ手当管理", icon: Settings, href: "/fuel-eco-management" },
        { name: "メディア管理", icon: Database, href: "/media-management" }
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
                  variant="gray"
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