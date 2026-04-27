import { BasicTag } from '@/types/basic-tag';

export const basicTagSampleData: BasicTag[] = [
  {
    // 基本情報
    spid: 1001,
    dailyReportDisplay: true,
    departmentNo: "001",
    accountingCategory: "A",
    nonSameDayWorkGroup: "", // 空欄
    
    // 店舗情報
    storeName: "本店",
    storeNameKana: "ほんてん",
    storeNameAbbr: "本店",
    phoneNumber: "03-1234-5678",
    url: "https://example-club.com",
    email: "info@example-club.com",
    
    // Web設定
    webLinkage: true,
    webSendMode: "本",
    webManageId: "admin001",
    webManagePassword: "pass123",
    webManageUrl: "/admin/manage",
    hostessPageUrl: "/hostess",
    webHostessListUrl: "/hostess/list",
    hostessAttendanceManageUrl: "/hostess/attendance",
    hostessManageUrl: "/hostess/manage",
    
    // web送信用URL (青枠内表示)
    webSendUrls: {
      hsprofile: "/api/hostess/profile",
      hsattend: "/api/hostess/attend",
      hsjob: "/api/hostess/job",
      ctpoint: "/api/customer/point",
      hstattendweek: "/api/hostess/attend/week",
      hsstart: "/api/hostess/start",
      hsranking: "/api/hostess/ranking"
    },

    // web送信用URL 仮 (黄枠内表示)
    webSendUrlsTemp: {
      hsprofile: "/api/temp/hostess/profile",
      hsattend: "/api/temp/hostess/attend",
      hsjob: "/api/temp/hostess/job",
      ctpoint: "/api/temp/customer/point",
      hstattendweek: "/api/temp/hostess/attend/week",
      hsstart: "/api/temp/hostess/start",
      hsranking: "/api/temp/hostess/ranking"
    },

    // 追加設定項目
    coursePricingMethod: "定額制",
    nominationMethod: "店舗一律",
    gmDivision: "ガールズ",
    nominationFee: 1000,
    extensionFee: 3000,
    extensionUnit: 30,
    basicTransportationFee: 1500,
    cancellationFee: 5000,
    memberCardIssuance: "有",
    customerPointInitialValueFirstHalf: 100,
    customerPointInitialValueSecondHalf: 50,
    nominationPlusBackSystem: "有",
    changeFee: 2000,
    cardCommissionRate: 3.5,
    basicHostessReceivingRate: "", // 空欄
    extensionMethod: "固定割合制",
    extensionHostessReceivingRate: "", // 空欄
    panelNominationFee: 1500,
    starUnitPrice: "", // 空欄
    starFeeExcludeFrNR: "有",
    businessType: "デリヘル",
    memberNumberIssuanceManagement: "店舗",
    storeSpecificMemberNumberIssuance: "S001",
    groupNo: "",
    groupCommonMemberNumberIssuance: "",
    firstHalfStartTime: "18:00",
    firstHalfEndTime: "24:00",
    secondHalfStartTime: "24:00",
    secondHalfEndTime: "05:00"
  },
  {
    // 基本情報
    spid: 1002,
    dailyReportDisplay: false,
    departmentNo: "002",
    accountingCategory: "B",
    nonSameDayWorkGroup: "", // 空欄
    
    // 店舗情報
    storeName: "2F店舗",
    storeNameKana: "にかいてんぽ",
    storeNameAbbr: "2F店",
    phoneNumber: "03-2345-6789",
    url: "https://2f-store.com",
    email: "contact@2f-store.com",
    
    // Web設定
    webLinkage: false,
    webSendMode: "仮",
    webManageId: "admin002",
    webManagePassword: "pass456",
    webManageUrl: "/admin/manage",
    hostessPageUrl: "/hostess",
    webHostessListUrl: "/hostess/list",
    hostessAttendanceManageUrl: "/hostess/attendance",
    hostessManageUrl: "/hostess/manage",
    
    // web送信用URL (青枠内表示)
    webSendUrls: {
      hsprofile: "/api/hostess/profile",
      hsattend: "/api/hostess/attend",
      hsjob: "/api/hostess/job",
      ctpoint: "/api/customer/point",
      hstattendweek: "/api/hostess/attend/week",
      hsstart: "/api/hostess/start",
      hsranking: "/api/hostess/ranking"
    },

    // web送信用URL 仮 (黄枠内表示)
    webSendUrlsTemp: {
      hsprofile: "/api/temp/hostess/profile",
      hsattend: "/api/temp/hostess/attend",
      hsjob: "/api/temp/hostess/job",
      ctpoint: "/api/temp/customer/point",
      hstattendweek: "/api/temp/hostess/attend/week",
      hsstart: "/api/temp/hostess/start",
      hsranking: "/api/temp/hostess/ranking"
    },

    // 追加設定項目
    coursePricingMethod: "割合制",
    nominationMethod: "ホステス別",
    gmDivision: "無",
    nominationFee: 1500,
    extensionFee: 2500,
    extensionUnit: 20,
    basicTransportationFee: 2000,
    cancellationFee: 3000,
    memberCardIssuance: "無",
    customerPointInitialValueFirstHalf: 150,
    customerPointInitialValueSecondHalf: 75,
    nominationPlusBackSystem: "無",
    changeFee: 1500,
    cardCommissionRate: 4.0,
    basicHostessReceivingRate: "", // 空欄
    extensionMethod: "ホステス別",
    extensionHostessReceivingRate: "", // 空欄
    panelNominationFee: 2000,
    starUnitPrice: "", // 空欄
    starFeeExcludeFrNR: "無",
    businessType: "ホテヘル",
    memberNumberIssuanceManagement: "グループ",
    storeSpecificMemberNumberIssuance: "",
    groupNo: "G001",
    groupCommonMemberNumberIssuance: "G001001",
    firstHalfStartTime: "19:00",
    firstHalfEndTime: "01:00",
    secondHalfStartTime: "01:00",
    secondHalfEndTime: "06:00"
  },
  {
    // 基本情報
    spid: 1003,
    dailyReportDisplay: true,
    departmentNo: "003",
    accountingCategory: "C",
    nonSameDayWorkGroup: "", // 空欄
    
    // 店舗情報
    storeName: "VIPルーム",
    storeNameKana: "ぶいあいぴーるーむ",
    storeNameAbbr: "VIP",
    phoneNumber: "03-3456-7890",
    url: "https://vip-room.com",
    email: "info@vip-room.com",
    
    // Web設定
    webLinkage: true,
    webSendMode: "本",
    webManageId: "admin003",
    webManagePassword: "pass789",
    webManageUrl: "/admin/manage",
    hostessPageUrl: "/hostess",
    webHostessListUrl: "/hostess/list",
    hostessAttendanceManageUrl: "/hostess/attendance",
    hostessManageUrl: "/hostess/manage",
    
    // web送信用URL (青枠内表示)
    webSendUrls: {
      hsprofile: "/api/hostess/profile",
      hsattend: "/api/hostess/attend",
      hsjob: "/api/hostess/job",
      ctpoint: "/api/customer/point",
      hstattendweek: "/api/hostess/attend/week",
      hsstart: "/api/hostess/start",
      hsranking: "/api/hostess/ranking"
    },

    // web送信用URL 仮 (黄枠内表示)
    webSendUrlsTemp: {
      hsprofile: "/api/temp/hostess/profile",
      hsattend: "/api/temp/hostess/attend",
      hsjob: "/api/temp/hostess/job",
      ctpoint: "/api/temp/customer/point",
      hstattendweek: "/api/temp/hostess/attend/week",
      hsstart: "/api/temp/hostess/start",
      hsranking: "/api/temp/hostess/ranking"
    },

    // 追加設定項目
    coursePricingMethod: "定額制",
    nominationMethod: "店舗一律",
    gmDivision: "ガールズ",
    nominationFee: 1000,
    extensionFee: 3000,
    extensionUnit: 30,
    basicTransportationFee: 1500,
    cancellationFee: 5000,
    memberCardIssuance: "有",
    customerPointInitialValueFirstHalf: 100,
    customerPointInitialValueSecondHalf: 50,
    nominationPlusBackSystem: "有",
    changeFee: 2000,
    cardCommissionRate: 3.5,
    basicHostessReceivingRate: "", // 空欄
    extensionMethod: "固定割合制",
    extensionHostessReceivingRate: "", // 空欄
    panelNominationFee: 1500,
    starUnitPrice: "", // 空欄
    starFeeExcludeFrNR: "有",
    businessType: "デリヘル",
    memberNumberIssuanceManagement: "店舗",
    storeSpecificMemberNumberIssuance: "S001",
    groupNo: "",
    groupCommonMemberNumberIssuance: "",
    firstHalfStartTime: "18:00",
    firstHalfEndTime: "24:00",
    secondHalfStartTime: "24:00",
    secondHalfEndTime: "05:00"
  },
  {
    // 基本情報
    spid: 1004,
    dailyReportDisplay: true,
    departmentNo: "004",
    accountingCategory: "D",
    nonSameDayWorkGroup: "", // 空欄
    
    // 店舗情報
    storeName: "銀座支店",
    storeNameKana: "ぎんざしてん",
    storeNameAbbr: "銀座支",
    phoneNumber: "03-4567-8901",
    url: "https://ginza-branch.com",
    email: "info@ginza-branch.com",
    
    // Web設定
    webLinkage: true,
    webSendMode: "本",
    webManageId: "admin004",
    webManagePassword: "pass012",
    webManageUrl: "/admin/manage",
    hostessPageUrl: "/hostess",
    webHostessListUrl: "/hostess/list",
    hostessAttendanceManageUrl: "/hostess/attendance",
    hostessManageUrl: "/hostess/manage",
    
    // web送信用URL (青枠内表示)
    webSendUrls: {
      hsprofile: "/api/hostess/profile",
      hsattend: "/api/hostess/attend",
      hsjob: "/api/hostess/job",
      ctpoint: "/api/customer/point",
      hstattendweek: "/api/hostess/attend/week",
      hsstart: "/api/hostess/start",
      hsranking: "/api/hostess/ranking"
    },

    // web送信用URL 仮 (黄枠内表示)
    webSendUrlsTemp: {
      hsprofile: "/api/temp/hostess/profile",
      hsattend: "/api/temp/hostess/attend",
      hsjob: "/api/temp/hostess/job",
      ctpoint: "/api/temp/customer/point",
      hstattendweek: "/api/temp/hostess/attend/week",
      hsstart: "/api/temp/hostess/start",
      hsranking: "/api/temp/hostess/ranking"
    },

    // 追加設定項目
    coursePricingMethod: "定額制",
    nominationMethod: "店舗一律",
    gmDivision: "ガールズ",
    nominationFee: 1000,
    extensionFee: 3000,
    extensionUnit: 30,
    basicTransportationFee: 1500,
    cancellationFee: 5000,
    memberCardIssuance: "有",
    customerPointInitialValueFirstHalf: 100,
    customerPointInitialValueSecondHalf: 50,
    nominationPlusBackSystem: "有",
    changeFee: 2000,
    cardCommissionRate: 3.5,
    basicHostessReceivingRate: "", // 空欄
    extensionMethod: "固定割合制",
    extensionHostessReceivingRate: "", // 空欄
    panelNominationFee: 1500,
    starUnitPrice: "", // 空欄
    starFeeExcludeFrNR: "有",
    businessType: "デリヘル",
    memberNumberIssuanceManagement: "店舗",
    storeSpecificMemberNumberIssuance: "S001",
    groupNo: "",
    groupCommonMemberNumberIssuance: "",
    firstHalfStartTime: "18:00",
    firstHalfEndTime: "24:00",
    secondHalfStartTime: "24:00",
    secondHalfEndTime: "05:00"
  },
  {
    // 基本情報
    spid: 1005,
    dailyReportDisplay: false,
    departmentNo: "005",
    accountingCategory: "E",
    nonSameDayWorkGroup: "", // 空欄
    
    // 店舗情報
    storeName: "渋谷支店",
    storeNameKana: "しぶやしてん",
    storeNameAbbr: "渋谷支",
    phoneNumber: "03-5678-9012",
    url: "https://shibuya-branch.com",
    email: "info@shibuya-branch.com",
    
    // Web設定
    webLinkage: false,
    webSendMode: "仮",
    webManageId: "admin005",
    webManagePassword: "pass345",
    webManageUrl: "/admin/manage",
    hostessPageUrl: "/hostess",
    webHostessListUrl: "/hostess/list",
    hostessAttendanceManageUrl: "/hostess/attendance",
    hostessManageUrl: "/hostess/manage",
    
    // web送信用URL (青枠内表示)
    webSendUrls: {
      hsprofile: "/api/hostess/profile",
      hsattend: "/api/hostess/attend",
      hsjob: "/api/hostess/job",
      ctpoint: "/api/customer/point",
      hstattendweek: "/api/hostess/attend/week",
      hsstart: "/api/hostess/start",
      hsranking: "/api/hostess/ranking"
    },

    // web送信用URL 仮 (黄枠内表示)
    webSendUrlsTemp: {
      hsprofile: "/api/temp/hostess/profile",
      hsattend: "/api/temp/hostess/attend",
      hsjob: "/api/temp/hostess/job",
      ctpoint: "/api/temp/customer/point",
      hstattendweek: "/api/temp/hostess/attend/week",
      hsstart: "/api/temp/hostess/start",
      hsranking: "/api/temp/hostess/ranking"
    },

    // 追加設定項目
    coursePricingMethod: "定額制",
    nominationMethod: "ホステス別",
    gmDivision: "ガールズ",
    nominationFee: 800,
    extensionFee: 2800,
    extensionUnit: 25,
    basicTransportationFee: 1200,
    cancellationFee: 4000,
    memberCardIssuance: "有",
    customerPointInitialValueFirstHalf: 80,
    customerPointInitialValueSecondHalf: 40,
    nominationPlusBackSystem: "無",
    changeFee: 1800,
    cardCommissionRate: 3.2,
    basicHostessReceivingRate: "", // 空欄
    extensionMethod: "固定割合制",
    extensionHostessReceivingRate: "", // 空欄
    panelNominationFee: 1200,
    starUnitPrice: "", // 空欄
    starFeeExcludeFrNR: "無",
    businessType: "デリヘル",
    memberNumberIssuanceManagement: "グループ",
    storeSpecificMemberNumberIssuance: "",
    groupNo: "G001",
    groupCommonMemberNumberIssuance: "G001002",
    firstHalfStartTime: "20:00",
    firstHalfEndTime: "02:00",
    secondHalfStartTime: "02:00",
    secondHalfEndTime: "08:00"
  }
];
