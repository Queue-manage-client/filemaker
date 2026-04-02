// 従業員関連のサンプルデータ

import { EmployeeSalary, PartTimeSalary, EmployeeSchedule, StaffLedger, EmployeeWeeklyShift, DailyShift, EmployeeCategory } from '@/types/employee';

// 従業員給与サンプルデータ
export const sampleEmployeeSalaries: EmployeeSalary[] = [
  {
    id: "emp_sal001",
    employeeId: "emp001",
    employeeNumber: "E-001",
    name: "田中一郎",
    nameKana: "タナカイチロウ",
    position: "manager",
    department: "運行管理部",
    salaryPeriod: {
      year: 2025,
      month: 1
    },
    baseSalary: 350000,
    overtime: {
      hours: 20,
      amount: 55000
    },
    allowances: {
      transportation: 15000,
      meal: 8000,
      night: 12000,
      holiday: 6000,
      other: 3000
    },
    bonuses: 0,
    grossSalary: 449000,
    deductions: {
      healthInsurance: 22450,
      pensionInsurance: 40410,
      employmentInsurance: 1347,
      incomeTax: 15680,
      residentTax: 28500,
      other: 2000
    },
    netSalary: 338613,
    workDays: 22,
    workHours: 196,
    notes: "管理職手当含む"
  },
  {
    id: "emp_sal002",
    employeeId: "emp002",
    employeeNumber: "E-002",
    name: "佐藤花子",
    nameKana: "サトウハナコ",
    position: "driver",
    department: "配車部",
    salaryPeriod: {
      year: 2025,
      month: 1
    },
    baseSalary: 280000,
    overtime: {
      hours: 35,
      amount: 68250
    },
    allowances: {
      transportation: 12000,
      meal: 6000,
      night: 25000,
      holiday: 15000,
      other: 0
    },
    bonuses: 0,
    grossSalary: 406250,
    deductions: {
      healthInsurance: 20312,
      pensionInsurance: 36562,
      employmentInsurance: 1218,
      incomeTax: 12500,
      residentTax: 22000,
      other: 1500
    },
    netSalary: 312157,
    workDays: 24,
    workHours: 227,
    notes: "深夜勤務手当含む"
  }
];

// パートタイム給与サンプルデータ
export const samplePartTimeSalaries: PartTimeSalary[] = [
  {
    id: "part_sal001",
    employeeId: "emp003",
    employeeNumber: "P-001",
    name: "山田次郎",
    nameKana: "ヤマダジロウ",
    position: "オペレーター",
    salaryPeriod: {
      year: 2025,
      month: 1
    },
    hourlyRate: 1200,
    regularHours: 120,
    overtimeHours: 8,
    nightHours: 20,
    holidayHours: 12,
    regularPay: 144000,
    overtimePay: 12000,
    nightPay: 6000,
    holidayPay: 18000,
    transportationAllowance: 8000,
    grossSalary: 188000,
    deductions: {
      incomeTax: 5640,
      other: 1000
    },
    netSalary: 181360,
    workDays: 15,
    totalHours: 160
  },
  {
    id: "part_sal002",
    employeeId: "emp004",
    employeeNumber: "P-002",
    name: "高橋美咲",
    nameKana: "タカハシミサキ",
    position: "事務",
    salaryPeriod: {
      year: 2025,
      month: 1
    },
    hourlyRate: 1100,
    regularHours: 100,
    overtimeHours: 5,
    nightHours: 0,
    holidayHours: 8,
    regularPay: 110000,
    overtimePay: 6875,
    nightPay: 0,
    holidayPay: 11000,
    transportationAllowance: 6000,
    grossSalary: 133875,
    deductions: {
      incomeTax: 4016,
      other: 500
    },
    netSalary: 129359,
    workDays: 13,
    totalHours: 113
  }
];

// 従業員スケジュールサンプルデータ
export const sampleEmployeeSchedules: EmployeeSchedule[] = [
  {
    id: "emp_sched001",
    employeeId: "emp001",
    employeeNumber: "E-001",
    name: "田中一郎",
    position: "manager",
    department: "運行管理部",
    scheduleDate: "2025-01-27",
    workType: "regular",
    startTime: "09:00",
    endTime: "18:00",
    breakTime: 60,
    workLocation: "本社",
    assignedTasks: ["日次報告書作成", "ドライバー面談", "月次計画会議"],
    status: "confirmed",
    actualStartTime: "08:45",
    actualEndTime: "18:30",
    actualBreakTime: 45,
    notes: "早朝会議のため早出"
  },
  {
    id: "emp_sched002",
    employeeId: "emp002",
    employeeNumber: "E-002",
    name: "佐藤花子",
    position: "driver",
    department: "配車部",
    scheduleDate: "2025-01-27",
    workType: "night",
    startTime: "20:00",
    endTime: "05:00",
    breakTime: 60,
    workLocation: "銀座エリア",
    assignedTasks: ["ホステス送迎", "深夜配車業務"],
    status: "confirmed",
    notes: "深夜シフト"
  },
  {
    id: "emp_sched003",
    employeeId: "emp003",
    employeeNumber: "P-001",
    name: "山田次郎",
    position: "オペレーター",
    department: "配車部",
    scheduleDate: "2025-01-27",
    workType: "regular",
    startTime: "14:00",
    endTime: "22:00",
    breakTime: 60,
    workLocation: "コールセンター",
    assignedTasks: ["電話受付", "配車手配", "顧客対応"],
    status: "confirmed"
  }
];

// スタッフ台帳サンプルデータ
export const sampleStaffLedger: StaffLedger[] = [
  {
    id: "staff001",
    employeeNumber: "E-001",
    personalInfo: {
      name: "田中一郎",
      nameKana: "タナカイチロウ",
      nickname: "タナカさん",
      birthDate: "1985-04-15",
      age: 39,
      gender: "male",
      phoneNumber: "090-1234-5678",
      email: "tanaka@company.com",
      address: {
        zipCode: "150-0001",
        prefecture: "東京都",
        city: "渋谷区",
        street: "神宮前1-2-3",
        building: "渋谷マンション501"
      },
      emergencyContact: {
        name: "田中花子",
        phoneNumber: "03-1234-5678",
        relationship: "配偶者"
      }
    },
    employmentInfo: {
      hireDate: "2020-04-01",
      position: "運行管理部長",
      department: "運行管理部",
      employmentType: "full_time",
      workLocation: "本社",
      supervisor: "代表取締役",
      salaryType: "monthly",
      baseSalary: 350000
    },
    qualifications: {
      drivingLicense: {
        type: "普通自動車第一種",
        expiryDate: "2027-04-15"
      },
      certifications: ["運行管理者", "安全運転管理者"],
      languages: ["日本語", "英語"],
      skills: ["管理業務", "配車システム", "顧客対応"]
    },
    workHistory: {
      totalWorkDays: 1200,
      totalWorkHours: 9600,
      averageRating: 4.5,
      disciplinaryActions: 0,
      commendations: 3
    },
    status: "active",
    notes: "優秀な管理職、昇進候補"
  },
  {
    id: "staff002",
    employeeNumber: "E-002",
    personalInfo: {
      name: "佐藤花子",
      nameKana: "サトウハナコ",
      birthDate: "1990-08-22",
      age: 34,
      gender: "female",
      phoneNumber: "090-2345-6789",
      email: "sato@company.com",
      address: {
        zipCode: "106-0032",
        prefecture: "東京都",
        city: "港区",
        street: "六本木3-4-5",
        building: "六本木アパートメント302"
      },
      emergencyContact: {
        name: "佐藤太郎",
        phoneNumber: "03-2345-6789",
        relationship: "父"
      }
    },
    employmentInfo: {
      hireDate: "2022-01-15",
      position: "ドライバー",
      department: "配車部",
      employmentType: "full_time",
      workLocation: "銀座エリア",
      supervisor: "田中一郎",
      salaryType: "monthly",
      baseSalary: 280000
    },
    qualifications: {
      drivingLicense: {
        type: "普通自動車第二種",
        expiryDate: "2026-08-22"
      },
      certifications: ["接客サービス技能検定"],
      languages: ["日本語"],
      skills: ["運転技術", "顧客対応", "地理知識"]
    },
    workHistory: {
      totalWorkDays: 720,
      totalWorkHours: 6480,
      averageRating: 4.3,
      disciplinaryActions: 0,
      commendations: 1
    },
    status: "active",
    notes: "安全運転、顧客評価良好"
  }
];

// 空の日次シフトを作成
const createEmptyDailyShift = (): DailyShift => ({
  isWorkDay: false,
  shiftType: 'off',
  breakTime: 0,
  workHours: 0,
  location: '',
  notes: ''
});

// 従業員週間シフトサンプルデータ
export const sampleEmployeeWeeklyShifts: EmployeeWeeklyShift[] = [
  {
    id: "weekly_shift_001",
    employeeId: "emp001",
    employeeNumber: "E-001",
    name: "田中一郎",
    position: "運行管理部長",
    department: "運行管理部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      saturday: { isWorkDay: false, shiftType: 'off', breakTime: 0, workHours: 0, location: "", notes: "週休日" },
      sunday: { isWorkDay: false, shiftType: 'off', breakTime: 0, workHours: 0, location: "", notes: "週休日" }
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 40, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_002",
    employeeId: "emp002",
    employeeNumber: "E-002",
    name: "佐藤花子",
    position: "ドライバー",
    department: "配車部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "銀座エリア", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'night', startTime: "20:00", endTime: "05:00", breakTime: 60, workHours: 8, location: "銀座エリア", notes: "深夜シフト" },
      wednesday: createEmptyDailyShift(),
      thursday: { isWorkDay: true, shiftType: 'night', startTime: "20:00", endTime: "05:00", breakTime: 60, workHours: 8, location: "銀座エリア", notes: "深夜シフト" },
      friday: { isWorkDay: true, shiftType: 'evening', startTime: "16:00", endTime: "01:00", breakTime: 60, workHours: 8, location: "銀座エリア", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'holiday', startTime: "10:00", endTime: "19:00", breakTime: 60, workHours: 8, location: "銀座エリア", notes: "休日出勤" },
      sunday: { isWorkDay: false, shiftType: 'off', breakTime: 0, workHours: 0, location: "", notes: "週休日" }
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 24, overtimeHours: 8, nightHours: 16, holidayHours: 8 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_003",
    employeeId: "emp003",
    employeeNumber: "P-001",
    name: "山田次郎",
    position: "オペレーター",
    department: "配車部",
    category: "part_time" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'morning', startTime: "06:00", endTime: "15:00", breakTime: 60, workHours: 8, location: "コールセンター", notes: "早朝シフト" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "14:00", endTime: "22:00", breakTime: 60, workHours: 7, location: "コールセンター", notes: "" },
      wednesday: createEmptyDailyShift(),
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "14:00", endTime: "22:00", breakTime: 60, workHours: 7, location: "コールセンター", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "14:00", endTime: "22:00", breakTime: 60, workHours: 7, location: "コールセンター", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "18:00", breakTime: 60, workHours: 8, location: "コールセンター", notes: "" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 37, totalBreakTime: 300, regularHours: 37, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_004",
    employeeId: "emp004",
    employeeNumber: "E-003",
    name: "鈴木太郎",
    position: "ドライバー",
    department: "配車部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "19:00", breakTime: 60, workHours: 8, location: "新宿エリア", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "19:00", breakTime: 60, workHours: 8, location: "新宿エリア", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "19:00", breakTime: 60, workHours: 8, location: "新宿エリア", notes: "" },
      thursday: createEmptyDailyShift(),
      friday: { isWorkDay: true, shiftType: 'evening', startTime: "18:00", endTime: "03:00", breakTime: 60, workHours: 8, location: "新宿エリア", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'evening', startTime: "18:00", endTime: "03:00", breakTime: 60, workHours: 8, location: "新宿エリア", notes: "" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 32, overtimeHours: 8, nightHours: 8, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_005",
    employeeId: "emp005",
    employeeNumber: "E-004",
    name: "高橋美咲",
    position: "事務",
    department: "総務部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "17:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "17:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "17:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "17:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "09:00", endTime: "17:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      saturday: createEmptyDailyShift(),
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 35, totalBreakTime: 300, regularHours: 35, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_006",
    employeeId: "emp006",
    employeeNumber: "E-005",
    name: "伊藤健一",
    position: "ドライバー",
    department: "配車部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "06:00", breakTime: 60, workHours: 8, location: "六本木エリア", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "06:00", breakTime: 60, workHours: 8, location: "六本木エリア", notes: "" },
      wednesday: createEmptyDailyShift(),
      thursday: createEmptyDailyShift(),
      friday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "06:00", breakTime: 60, workHours: 8, location: "六本木エリア", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "06:00", breakTime: 60, workHours: 8, location: "六本木エリア", notes: "" },
      sunday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "06:00", breakTime: 60, workHours: 8, location: "六本木エリア", notes: "" }
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 16, overtimeHours: 0, nightHours: 40, holidayHours: 8 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_007",
    employeeId: "emp007",
    employeeNumber: "E-006",
    name: "渡辺さくら",
    position: "経理",
    department: "経理部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "09:30", endTime: "18:30", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "09:30", endTime: "18:30", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "09:30", endTime: "18:30", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "09:30", endTime: "18:30", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "09:30", endTime: "18:30", breakTime: 60, workHours: 8, location: "本社", notes: "" },
      saturday: createEmptyDailyShift(),
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 40, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_008",
    employeeId: "emp008",
    employeeNumber: "E-007",
    name: "小林雅也",
    position: "ドライバー",
    department: "配車部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: createEmptyDailyShift(),
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "渋谷エリア", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "渋谷エリア", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "渋谷エリア", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "渋谷エリア", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "17:00", breakTime: 60, workHours: 8, location: "渋谷エリア", notes: "" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 40, totalBreakTime: 300, regularHours: 40, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_009",
    employeeId: "emp009",
    employeeNumber: "P-002",
    name: "加藤りな",
    position: "オペレーター",
    department: "配車部",
    category: "part_time" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'evening', startTime: "17:00", endTime: "22:00", breakTime: 30, workHours: 4.5, location: "コールセンター", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'evening', startTime: "17:00", endTime: "22:00", breakTime: 30, workHours: 4.5, location: "コールセンター", notes: "" },
      wednesday: createEmptyDailyShift(),
      thursday: { isWorkDay: true, shiftType: 'evening', startTime: "17:00", endTime: "22:00", breakTime: 30, workHours: 4.5, location: "コールセンター", notes: "" },
      friday: { isWorkDay: true, shiftType: 'evening', startTime: "17:00", endTime: "23:00", breakTime: 30, workHours: 5.5, location: "コールセンター", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "18:00", breakTime: 60, workHours: 7, location: "コールセンター", notes: "" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 26, totalBreakTime: 180, regularHours: 26, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_010",
    employeeId: "emp010",
    employeeNumber: "E-008",
    name: "中村大輔",
    position: "マネージャー",
    department: "配車部",
    category: "staff" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "18:00", breakTime: 60, workHours: 9, location: "本社", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "18:00", breakTime: 60, workHours: 9, location: "本社", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "18:00", breakTime: 60, workHours: 9, location: "本社", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "18:00", breakTime: 60, workHours: 9, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "08:00", endTime: "18:00", breakTime: 60, workHours: 9, location: "本社", notes: "" },
      saturday: createEmptyDailyShift(),
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 5, totalWorkHours: 45, totalBreakTime: 300, regularHours: 40, overtimeHours: 5, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_011",
    employeeId: "emp011",
    employeeNumber: "P-003",
    name: "松本健太",
    position: "アルバイトドライバー",
    department: "配車部",
    category: "part_time" as EmployeeCategory,
    weeklySchedule: {
      monday: createEmptyDailyShift(),
      tuesday: { isWorkDay: true, shiftType: 'evening', startTime: "18:00", endTime: "00:00", breakTime: 30, workHours: 5.5, location: "銀座エリア", notes: "" },
      wednesday: { isWorkDay: true, shiftType: 'evening', startTime: "18:00", endTime: "00:00", breakTime: 30, workHours: 5.5, location: "銀座エリア", notes: "" },
      thursday: createEmptyDailyShift(),
      friday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "05:00", breakTime: 60, workHours: 7, location: "銀座エリア", notes: "深夜シフト" },
      saturday: { isWorkDay: true, shiftType: 'night', startTime: "21:00", endTime: "05:00", breakTime: 60, workHours: 7, location: "銀座エリア", notes: "深夜シフト" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 4, totalWorkHours: 25, totalBreakTime: 180, regularHours: 11, overtimeHours: 0, nightHours: 14, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_012",
    employeeId: "emp012",
    employeeNumber: "P-004",
    name: "西村友美",
    position: "アルバイト内勤",
    department: "総務部",
    category: "part_time" as EmployeeCategory,
    weeklySchedule: {
      monday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "15:00", breakTime: 30, workHours: 4.5, location: "本社", notes: "" },
      tuesday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "15:00", breakTime: 30, workHours: 4.5, location: "本社", notes: "" },
      wednesday: createEmptyDailyShift(),
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "15:00", breakTime: 30, workHours: 4.5, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "15:00", breakTime: 30, workHours: 4.5, location: "本社", notes: "" },
      saturday: createEmptyDailyShift(),
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 4, totalWorkHours: 18, totalBreakTime: 120, regularHours: 18, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  },
  {
    id: "weekly_shift_013",
    employeeId: "emp013",
    employeeNumber: "P-005",
    name: "藤田翔太",
    position: "アルバイト広報",
    department: "広報部",
    category: "part_time" as EmployeeCategory,
    weeklySchedule: {
      monday: createEmptyDailyShift(),
      tuesday: createEmptyDailyShift(),
      wednesday: { isWorkDay: true, shiftType: 'day', startTime: "13:00", endTime: "20:00", breakTime: 60, workHours: 6, location: "本社", notes: "" },
      thursday: { isWorkDay: true, shiftType: 'day', startTime: "13:00", endTime: "20:00", breakTime: 60, workHours: 6, location: "本社", notes: "" },
      friday: { isWorkDay: true, shiftType: 'day', startTime: "13:00", endTime: "20:00", breakTime: 60, workHours: 6, location: "本社", notes: "" },
      saturday: { isWorkDay: true, shiftType: 'day', startTime: "10:00", endTime: "18:00", breakTime: 60, workHours: 7, location: "本社", notes: "" },
      sunday: createEmptyDailyShift()
    },
    weeklyStats: { totalWorkDays: 4, totalWorkHours: 25, totalBreakTime: 240, regularHours: 25, overtimeHours: 0, nightHours: 0, holidayHours: 0 },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-25T10:00:00Z"
  }
];

