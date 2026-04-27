'use client';

import Link from "next/link";
import { BusinessCard } from "@/components/ui/business-card";
import {
  Building,
  Users,
  Hotel,
  Map,
  MapPin,
  UserCircle,
  Database,
  LogOut,
  Edit3,
  Calendar,
  Unlock,
  FileText,
  BarChart3,
} from "lucide-react";

export const CenterPanel = () => {
  const sections = [
    {
      title: "管理",
      items: [
        { name: "グループ台帳", icon: Building, href: "/group-ledger" },
        { name: "店舗台帳", icon: Building, href: "/store-ledger" },
        { name: "ホステス台帳", icon: Users, href: "/hostess-ledger" },
        { name: "スタッフ台帳", icon: Users, href: "/staff-ledger" },
        { name: "ホステス管理", icon: UserCircle, href: "/hostess-admin" },
        { name: "ホステスマネージャリスト", icon: Calendar, href: "/hostess-manager-list" },
        { name: "各店リスト", icon: Edit3, href: "/store-list" },
        { name: "地域区分・交通費", icon: Map, href: "/area-division" },
        { name: "ホテル", icon: Hotel, href: "/hotel" },
        { name: "有料道路", icon: MapPin, href: "/toll-road" },
        { name: "店舗別実績ノルマ集計", icon: BarChart3, href: "/store-customer-route-summary" },
        { name: "管理用リスト", icon: FileText, href: "/management-list" },
        { name: "面接リスト・集計", icon: Users, href: "/interview-list" },
        { name: "ロック解除承認リスト", icon: Unlock, href: "/unlock-approval-list" },
        { name: "在籍・担当データ管理", icon: Database, href: "#" },
        { name: "退店管理", icon: LogOut, href: "#" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-bold mb-3 text-zinc-700">{section.title}</h2>
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
