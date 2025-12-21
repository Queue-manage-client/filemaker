// 従業員関連の型定義

// 従業員給与集計データ
export interface EmployeeSalary {
  id: string;
  employeeId: string;
  employeeNumber: string; // 従業員番号
  name: string; // 名前
  nameKana: string; // 名前（カナ）
  position: 'manager' | 'driver' | 'operator' | 'admin' | 'part_time'; // 職種
  department: string; // 部署
  salaryPeriod: {
    year: number;
    month: number;
  }; // 給与対象期間
  baseSalary: number; // 基本給
  overtime: {
    hours: number; // 残業時間
    amount: number; // 残業代
  }; // 残業
  allowances: {
    transportation: number; // 交通費
    meal: number; // 食事手当
    night: number; // 深夜手当
    holiday: number; // 休日手当
    other: number; // その他手当
  }; // 各種手当
  bonuses: number; // 賞与
  grossSalary: number; // 総支給額
  deductions: {
    healthInsurance: number; // 健康保険
    pensionInsurance: number; // 厚生年金
    employmentInsurance: number; // 雇用保険
    incomeTax: number; // 所得税
    residentTax: number; // 住民税
    other: number; // その他控除
  }; // 控除
  netSalary: number; // 手取り額
  workDays: number; // 勤務日数
  workHours: number; // 勤務時間
  notes?: string; // 備考
}

// パートタイム給与データ
export interface PartTimeSalary {
  id: string;
  employeeId: string;
  employeeNumber: string;
  name: string;
  nameKana: string;
  position: string; // 職種
  salaryPeriod: {
    year: number;
    month: number;
  };
  hourlyRate: number; // 時給
  regularHours: number; // 通常勤務時間
  overtimeHours: number; // 残業時間
  nightHours: number; // 深夜勤務時間
  holidayHours: number; // 休日勤務時間
  regularPay: number; // 通常勤務給
  overtimePay: number; // 残業代
  nightPay: number; // 深夜手当
  holidayPay: number; // 休日手当
  transportationAllowance: number; // 交通費
  grossSalary: number; // 総支給額
  deductions: {
    incomeTax: number;
    other: number;
  }; // 控除
  netSalary: number; // 手取り額
  workDays: number; // 勤務日数
  totalHours: number; // 総勤務時間
}

// 従業員スケジュールデータ
export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  employeeNumber: string;
  name: string;
  position: string;
  department: string;
  scheduleDate: string; // スケジュール日
  workType: 'regular' | 'overtime' | 'holiday' | 'night' | 'off'; // 勤務タイプ
  startTime?: string; // 開始時間
  endTime?: string; // 終了時間
  breakTime: number; // 休憩時間（分）
  workLocation: string; // 勤務場所
  assignedTasks: string[]; // 担当業務
  notes?: string; // 備考
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'; // ステータス
  actualStartTime?: string; // 実際の開始時間
  actualEndTime?: string; // 実際の終了時間
  actualBreakTime?: number; // 実際の休憩時間
}

// シフトタイプの定義
export type ShiftType = 'morning' | 'day' | 'evening' | 'night' | 'early' | 'late' | 'holiday' | 'off';

// 1日のシフトデータ
export interface DailyShift {
  isWorkDay: boolean; // 勤務日かどうか
  shiftType: ShiftType; // シフトタイプ
  startTime?: string; // 開始時間（例: "09:00"）
  endTime?: string; // 終了時間（例: "18:00"）
  breakTime: number; // 休憩時間（分）
  workHours: number; // 実働時間
  location: string; // 勤務場所
  notes?: string; // 備考
}

// 従業員週間シフトデータ
export interface EmployeeWeeklyShift {
  id: string;
  employeeId: string;
  employeeNumber: string;
  name: string;
  position: string;
  department: string;

  // 1週間分のシフトデータ
  weeklySchedule: {
    monday: DailyShift;
    tuesday: DailyShift;
    wednesday: DailyShift;
    thursday: DailyShift;
    friday: DailyShift;
    saturday: DailyShift;
    sunday: DailyShift;
  };

  // 週間統計
  weeklyStats: {
    totalWorkDays: number; // 総勤務日数
    totalWorkHours: number; // 総勤務時間
    totalBreakTime: number; // 総休憩時間
    regularHours: number; // 通常勤務時間
    overtimeHours: number; // 残業時間
    nightHours: number; // 深夜勤務時間
    holidayHours: number; // 休日勤務時間
  };

  // メタデータ
  weekStartDate: string; // 週開始日（YYYY-MM-DD）
  weekEndDate: string; // 週終了日（YYYY-MM-DD）
  lastUpdated: string; // 最終更新日時
  status?: 'draft' | 'confirmed' | 'published'; // ステータス
  remarks?: string; // 備考
}

// シフトタイプの設定
export const shiftTypeSettings = {
  morning: { label: '早出', color: 'bg-green-200', textColor: 'text-green-800' },
  day: { label: '日勤', color: 'bg-blue-200', textColor: 'text-blue-800' },
  evening: { label: '夕勤', color: 'bg-yellow-200', textColor: 'text-yellow-800' },
  night: { label: '夜勤', color: 'bg-purple-200', textColor: 'text-purple-800' },
  early: { label: '早番', color: 'bg-teal-200', textColor: 'text-teal-800' },
  late: { label: '遅番', color: 'bg-orange-200', textColor: 'text-orange-800' },
  holiday: { label: '休日出勤', color: 'bg-red-200', textColor: 'text-red-800' },
  off: { label: '休み', color: 'bg-gray-200', textColor: 'text-gray-800' }
};

// スタッフ台帳データ
export interface StaffLedger {
  id: string;
  employeeNumber: string;
  personalInfo: {
    name: string;
    nameKana: string;
    nickname?: string;
    birthDate: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phoneNumber: string;
    email?: string;
    address: {
      zipCode: string;
      prefecture: string;
      city: string;
      street: string;
      building?: string;
    };
    emergencyContact: {
      name: string;
      phoneNumber: string;
      relationship: string;
    };
  }; // 個人情報
  employmentInfo: {
    hireDate: string;
    position: string;
    department: string;
    employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary';
    workLocation: string;
    supervisor: string;
    salaryType: 'monthly' | 'hourly' | 'commission';
    baseSalary: number;
    hourlyRate?: number;
  }; // 雇用情報
  qualifications: {
    drivingLicense?: {
      type: string;
      expiryDate: string;
    };
    certifications: string[];
    languages: string[];
    skills: string[];
  }; // 資格・スキル
  workHistory: {
    totalWorkDays: number;
    totalWorkHours: number;
    averageRating: number;
    disciplinaryActions: number;
    commendations: number;
  }; // 勤務履歴
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'; // ステータス
  notes?: string; // 備考
}

