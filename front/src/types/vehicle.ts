// 車両・運営関連の型定義

// 燃費エコ管理データ
export interface FuelEcoManagement {
  id: string;
  vehicleId: string;
  vehicleNumber: string; // 車両番号
  driverId: string;
  driverName: string;
  period: {
    startDate: string;
    endDate: string;
  }; // 対象期間
  fuelData: {
    totalFuelConsumed: number; // 総燃料消費量（L）
    totalDistance: number; // 総走行距離（km）
    fuelEfficiency: number; // 燃費（km/L）
    fuelCost: number; // 燃料費
    costPerKm: number; // 1kmあたりのコスト
  }; // 燃料データ
  dailyRecords: {
    date: string;
    startMileage: number; // 開始時メーター
    endMileage: number; // 終了時メーター
    distance: number; // 走行距離
    fuelAdded: number; // 給油量（L）
    fuelCost: number; // 給油金額
    fuelEfficiency: number; // 燃費
    drivingConditions: 'city' | 'highway' | 'mixed'; // 運転条件
    weather: 'clear' | 'rainy' | 'snow' | 'fog'; // 天候
    trafficCondition: 'light' | 'moderate' | 'heavy'; // 交通状況
  }[]; // 日別記録
  comparison: {
    previousPeriod: {
      fuelEfficiency: number;
      fuelCost: number;
      costPerKm: number;
    };
    improvement: {
      efficiencyChange: number; // 燃費改善（%）
      costSaving: number; // コスト削減額
    };
    target: {
      targetEfficiency: number; // 目標燃費
      achievementRate: number; // 達成率（%）
    };
  }; // 比較データ
  ecoScore: number; // エコスコア（1-100）
  recommendations: string[]; // 改善提案
  notes?: string; // 備考
}

// 有料道路データ
export interface VehicleTollRoad {
  id: string;
  tollRoadName: string; // 有料道路名
  routeCode: string; // ルートコード
  sections: {
    sectionId: string;
    sectionName: string;
    entryPoint: string; // 入口
    exitPoint: string; // 出口
    distance: number; // 距離（km）
    tollFee: {
      regular: number; // 普通車
      large: number; // 大型車
      motorcycle: number; // 二輪車
    }; // 通行料金
    discounts: {
      timeDiscount: {
        description: string;
        discountRate: number; // 割引率（%）
        applicableHours: string; // 適用時間
      }[];
      etcDiscount: number; // ETC割引率（%）
      frequentUserDiscount: number; // 頻繁利用者割引（%）
    }; // 割引情報
  }[]; // 区間情報
  usage: {
    vehicleId: string;
    vehicleNumber: string;
    driverId: string;
    driverName: string;
    usageDate: string;
    entryTime: string;
    exitTime: string;
    entryPoint: string;
    exitPoint: string;
    tollPaid: number;
    paymentMethod: 'etc' | 'cash' | 'card';
    jobId?: string; // 関連案件ID
    customerName?: string;
    receipt: boolean; // 領収書発行
  }[]; // 利用履歴
  monthlyStats: {
    month: string;
    totalUsage: number; // 総利用回数
    totalCost: number; // 総費用
    averageCostPerTrip: number; // 1回あたり平均費用
    mostUsedRoute: string; // 最頻利用ルート
    costSavings: number; // 割引による節約額
  }[]; // 月別統計
  alternatives: {
    alternativeRoute: string;
    estimatedTime: number; // 推定時間
    estimatedCost: number; // 推定費用
    distanceDifference: number; // 距離差
    timeDifference: number; // 時間差
    recommendation: 'toll_road' | 'alternative' | 'depends_on_traffic';
  }[]; // 代替ルート
}

// 店舗一覧データ
export interface StoreList {
  id: string;
  storeNumber: string; // 店舗番号
  storeName: string; // 店舗名
  storeNameKana: string; // 店舗名（カナ）
  storeType: 'main_branch' | 'branch' | 'franchise' | 'partner'; // 店舗タイプ
  address: {
    zipCode: string;
    prefecture: string;
    city: string;
    street: string;
    building?: string;
  }; // 住所
  contactInfo: {
    phoneNumber: string;
    faxNumber?: string;
    email?: string;
    managerName: string;
    managerPhone: string;
  }; // 連絡先
  businessInfo: {
    openingDate: string;
    businessHours: {
      weekday: {
        open: string;
        close: string;
      };
      weekend: {
        open: string;
        close: string;
      };
      holiday: {
        open: string;
        close: string;
      };
    };
    services: string[]; // 提供サービス
    specialFeatures: string[]; // 特徴
  }; // 営業情報
  staffInfo: {
    totalStaff: number;
    managers: number;
    hostesses: number;
    drivers: number;
    operators: number;
    partTime: number;
  }; // スタッフ情報
  performance: {
    monthlyRevenue: number;
    monthlyCustomers: number;
    averageJobValue: number;
    customerSatisfactionScore: number;
    repeatCustomerRate: number; // リピート率（%）
    growthRate: number; // 成長率（%）
  }; // パフォーマンス
  facilities: {
    parkingSpaces: number;
    waitingArea: boolean;
    conferenceRoom: boolean;
    restroom: boolean;
    smokingArea: boolean;
    wheelchairAccessible: boolean;
    other: string[];
  }; // 設備
  status: 'operating' | 'temporarily_closed' | 'under_renovation' | 'closed';
  notes?: string; // 備考
}

// 送迎車両データ
export interface TransportCar {
  id: string;
  name: string; // 例: '1号車'
  vehicleNumber: string; // 例: '品川 500 あ 12-34'
  driverName: string;
  driverPhone?: string;
  eta: string; // 到着予想時刻
  color?: string; // hex カラー（視覚識別用）
  purpose: 'pickup' | 'sendoff'; // 用途区分
}

// 店舗台帳データ
export interface StoreLedger extends StoreList {
  financialInfo: {
    initialInvestment: number; // 初期投資額
    monthlyOperatingCost: number; // 月間運営費
    monthlyRent: number; // 月額賃料
    utilities: number; // 光熱費
    insurance: number; // 保険料
    maintenance: number; // 維持費
    marketingBudget: number; // マーケティング予算
  }; // 財務情報
  contracts: {
    leaseContract: {
      landlord: string;
      leaseStartDate: string;
      leaseEndDate: string;
      monthlyRent: number;
      securityDeposit: number;
      renewalOption: boolean;
    };
    insuranceContract: {
      provider: string;
      policyNumber: string;
      coverageAmount: number;
      premiumAmount: number;
      expiryDate: string;
    };
    utilityContracts: {
      electricity: { provider: string; accountNumber: string };
      gas: { provider: string; accountNumber: string };
      water: { provider: string; accountNumber: string };
      internet: { provider: string; accountNumber: string };
    };
  }; // 契約情報
  compliance: {
    businessLicense: {
      licenseNumber: string;
      issueDate: string;
      expiryDate: string;
      renewalRequired: boolean;
    };
    permits: {
      permitType: string;
      permitNumber: string;
      issueDate: string;
      expiryDate: string;
      status: 'valid' | 'expired' | 'pending_renewal';
    }[];
    inspections: {
      inspectionType: string;
      lastInspectionDate: string;
      nextInspectionDate: string;
      result: 'passed' | 'failed' | 'conditional';
      notes?: string;
    }[];
  }; // コンプライアンス
  auditHistory: {
    auditDate: string;
    auditorName: string;
    auditType: 'financial' | 'operational' | 'compliance' | 'safety';
    findings: string[];
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: string;
  }[]; // 監査履歴
}

