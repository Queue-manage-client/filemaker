export interface BasicTag {
  // 基本情報
  spid: number; // SPID(通し番号)
  dailyReportDisplay: boolean; // 日報表示(表示または非表示)
  departmentNo: string; // 部門No
  accountingCategory: 'A' | 'B' | 'C' | 'D' | 'E'; // 会計区分(A~E)
  nonSameDayWorkGroup: string; // 非同日出勤グループ
  
  // 店舗情報
  storeName: string; // 店舗名
  storeNameKana: string; // 店舗名ふりがな
  storeNameAbbr: string; // 省略店舗名
  phoneNumber: string; // 電話番号
  url: string; // URL
  email: string; // Mail
  
  // Web設定
  webLinkage: boolean; // web連携
  webSendMode: '本' | '仮'; // web送信本仮切替sw(ラジオボタン、本または仮)
  webManageId: string; // web管理用ID
  webManagePassword: string; // web管理用パス
  webManageUrl: string; // web管理用URL
  hostessPageUrl: string; // ホステスページURL
  webHostessListUrl: string; // webホステス一覧URL
  hostessAttendanceManageUrl: string; // ホステス出勤管理ページURL
  hostessManageUrl: string; // ホステス管理ページURL
  
  // web送信用URL (青枠内表示)
  webSendUrls: {
    hsprofile: string;
    hsattend: string;
    hsjob: string;
    ctpoint: string;
    hstattendweek: string;
    hsstart: string;
    hsranking: string;
  };

  // web送信用URL 仮 (黄枠内表示)
  webSendUrlsTemp: {
    hsprofile: string;
    hsattend: string;
    hsjob: string;
    ctpoint: string;
    hstattendweek: string;
    hsstart: string;
    hsranking: string;
  };

  // 追加設定項目
  coursePricingMethod: '定額制' | '割合制'; // コース料金方式
  nominationMethod: '店舗一律' | 'ホステス別'; // 指名方式
  gmDivision: '無' | 'ガールズ' | 'レディ' | '両方'; // GM区分（ガール/レディ別登録可）
  nominationFee: number; // 指名料
  extensionFee: number; // 延長料金
  extensionUnit: number; // 延長単位(分)
  basicTransportationFee: number; // 基本交通費
  cancellationFee: number; // キャンセル料
  memberCardIssuance: '有' | '無'; // 会員カード発行
  customerPointInitialValueFirstHalf: number; // 顧客ポイント初期値前半
  customerPointInitialValueSecondHalf: number; // 顧客ポイント初期値後半(%)
  nominationPlusBackSystem: '有' | '無'; // 指名プラスバック制
  changeFee: number; // チェンジ料
  cardCommissionRate: number; // カード手数料率
  basicHostessReceivingRate: string; // 基本ホステス受取率(サンプルデータでは空欄)
  extensionMethod: '固定割合制' | 'ホステス別'; // 延長方式
  extensionHostessReceivingRate: string; // 延長ホステス受取率(サンプルデータでは空欄)
  panelNominationFee: number; // パネル指名料
  starUnitPrice: string; // 星単価(サンプルデータでは空欄)
  starFeeExcludeFrNR: '有' | '無'; // 星料FR_N_Rは除く
  businessType: 'デリヘル' | 'ホテヘル'; // 営業形態
  memberNumberIssuanceManagement: '店舗' | 'グループ'; // 会員番号発行管理
  storeSpecificMemberNumberIssuance: string; // 店舗別会員番号発番(会員番号発行管理が店舗のときだけ使用)
  groupNo: string; // グループNo(会員番号発行管理がグループのときだけ使用)
  groupCommonMemberNumberIssuance: string; // グループ共通会員番号発番(会員番号発行管理がグループのときだけ使用)
  firstHalfStartTime: string; // 前半開始(時間)
  firstHalfEndTime: string; // 前半終了(時間)
  secondHalfStartTime: string; // 後半開始(時間)
  secondHalfEndTime: string; // 後半終了(時間)
}

export interface BasicTagFormData extends BasicTag {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
