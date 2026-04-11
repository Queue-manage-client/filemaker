// ホステス関連のサンプルデータ

import {
  HostessLedger,
  HostessRanking,
  HostessManager,
  HostessScheduleData,
  TimeBasedHostessAttendance,
  WeeklyHostessAttendance,
  HostessTransportInfo,
  StoreCategoryStats,
  ManagerHostessStats,
  RankUpCandidate,
  AbsenceGuidanceTarget,
  HostessAttendanceSettings
} from '@/types/hostess';

// ホステス台帳サンプルデータ
export const sampleHostessLedger: HostessLedger[] = [
  {
    id: "hostess001",
    hostessNumber: "H-001",
    name: "山田美咲",
    nameKana: "ヤマダミサキ",
    stageName: "美咲",
    birthDate: "1995-03-15",
    age: 29,
    phoneNumber: "090-1234-5678",
    emergencyContact: {
      name: "山田太郎",
      phoneNumber: "03-1234-5678",
      relationship: "父"
    },
    address: {
      zipCode: "150-0001",
      prefecture: "東京都",
      city: "渋谷区",
      street: "神宮前1-2-3",
      building: "渋谷マンション301"
    },
    registrationDate: "2024-01-15",
    lastWorkDate: "2025-01-26",
    status: "active",
    category: "VIP",
    totalWorkDays: 280,
    totalEarnings: 5600000,
    averageRating: 4.8,
    specialNotes: "指名客多数、英語対応可能",
    ngAreas: ["歌舞伎町周辺"],
    preferences: {
      workStartTime: "18:00",
      workEndTime: "02:00",
      preferredAreas: ["銀座", "六本木", "表参道"],
      availableDays: ["月", "火", "水", "木", "金", "土"]
    }
  },
  {
    id: "hostess002",
    hostessNumber: "H-002",
    name: "田中さくら",
    nameKana: "タナカサクラ",
    stageName: "さくら",
    birthDate: "1997-07-20",
    age: 27,
    phoneNumber: "090-2345-6789",
    emergencyContact: {
      name: "田中花子",
      phoneNumber: "03-2345-6789",
      relationship: "母"
    },
    address: {
      zipCode: "106-0032",
      prefecture: "東京都",
      city: "港区",
      street: "六本木3-4-5",
      building: "六本木アパートメント502"
    },
    registrationDate: "2024-03-20",
    lastWorkDate: "2025-01-25",
    status: "active",
    category: "Lady",
    totalWorkDays: 220,
    totalEarnings: 3300000,
    averageRating: 4.5,
    ngAreas: [],
    preferences: {
      workStartTime: "19:30",
      workEndTime: "03:00",
      preferredAreas: ["新宿", "渋谷", "池袋"],
      availableDays: ["水", "木", "金", "土", "日"]
    }
  }
];

// ホステスランキングサンプルデータ
export const sampleHostessRanking: HostessRanking[] = [
  {
    id: "rank001",
    rank: 1,
    hostessId: "hostess001",
    hostessName: "山田美咲",
    stageName: "美咲",
    category: "VIP",
    storeId: "store001",
    storeName: "銀座本店",
    monthlyEarnings: 450000,
    totalCustomers: 85,
    averageServiceTime: 180,
    customerSatisfactionScore: 4.8,
    workDaysInMonth: 24,
    earningsGrowthRate: 15.5,
    specialAchievements: ["月間売上No.1", "顧客満足度最高評価"],
    previousRank: 1,
    rankChange: "same",
    regularNominationCount: 42,
    panelNominationCount: 28,
    freeNominationCount: 15,
    honShimeiCount: 38,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 280000,
    totalServiceTime: 15300,
    averageCustomerSpending: 5294,
    repeatCustomerRate: 78.5,
    newCustomerCount: 18,
    extensionRate: 65.2
  },
  {
    id: "rank002",
    rank: 2,
    hostessId: "hostess002",
    hostessName: "田中さくら",
    stageName: "さくら",
    category: "Lady",
    storeId: "store001",
    storeName: "銀座本店",
    monthlyEarnings: 380000,
    totalCustomers: 72,
    averageServiceTime: 165,
    customerSatisfactionScore: 4.5,
    workDaysInMonth: 22,
    earningsGrowthRate: 8.2,
    specialAchievements: ["新規顧客獲得賞"],
    previousRank: 3,
    rankChange: "up",
    regularNominationCount: 35,
    panelNominationCount: 22,
    freeNominationCount: 15,
    honShimeiCount: 31,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 220000,
    totalServiceTime: 11880,
    averageCustomerSpending: 5278,
    repeatCustomerRate: 68.1,
    newCustomerCount: 23,
    extensionRate: 58.3
  },
  {
    id: "rank003",
    rank: 3,
    hostessId: "hostess003",
    hostessName: "佐藤まゆ",
    stageName: "まゆ",
    category: "Girls",
    storeId: "store001",
    storeName: "銀座本店",
    monthlyEarnings: 320000,
    totalCustomers: 68,
    averageServiceTime: 150,
    customerSatisfactionScore: 4.3,
    workDaysInMonth: 20,
    earningsGrowthRate: -2.1,
    specialAchievements: [],
    previousRank: 2,
    rankChange: "down",
    regularNominationCount: 28,
    panelNominationCount: 18,
    freeNominationCount: 22,
    honShimeiCount: 24,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 180000,
    totalServiceTime: 10200,
    averageCustomerSpending: 4706,
    repeatCustomerRate: 58.8,
    newCustomerCount: 28,
    extensionRate: 52.9
  },
  {
    id: "rank004",
    rank: 4,
    hostessId: "hostess004",
    hostessName: "高橋あゆみ",
    stageName: "あゆみ",
    category: "Lady",
    storeId: "store002",
    storeName: "新宿店",
    monthlyEarnings: 310000,
    totalCustomers: 65,
    averageServiceTime: 155,
    customerSatisfactionScore: 4.4,
    workDaysInMonth: 21,
    earningsGrowthRate: 12.3,
    specialAchievements: ["新人賞"],
    previousRank: 5,
    rankChange: "up",
    regularNominationCount: 30,
    panelNominationCount: 20,
    freeNominationCount: 15,
    honShimeiCount: 27,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 200000,
    totalServiceTime: 10075,
    averageCustomerSpending: 4769,
    repeatCustomerRate: 72.3,
    newCustomerCount: 18,
    extensionRate: 60.0
  },
  {
    id: "rank005",
    rank: 5,
    hostessId: "hostess005",
    hostessName: "鈴木ゆい",
    stageName: "ゆい",
    category: "Girls",
    storeId: "store002",
    storeName: "新宿店",
    monthlyEarnings: 290000,
    totalCustomers: 62,
    averageServiceTime: 145,
    customerSatisfactionScore: 4.2,
    workDaysInMonth: 20,
    earningsGrowthRate: 5.8,
    specialAchievements: [],
    previousRank: 4,
    rankChange: "down",
    regularNominationCount: 25,
    panelNominationCount: 17,
    freeNominationCount: 20,
    honShimeiCount: 21,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 170000,
    totalServiceTime: 8990,
    averageCustomerSpending: 4677,
    repeatCustomerRate: 61.3,
    newCustomerCount: 24,
    extensionRate: 54.8
  },
  {
    id: "rank006",
    rank: 6,
    hostessId: "hostess006",
    hostessName: "伊藤りな",
    stageName: "りな",
    category: "VIP",
    storeId: "store001",
    storeName: "銀座本店",
    monthlyEarnings: 420000,
    totalCustomers: 78,
    averageServiceTime: 175,
    customerSatisfactionScore: 4.7,
    workDaysInMonth: 23,
    earningsGrowthRate: 18.2,
    specialAchievements: ["指名率No.1"],
    previousRank: 7,
    rankChange: "up",
    regularNominationCount: 48,
    panelNominationCount: 22,
    freeNominationCount: 8,
    honShimeiCount: 45,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 310000,
    totalServiceTime: 13650,
    averageCustomerSpending: 5385,
    repeatCustomerRate: 89.7,
    newCustomerCount: 8,
    extensionRate: 70.5
  },
  {
    id: "rank007",
    rank: 7,
    hostessId: "hostess007",
    hostessName: "渡辺ひな",
    stageName: "ひな",
    category: "Lady",
    storeId: "store003",
    storeName: "渋谷店",
    monthlyEarnings: 340000,
    totalCustomers: 70,
    averageServiceTime: 160,
    customerSatisfactionScore: 4.5,
    workDaysInMonth: 22,
    earningsGrowthRate: 10.5,
    specialAchievements: ["延長率優秀賞"],
    previousRank: 6,
    rankChange: "down",
    regularNominationCount: 32,
    panelNominationCount: 23,
    freeNominationCount: 15,
    honShimeiCount: 29,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 210000,
    totalServiceTime: 11200,
    averageCustomerSpending: 4857,
    repeatCustomerRate: 75.7,
    newCustomerCount: 17,
    extensionRate: 68.6
  },
  {
    id: "rank008",
    rank: 8,
    hostessId: "hostess008",
    hostessName: "中村みき",
    stageName: "みき",
    category: "Girls",
    storeId: "store003",
    storeName: "渋谷店",
    monthlyEarnings: 280000,
    totalCustomers: 60,
    averageServiceTime: 142,
    customerSatisfactionScore: 4.1,
    workDaysInMonth: 19,
    earningsGrowthRate: 3.2,
    specialAchievements: [],
    previousRank: 8,
    rankChange: "same",
    regularNominationCount: 22,
    panelNominationCount: 15,
    freeNominationCount: 23,
    honShimeiCount: 19,
    dataYear: 2026,
    dataMonth: 3,
    nominationRevenue: 150000,
    totalServiceTime: 8520,
    averageCustomerSpending: 4667,
    repeatCustomerRate: 55.0,
    newCustomerCount: 27,
    extensionRate: 48.3
  },
  // 2月分データ（月範囲フィルター検証用）
  {
    id: "rank009",
    rank: 1,
    hostessId: "hostess001",
    hostessName: "山田美咲",
    stageName: "美咲",
    category: "VIP",
    storeId: "store001",
    storeName: "銀座本店",
    monthlyEarnings: 420000,
    totalCustomers: 80,
    averageServiceTime: 175,
    customerSatisfactionScore: 4.7,
    workDaysInMonth: 22,
    earningsGrowthRate: 12.0,
    specialAchievements: [],
    previousRank: 2,
    rankChange: "up",
    regularNominationCount: 38,
    panelNominationCount: 25,
    freeNominationCount: 17,
    honShimeiCount: 35,
    dataYear: 2026,
    dataMonth: 2,
    nominationRevenue: 260000,
    totalServiceTime: 14000,
    averageCustomerSpending: 5250,
    repeatCustomerRate: 76.0,
    newCustomerCount: 19,
    extensionRate: 62.0
  },
  {
    id: "rank010",
    rank: 2,
    hostessId: "hostess004",
    hostessName: "高橋あゆみ",
    stageName: "あゆみ",
    category: "Lady",
    storeId: "store002",
    storeName: "新宿店",
    monthlyEarnings: 350000,
    totalCustomers: 68,
    averageServiceTime: 160,
    customerSatisfactionScore: 4.6,
    workDaysInMonth: 21,
    earningsGrowthRate: 10.0,
    specialAchievements: [],
    previousRank: 3,
    rankChange: "up",
    regularNominationCount: 33,
    panelNominationCount: 21,
    freeNominationCount: 14,
    honShimeiCount: 30,
    dataYear: 2026,
    dataMonth: 2,
    nominationRevenue: 230000,
    totalServiceTime: 10880,
    averageCustomerSpending: 5147,
    repeatCustomerRate: 70.0,
    newCustomerCount: 20,
    extensionRate: 58.0
  }
];

// ホステスマネージャーサンプルデータ
export const sampleHostessManagers: HostessManager[] = [
  {
    id: "manager001",
    managerNumber: "M-001",
    name: "鈴木太郎",
    nameKana: "スズキタロウ",
    phoneNumber: "090-9876-5432",
    email: "suzuki.manager@company.com",
    hireDate: "2023-04-01",
    position: "manager",
    managedHostesses: ["hostess001", "hostess002", "hostess003", "hostess004", "hostess005"],
    totalManagedHostesses: 5,
    monthlyPerformance: {
      totalRevenue: 1850000,
      averageHostessEarnings: 370000,
      newRecruits: 2,
      retentionRate: 95.0
    },
    status: "active",
    notes: "経験豊富、ホステス育成に定評あり"
  },
  {
    id: "manager002",
    managerNumber: "M-002",
    name: "高橋花子",
    nameKana: "タカハシハナコ",
    phoneNumber: "090-5432-1098",
    email: "takahashi.manager@company.com",
    hireDate: "2023-08-15",
    position: "sub_manager",
    managedHostesses: ["hostess006", "hostess007", "hostess008"],
    totalManagedHostesses: 3,
    monthlyPerformance: {
      totalRevenue: 980000,
      averageHostessEarnings: 326666,
      newRecruits: 1,
      retentionRate: 88.5
    },
    status: "active",
    notes: "新人育成担当"
  }
];

// ホステススケジュールサンプルデータ（更新版）
export const sampleHostessScheduleData: HostessScheduleData[] = [
  {
    id: "sched001",
    hostessId: "hostess001",
    workType: "full_time",
    name: "美咲",
    assignedStaff: "鈴木太郎",
    hostessManager: "鈴木太郎",
    weeklySchedule: {
      monday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      tuesday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      wednesday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      thursday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      friday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      saturday: { isWorkDay: false },
      sunday: { isWorkDay: false }
    },
    weeklyStats: {
      totalWorkDays: 5,
      totalWorkHours: 35,
      averageDailyHours: 7,
      expectedEarnings: 180000
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T10:00:00Z",
    status: "confirmed"
  },
  {
    id: "sched002",
    hostessId: "hostess002",
    workType: "full_time",
    name: "さくら",
    assignedStaff: "高橋花子",
    hostessManager: "高橋花子",
    weeklySchedule: {
      monday: { isWorkDay: false },
      tuesday: { isWorkDay: false },
      wednesday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      thursday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      friday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      saturday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", workHours: 7 },
      sunday: { isWorkDay: false }
    },
    weeklyStats: {
      totalWorkDays: 4,
      totalWorkHours: 28,
      averageDailyHours: 7,
      expectedEarnings: 140000
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T10:00:00Z",
    status: "confirmed"
  }
];

// 時間別ホステス出勤サンプルデータ
export const sampleTimeBasedAttendance: TimeBasedHostessAttendance[] = [
  {
    id: "time001",
    date: "2025-01-27",
    timeSlot: "18:00-19:00",
    hostesses: [
      {
        hostessId: "hostess001",
        hostessName: "美咲",
        category: "VIP",
        status: "waiting",
        location: "待機室"
      }
    ],
    totalCount: 1,
    workingCount: 0,
    waitingCount: 1,
    breakCount: 0
  },
  {
    id: "time002",
    date: "2025-01-27",
    timeSlot: "19:00-20:00",
    hostesses: [
      {
        hostessId: "hostess001",
        hostessName: "美咲",
        category: "VIP",
        status: "working",
        location: "銀座",
        customerId: "cust001",
        customerName: "田中様",
        serviceStartTime: "19:15",
        estimatedEndTime: "21:15"
      },
      {
        hostessId: "hostess002",
        hostessName: "さくら",
        category: "Lady",
        status: "waiting",
        location: "待機室"
      }
    ],
    totalCount: 2,
    workingCount: 1,
    waitingCount: 1,
    breakCount: 0
  }
];

// 週間ホステス出勤サンプルデータ
export const sampleWeeklyAttendance: WeeklyHostessAttendance[] = [
  {
    id: "weekly001",
    weekStartDate: "2025-01-20",
    weekEndDate: "2025-01-26",
    hostessId: "hostess001",
    hostessName: "美咲",
    category: "VIP",
    storeId: "store001",
    storeName: "銀座本店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    dailyAttendance: {
      "2025-01-20": {
        startTime: "19:00",
        endTime: "02:00",
        workHours: 7,
        status: "present",
        earnings: 35000,
        customerCount: 3
      },
      "2025-01-21": {
        startTime: "19:00",
        endTime: "02:30",
        workHours: 7.5,
        status: "present",
        earnings: 42000,
        customerCount: 4
      },
      "2025-01-22": {
        workHours: 0,
        status: "absent",
        earnings: 0,
        customerCount: 0,
        notes: "体調不良のため欠勤"
      },
      "2025-01-23": {
        startTime: "19:30",
        endTime: "02:00",
        workHours: 6.5,
        status: "late",
        earnings: 28000,
        customerCount: 2,
        notes: "30分遅刻"
      },
      "2025-01-24": {
        startTime: "19:00",
        endTime: "01:30",
        workHours: 6.5,
        status: "early_leave",
        earnings: 25000,
        customerCount: 2,
        notes: "体調不良のため早退"
      },
      "2025-01-25": {
        startTime: "19:00",
        endTime: "02:00",
        workHours: 7,
        status: "present",
        earnings: 38000,
        customerCount: 3
      },
      "2025-01-26": {
        startTime: "19:00",
        endTime: "02:00",
        workHours: 7,
        status: "present",
        earnings: 40000,
        customerCount: 4
      }
    },
    weeklyTotals: {
      totalHours: 41.5,
      totalDays: 6,
      totalEarnings: 208000,
      totalCustomers: 18,
      averageHoursPerDay: 6.9
    },
    attendanceRate: 85.7,
    registrationDate: "2024-01-15",
    isNewbie: false
  },
  {
    id: "weekly002",
    weekStartDate: "2025-01-20",
    weekEndDate: "2025-01-26",
    hostessId: "hostess002",
    hostessName: "さくら",
    category: "Lady",
    storeId: "store001",
    storeName: "銀座本店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    dailyAttendance: {
      "2025-01-20": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 },
      "2025-01-21": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 },
      "2025-01-22": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 32000, customerCount: 3 },
      "2025-01-23": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 35000, customerCount: 3 },
      "2025-01-24": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 28000, customerCount: 2 },
      "2025-01-25": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 40000, customerCount: 4 },
      "2025-01-26": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 }
    },
    weeklyTotals: { totalHours: 28, totalDays: 4, totalEarnings: 135000, totalCustomers: 12, averageHoursPerDay: 7 },
    attendanceRate: 100,
    registrationDate: "2024-03-20",
    isNewbie: false
  },
  {
    id: "weekly003",
    weekStartDate: "2025-01-20",
    weekEndDate: "2025-01-26",
    hostessId: "hostess003",
    hostessName: "まゆ",
    category: "Girls",
    storeId: "store002",
    storeName: "新宿店",
    managerId: "manager002",
    managerName: "高橋花子",
    dailyAttendance: {
      "2025-01-20": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 25000, customerCount: 2 },
      "2025-01-21": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 28000, customerCount: 3 },
      "2025-01-22": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 30000, customerCount: 3 },
      "2025-01-23": { workHours: 0, status: "absent", earnings: 0, customerCount: 0, notes: "当日欠勤" },
      "2025-01-24": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 22000, customerCount: 2 },
      "2025-01-25": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 35000, customerCount: 4 },
      "2025-01-26": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 }
    },
    weeklyTotals: { totalHours: 35, totalDays: 5, totalEarnings: 140000, totalCustomers: 14, averageHoursPerDay: 7 },
    attendanceRate: 83.3,
    registrationDate: "2025-01-10",
    isNewbie: true,
    newbieDaysRemaining: 75
  },
  {
    id: "weekly004",
    weekStartDate: "2025-01-20",
    weekEndDate: "2025-01-26",
    hostessId: "hostess004",
    hostessName: "あゆみ",
    category: "Lady",
    storeId: "store002",
    storeName: "新宿店",
    managerId: "manager002",
    managerName: "高橋花子",
    dailyAttendance: {
      "2025-01-20": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 30000, customerCount: 3 },
      "2025-01-21": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 32000, customerCount: 3 },
      "2025-01-22": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 },
      "2025-01-23": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 35000, customerCount: 4 },
      "2025-01-24": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 28000, customerCount: 3 },
      "2025-01-25": { startTime: "19:00", endTime: "02:00", workHours: 7, status: "present", earnings: 40000, customerCount: 4 },
      "2025-01-26": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 }
    },
    weeklyTotals: { totalHours: 35, totalDays: 5, totalEarnings: 165000, totalCustomers: 17, averageHoursPerDay: 7 },
    attendanceRate: 100,
    registrationDate: "2024-06-15",
    isNewbie: false
  },
  {
    id: "weekly005",
    weekStartDate: "2025-01-20",
    weekEndDate: "2025-01-26",
    hostessId: "hostess005",
    hostessName: "ゆい",
    category: "Girls",
    storeId: "store003",
    storeName: "渋谷店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    dailyAttendance: {
      "2025-01-20": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 22000, customerCount: 2 },
      "2025-01-21": { workHours: 0, status: "absent", earnings: 0, customerCount: 0, notes: "当日欠勤（連絡なし）" },
      "2025-01-22": { workHours: 0, status: "absent", earnings: 0, customerCount: 0, notes: "当日欠勤" },
      "2025-01-23": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 25000, customerCount: 2 },
      "2025-01-24": { startTime: "18:00", endTime: "01:00", workHours: 7, status: "present", earnings: 28000, customerCount: 3 },
      "2025-01-25": { workHours: 0, status: "absent", earnings: 0, customerCount: 0, notes: "当日欠勤" },
      "2025-01-26": { workHours: 0, status: "day_off", earnings: 0, customerCount: 0 }
    },
    weeklyTotals: { totalHours: 21, totalDays: 3, totalEarnings: 75000, totalCustomers: 7, averageHoursPerDay: 7 },
    attendanceRate: 50,
    registrationDate: "2024-11-01",
    isNewbie: false
  }
];

// ホステス送迎情報サンプルデータ
export const sampleHostessTransportInfo: HostessTransportInfo[] = [
  {
    id: "transport001",
    hostessId: "hostess001",
    primaryStoreId: "store001",
    primaryStoreName: "銀座本店",
    pickupLocation: "渋谷駅ハチ公口",
    dropoffLocation: "渋谷駅ハチ公口",
    pickupNotes: "ハチ公像前で待機",
    dropoffNotes: ""
  },
  {
    id: "transport002",
    hostessId: "hostess002",
    primaryStoreId: "store001",
    primaryStoreName: "銀座本店",
    pickupLocation: "六本木駅3番出口",
    dropoffLocation: "六本木駅3番出口",
    pickupNotes: "",
    dropoffNotes: "深夜はタクシー使用可"
  },
  {
    id: "transport003",
    hostessId: "hostess003",
    primaryStoreId: "store002",
    primaryStoreName: "新宿店",
    pickupLocation: "新宿駅南口",
    dropoffLocation: "新宿駅南口",
    pickupNotes: "バスタ新宿前",
    dropoffNotes: ""
  }
];

// 店舗別カテゴリー統計サンプルデータ
export const sampleStoreCategoryStats: StoreCategoryStats[] = [
  {
    storeId: "store001",
    storeName: "銀座本店",
    categories: [
      { categoryName: "VIP", totalCount: 5, activeCount: 4, attendanceRate: 92.5, avgEarnings: 420000 },
      { categoryName: "Lady", totalCount: 8, activeCount: 7, attendanceRate: 88.0, avgEarnings: 350000 },
      { categoryName: "Girls", totalCount: 12, activeCount: 10, attendanceRate: 78.5, avgEarnings: 280000 }
    ],
    totalHostesses: 25,
    overallAttendanceRate: 85.3
  },
  {
    storeId: "store002",
    storeName: "新宿店",
    categories: [
      { categoryName: "VIP", totalCount: 3, activeCount: 3, attendanceRate: 95.0, avgEarnings: 400000 },
      { categoryName: "Lady", totalCount: 10, activeCount: 8, attendanceRate: 82.5, avgEarnings: 320000 },
      { categoryName: "Girls", totalCount: 15, activeCount: 12, attendanceRate: 72.0, avgEarnings: 250000 }
    ],
    totalHostesses: 28,
    overallAttendanceRate: 79.2
  },
  {
    storeId: "store003",
    storeName: "渋谷店",
    categories: [
      { categoryName: "VIP", totalCount: 2, activeCount: 2, attendanceRate: 90.0, avgEarnings: 380000 },
      { categoryName: "Lady", totalCount: 6, activeCount: 5, attendanceRate: 85.0, avgEarnings: 310000 },
      { categoryName: "Girls", totalCount: 10, activeCount: 7, attendanceRate: 68.5, avgEarnings: 240000 }
    ],
    totalHostesses: 18,
    overallAttendanceRate: 77.8
  }
];

// 担当者別在籍統計サンプルデータ
export const sampleManagerHostessStats: ManagerHostessStats[] = [
  {
    managerId: "manager001",
    managerName: "鈴木太郎",
    totalHostesses: 15,
    hostessesOver2Months: 12,
    hostessesUnder2Months: 3,
    newbies: 2,
    retentionRate: 92.5,
    avgAttendanceRate: 88.0
  },
  {
    managerId: "manager002",
    managerName: "高橋花子",
    totalHostesses: 10,
    hostessesOver2Months: 7,
    hostessesUnder2Months: 3,
    newbies: 3,
    retentionRate: 85.0,
    avgAttendanceRate: 82.5
  },
  {
    managerId: "manager003",
    managerName: "佐藤次郎",
    totalHostesses: 8,
    hostessesOver2Months: 6,
    hostessesUnder2Months: 2,
    newbies: 1,
    retentionRate: 88.0,
    avgAttendanceRate: 85.0
  }
];

// ランクアップ候補サンプルデータ
export const sampleRankUpCandidates: RankUpCandidate[] = [
  {
    hostessId: "hostess002",
    hostessName: "田中さくら",
    stageName: "さくら",
    currentRank: 5,
    currentCategory: "Lady",
    storeId: "store001",
    storeName: "銀座本店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    consecutiveMonths: 3,
    avgMonthlyEarnings: 380000,
    avgCustomerSatisfaction: 4.5,
    honShimeiCount: 31,
    attendanceRate: 95.0,
    reason: "3ヶ月連続目標達成、本指名数増加傾向"
  },
  {
    hostessId: "hostess004",
    hostessName: "高橋あゆみ",
    stageName: "あゆみ",
    currentRank: 8,
    currentCategory: "Lady",
    storeId: "store002",
    storeName: "新宿店",
    managerId: "manager002",
    managerName: "高橋花子",
    consecutiveMonths: 2,
    avgMonthlyEarnings: 330000,
    avgCustomerSatisfaction: 4.6,
    honShimeiCount: 28,
    attendanceRate: 100,
    reason: "出勤率100%、顧客満足度高い"
  },
  {
    hostessId: "hostess007",
    hostessName: "渡辺ひな",
    stageName: "ひな",
    currentRank: 7,
    currentCategory: "Lady",
    storeId: "store003",
    storeName: "渋谷店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    consecutiveMonths: 4,
    avgMonthlyEarnings: 345000,
    avgCustomerSatisfaction: 4.5,
    honShimeiCount: 30,
    attendanceRate: 92.0,
    reason: "4ヶ月連続目標達成、延長率が高い"
  }
];

// 当欠指導対象サンプルデータ
export const sampleAbsenceGuidanceTargets: AbsenceGuidanceTarget[] = [
  {
    hostessId: "hostess005",
    hostessName: "鈴木ゆい",
    stageName: "ゆい",
    storeId: "store003",
    storeName: "渋谷店",
    managerId: "manager001",
    managerName: "鈴木太郎",
    absenceCount: 5,
    lastAbsenceDate: "2025-01-25",
    totalScheduledDays: 20,
    attendanceRate: 50.0,
    consecutiveAbsences: 2,
    warningLevel: "critical",
    notes: "連絡なし欠勤が続いている。面談要"
  },
  {
    hostessId: "hostess003",
    hostessName: "佐藤まゆ",
    stageName: "まゆ",
    storeId: "store002",
    storeName: "新宿店",
    managerId: "manager002",
    managerName: "高橋花子",
    absenceCount: 3,
    lastAbsenceDate: "2025-01-23",
    totalScheduledDays: 22,
    attendanceRate: 83.3,
    consecutiveAbsences: 1,
    warningLevel: "medium",
    notes: "新人期間中。フォローが必要"
  },
  {
    hostessId: "hostess008",
    hostessName: "中村みき",
    stageName: "みき",
    storeId: "store003",
    storeName: "渋谷店",
    managerId: "manager002",
    managerName: "高橋花子",
    absenceCount: 4,
    lastAbsenceDate: "2025-01-20",
    totalScheduledDays: 19,
    attendanceRate: 68.4,
    consecutiveAbsences: 1,
    warningLevel: "high",
    notes: "体調不良が続いている様子"
  }
];

// 出勤設定サンプルデータ
export const sampleAttendanceSettings: HostessAttendanceSettings = {
  businessStartTime: "09:00",
  businessEndTime: "04:00",
  minStartTime: "10:00",
  maxEndTime: "02:00",
  defaultPickupLocation: "店舗前",
  defaultDropoffLocation: "店舗前"
};

