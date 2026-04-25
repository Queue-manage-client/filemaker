# Verification Report

## Task: TODO Items — 配車パネル #2-4, RTパネル #5, RTⅡ #6-7, 清算メール #8, 新規顧客 #9, キャスト待機 #10, 待機ドライバー #11-12
## Date: 2026-03-27
## Status: PARTIAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Requirements Checklist

| # | Item | Requirement | Status | Notes |
|---|------|-------------|--------|-------|
| 2 | 出勤確認表示 | ScheduledHostess rows show attendance confirmation status | PASS | Lines 378-382 in dispatch-panel-2d/page.tsx |
| 3 | 確認電話完了有無 | Confirmation call with checkmarks and color change | PASS | Lines 383-403 in dispatch-panel-2d/page.tsx |
| 4 | スマホ対応 | Mobile view with scale/zoom | PASS | Lines 50-99 in dispatch-panel-2d/page.tsx |
| 5 | RTパネル ソート | Sort options (終了時間, カテゴリー, 順位 etc.) | PASS | Lines 484-506 in rt2-panel/page.tsx |
| 6 | キャスト出勤予定票 | New page at cast-attendance-schedule | PASS | Full 441-line page confirmed |
| 7 | 自動ダイヤル | Auto-dial panel with tel: links | PASS | Lines 385-438 in cast-attendance-schedule/page.tsx |
| 8 | 清算メール 預り荷物 | 預り荷物 field in settlement context | PARTIAL | Field in AttendanceTab.tsx; no standalone 清算メール page |
| 9 | 新規顧客ボタン | 新規顧客 button with auto phone number | PASS | Lines 348-354 (button) + 53-60 (handler) in customer-ledger/page.tsx |
| 10 | 待機2時間超ポップアップ | Popup for 2hr+ waiting hostesses | PASS | Lines 38-130 in dispatch-panel-2d/page.tsx |
| 11 | 待機開始時間 | Waiting start times for drivers | PASS | Lines 536-556 in dispatch-panel-2d/page.tsx |
| 12 | 送り5分超過ポップアップ | Overdue transport popup | PASS | Lines 43-165 in dispatch-panel-2d/page.tsx |

