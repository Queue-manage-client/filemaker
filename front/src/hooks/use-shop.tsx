'use client';

// 店舗（shop）データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery } from '@tanstack/react-query';
import { shopService } from '@/services/shop-service';

// クエリキー定数
const QUERY_KEYS = {
  SHOP_LIST: 'shop-list',
  SHOP_DETAIL: 'shop-detail',
} as const;

// 店舗一覧取得フック
export function useShopList() {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOP_LIST],
    queryFn: () => shopService.getShopList(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 店舗詳細取得フック
export function useShopById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOP_DETAIL, id],
    queryFn: () => shopService.getShopById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

