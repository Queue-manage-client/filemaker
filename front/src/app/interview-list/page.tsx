'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Plus, Download } from "lucide-react";
import type { InterviewRecord, InterviewProgress } from '@/types';
import { INTERVIEW_TYPE_LABELS, INTERVIEW_RESULT_LABELS, EMPLOYMENT_STATUS_LABELS, INTERVIEW_PROGRESS_LABELS } from '@/types';
import { interviewSampleData } from '@/data/interviewSampleData';

export default function InterviewList() {
  const router = useRouter();
  const [interviews] = useState<InterviewRecord[]>(interviewSampleData);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = '面接リスト - Dispatch Harmony Hub';
  }, []);

  const filteredInterviews = interviews.filter(interview =>
    interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.interviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.media.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };


  const exportToCSV = () => {
    // CSVエクスポート機能（実装例）
    const headers = [
      'No', '日付', '開始時刻', '面接種類', '出稼ぎ', '氏名', '年齢', '媒体',
      '面接者', '結果', '所属店舗', '店内名', '在職', '担当者', '電話番号', 'メールアドレス', '場所', '備考'
    ];

    const csvData = filteredInterviews.map((interview, index) => [
      index + 1,
      formatDate(interview.date),
      interview.startTime,
      INTERVIEW_TYPE_LABELS[interview.interviewType],
      interview.isRemoteWork ? '○' : '',
      interview.name,
      interview.age,
      interview.media,
      interview.interviewer,
      INTERVIEW_RESULT_LABELS[interview.result],
      interview.assignedStore,
      interview.storeName,
      EMPLOYMENT_STATUS_LABELS[interview.employmentStatus],
      interview.assignedStaff,
      interview.phoneNumber || '',
      interview.email || '',
      interview.location || '',
      interview.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `interview_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
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
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">面接リスト</h1>

              <div className="flex items-center gap-4">
                {/* 新規追加ボタン */}
                <Button variant="outline" size="sm" className="bg-green-100">
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>

                {/* CSVエクスポート */}
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV出力
                </Button>

                {/* 検索 */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="氏名・面接者・担当者・媒体で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-2 w-10">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">日付</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">開始時刻</th>
                    <th className="border border-gray-300 px-2 py-2 w-16 whitespace-nowrap">面接種類</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">出稼ぎ</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">年齢</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">媒体</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">面接者</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">結果</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">進捗</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">所属店舗</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">店内名</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">在職</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">担当者</th>
                    <th className="border border-gray-300 px-2 py-2 w-28">電話番号</th>
                    <th className="border border-gray-300 px-2 py-2 w-40">メールアドレス</th>
                    <th className="border border-gray-300 px-2 py-2 w-28">場所</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((interview, index) => (
                    <tr key={interview.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {formatDate(interview.date)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {interview.startTime}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${
                          interview.interviewType === 'driver' ? 'bg-blue-100 text-blue-800' :
                          interview.interviewType === 'staff' ? 'bg-green-100 text-green-800' :
                          'bg-pink-100 text-pink-800'
                        }`}>
                          {INTERVIEW_TYPE_LABELS[interview.interviewType]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Checkbox
                          checked={interview.isRemoteWork}
                          className="w-4 h-4"
                          disabled
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold">
                        {interview.name}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {interview.age}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.media}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.interviewer}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          interview.result === 'hired' ? 'bg-green-100 text-green-800' :
                          interview.result === 'cancelled' ? 'bg-red-100 text-red-800' :
                          interview.result === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {INTERVIEW_RESULT_LABELS[interview.result]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {interview.progress && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            interview.progress === 'application' ? 'bg-blue-100 text-blue-800' :
                            interview.progress === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                            interview.progress === 'completed' ? 'bg-green-100 text-green-800' :
                            interview.progress === 'followup' ? 'bg-orange-100 text-orange-800' :
                            'bg-cyan-100 text-cyan-800'
                          }`}>
                            {INTERVIEW_PROGRESS_LABELS[interview.progress]}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.assignedStore}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.storeName}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {interview.employmentStatus === 'retired' && (
                          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                            退職
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.assignedStaff}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.phoneNumber || ''}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.email || ''}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {interview.location || ''}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 max-w-32 truncate" title={interview.notes}>
                        {interview.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 統計情報 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredInterviews.length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">入店:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredInterviews.filter(i => i.result === 'hired').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">保留:</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {filteredInterviews.filter(i => i.result === 'pending').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">不採用:</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {filteredInterviews.filter(i => i.result === 'rejected').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">取消:</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              {filteredInterviews.filter(i => i.result === 'cancelled').length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}