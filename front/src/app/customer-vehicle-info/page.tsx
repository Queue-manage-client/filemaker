'use client';

import React, { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CustomerVehicle } from "@/types/customer-vehicle";
import CustomerVehicleEditModal from "@/components/modals/CustomerVehicleEditModal";
import { useCustomerVehicles, useUpdateCustomerVehicle } from '@/hooks/use-customer-vehicle';

export default function CustomerVehicleInfo() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<CustomerVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    document.title = '顧客車情報 - Dispatch Harmony Hub';
  }, []);

  // React Queryを使用してデータ取得
  const { data: vehicleData = [], isLoading, error } = useCustomerVehicles();
  const updateVehicle = useUpdateCustomerVehicle();

  // 検索フィルター
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicleData;
    const q = searchTerm.toLowerCase();
    return vehicleData.filter(vehicle =>
      vehicle.ctNo.toLowerCase().includes(q) ||
      vehicle.customerName.toLowerCase().includes(q) ||
      vehicle.vehicleType.toLowerCase().includes(q) ||
      vehicle.plateNumber.toLowerCase().includes(q)
    );
  }, [vehicleData, searchTerm]);

  // 編集ボタンクリック
  const handleEditClick = (vehicle: CustomerVehicle) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  // 編集保存
  const handleSaveEdit = async (updatedVehicle: CustomerVehicle) => {
    try {
      await updateVehicle.mutateAsync({
        id: updatedVehicle.id,
        updates: updatedVehicle,
      });
      setIsEditModalOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      // エラーハンドリング
      console.error('Failed to update vehicle:', error);
    }
  };

  // ステータスバッジの色取得
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '有効';
      case 'inactive':
        return '無効';
      case 'suspended':
        return '停止中';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6" />
              <h1 className="text-2xl font-bold">顧客車情報</h1>
            </div>
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-red-600 text-sm">データ取得に失敗しました</span>
              )}
              {isLoading && (
                <span className="text-gray-600 text-sm">読み込み中...</span>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="顧客番号、顧客名、車種、ナンバーで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredVehicles.length}件の顧客車情報
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              読み込み中...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              データの取得に失敗しました
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>CTNo</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>車種</TableHead>
                  <TableHead>車色</TableHead>
                  <TableHead>地域</TableHead>
                  <TableHead>車種番号</TableHead>
                  <TableHead>記号</TableHead>
                  <TableHead>車番号</TableHead>
                  <TableHead>ナンバープレート</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      データが見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.serialNumber}</TableCell>
                  <TableCell className="font-mono">{vehicle.ctNo}</TableCell>
                  <TableCell className="font-medium">{vehicle.customerName}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>{vehicle.vehicleColor}</TableCell>
                  <TableCell>{vehicle.region}</TableCell>
                  <TableCell className="font-mono">{vehicle.classificationNumber}</TableCell>
                  <TableCell className="font-mono text-lg">{vehicle.hiraganaSymbol}</TableCell>
                  <TableCell className="font-mono">{vehicle.vehicleNumber}</TableCell>
                  <TableCell className="font-mono bg-gray-50 font-medium">
                    {vehicle.plateNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                      {getStatusLabel(vehicle.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(vehicle)}
                      className="flex items-center gap-1"
                    >
                      <Settings className="w-4 h-4" />
                      設定
                    </Button>
                  </TableCell>
                </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 編集モーダル */}
      <CustomerVehicleEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingVehicle(null);
        }}
        vehicle={editingVehicle}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
