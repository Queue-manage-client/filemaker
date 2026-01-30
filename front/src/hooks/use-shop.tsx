'use client';

// ダミーフック（API不要）
export function useShopList() {
  return {
    data: [],
    isLoading: false,
    error: null,
  };
}

export function useShopById(id: string) {
  return {
    data: null,
    isLoading: false,
    error: null,
  };
}
