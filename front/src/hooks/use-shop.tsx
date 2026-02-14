'use client';

import type { Shop } from '@/types/shop';

// ダミーフック（API不要）
export function useShopList() {
  return {
    data: [] as Shop[],
    isLoading: false,
    error: null,
  };
}

export function useShopById(_id: string) {
  return {
    data: null as Shop | null,
    isLoading: false,
    error: null,
  };
}
