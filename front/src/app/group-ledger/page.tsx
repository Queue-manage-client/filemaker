'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Building, Users, Edit, Save, Plus, Trash2 } from "lucide-react";

import { GroupMaster } from '@/types/group-ledger';
import { groupMasterSampleData } from '@/data/groupLedgerSampleData';

export default function GroupLedgerPage() {
  const [selectedGroup, setSelectedGroup] = useState<GroupMaster | null>(groupMasterSampleData[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<GroupMaster>>({});


  React.useEffect(() => {
    document.title = 'グループ台帳 - Dispatch Harmony Hub';
  }, []);

  const handleEdit = () => {
    if (selectedGroup) {
      setEditForm({ ...selectedGroup });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    // 保存処理（将来実装）
    // TODO: API呼び出しでデータ保存を実装
    setIsEditing(false);
    setEditForm({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const updateEditForm = (field: keyof GroupMaster, value: unknown) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const currentData = isEditing ? editForm : selectedGroup;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* 左側：グループ一覧 */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <h1 className="text-xl font-bold">グループ台帳</h1>
            </div>
          </div>

          {/* グループ一覧 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-700">グループ一覧</h2>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="w-3 h-3" />
                追加
              </Button>
            </div>
            <div className="flex-1 px-4 pb-4 overflow-y-auto">
              <div className="space-y-2">
                {groupMasterSampleData.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {group.no}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{group.groupName}</div>
                        <div className="text-xs text-gray-500">
                          {group.initialLetter} | {group.affiliatedStores.length}店舗
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右側：グループ詳細 */}
        <div className="flex-1 flex flex-col">
          {/* グループ情報ヘッダー */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">
                  {currentData?.groupName || 'グループを選択してください'}
                </h2>
                {currentData?.no && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    No.{currentData.no}
                  </span>
                )}
              </div>
              {selectedGroup && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        キャンセル
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedGroup ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左側：グループ情報 */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">基本情報</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">No</label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={currentData?.no || ''}
                              onChange={(e) => updateEditForm('no', parseInt(e.target.value) || 0)}
                            />
                          ) : (
                            <div className="p-2 bg-gray-50 rounded border">{currentData?.no}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">頭文字</label>
                          {isEditing ? (
                            <Input
                              value={currentData?.initialLetter || ''}
                              onChange={(e) => updateEditForm('initialLetter', e.target.value)}
                            />
                          ) : (
                            <div className="p-2 bg-gray-50 rounded border">{currentData?.initialLetter}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">グループ名</label>
                        {isEditing ? (
                          <Input
                            value={currentData?.groupName || ''}
                            onChange={(e) => updateEditForm('groupName', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 rounded border">{currentData?.groupName}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">会員番号発番</label>
                        {isEditing ? (
                          <Input
                            value={currentData?.memberNumberIssuance || ''}
                            onChange={(e) => updateEditForm('memberNumberIssuance', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 rounded border font-mono">{currentData?.memberNumberIssuance}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">雑費割合</label>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={currentData?.miscellaneousExpenseRatio || ''}
                              onChange={(e) => updateEditForm('miscellaneousExpenseRatio', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          ) : (
                            <div className="p-2 bg-gray-50 rounded border w-20">{currentData?.miscellaneousExpenseRatio}</div>
                          )}
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">回数割引設定</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <Checkbox
                            checked={currentData?.useCountDiscount || false}
                            onCheckedChange={(checked) => updateEditForm('useCountDiscount', checked)}
                          />
                        ) : (
                          <Checkbox
                            checked={currentData?.useCountDiscount || false}
                            disabled
                          />
                        )}
                        <label className="text-sm font-medium">回数割引使用</label>
                      </div>

                      {currentData?.useCountDiscount && (
                        <div className="space-y-4 pl-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">割引回数</label>
                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={currentData?.discountCount || ''}
                                  onChange={(e) => updateEditForm('discountCount', parseInt(e.target.value) || undefined)}
                                  className="w-20"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded border w-20">{currentData?.discountCount}</div>
                              )}
                              <span className="text-sm text-gray-600">回毎に</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">割引金額</label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">¥</span>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={currentData?.discountAmount || ''}
                                  onChange={(e) => updateEditForm('discountAmount', parseInt(e.target.value) || undefined)}
                                  className="w-32"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded border w-32">
                                  {currentData?.discountAmount?.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* 右側：所属店舗リスト */}
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">所属店舗</CardTitle>
                        <span className="text-sm text-gray-500">
                          {currentData?.affiliatedStores?.length || 0}店舗
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentData?.affiliatedStores?.map((store, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <Building className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{store.storeName}</div>
                                <div className="text-xs text-gray-500 font-mono">SPID: {store.spid}</div>
                              </div>
                            </div>
                            {isEditing && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        {isEditing && (
                          <Button
                            variant="outline"
                            className="w-full mt-4 border-dashed"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            店舗を追加
                          </Button>
                        )}

                        {(!currentData?.affiliatedStores || currentData.affiliatedStores.length === 0) && (
                          <div className="text-center text-gray-500 py-8">
                            <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <div className="text-sm">所属店舗がありません</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">グループを選択してください</h3>
                <p>左側のリストからグループを選択して詳細を表示します</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}