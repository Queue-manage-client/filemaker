shop (店舗テーブル)

| カラム名                              | データ型         | 説明                            |
| ------------------------------------- | ---------------- | ------------------------------- |
| id                                    | UUID(PK)         | 店舗の一意なID                  |
| SPID                                  | INT              | 店舗ID(要件定義書より)          |
| department_no                         | INT              | 部門No                          |
| accounting_category                   | VARCHAR(10)      | 会計区分                        |
| store_name                            | VARCHAR(255)     | 店舗名                          |
| store_name_furigana                   | VARCHAR(255)     | 店舗名ふりがな                  |
| store_name_short                      | VARCHAR(255)     | 省略店舗名                      |
| phone_number                          | VARCHAR(20)      | 電話番号                        |
| url                                   | VARCHAR(255)     | URL                             |
| mail                                  | VARCHAR(255)     | Mail                            |
| is_web                                | BOOLEAN          | web連携                         |
| web_management_id                     | VARCHAR(255)     | web管理用ID                     |
| web_management_pw                     | VARCHAR(255)     | web管理用PW（暗号化必須）       |
| web_management_url                    | VARCHAR(255)     | web管理用URL                    |
| hostess_page_url                      | VARCHAR(255)     | ホステスページURL               |
| hostess_list_url                      | VARCHAR(255)     | webホステス一覧URL              |
| hostess_attendance_management_url     | VARCHAR(255)     | ホステス出勤管理ページURL       |
| hostess_management_url                | VARCHAR(255)     | ホステス管理URL                 |
| send_hsprofile                        | VARCHAR(255)     | Web送信用                       |
| send_hsattend                         | VARCHAR(255)     | Web送信用                       |
| send_hsjob                            | VARCHAR(255)     | Web送信用                       |
| send_ctpoint                          | VARCHAR(255)     | Web送信用                       |
| send_hsstart                          | VARCHAR(255)     | Web送信用                       |
| send_hsranking                        | VARCHAR(255)     | Web送信用                       |
| course_fee_style                      | BOOLEAN          | コース料金方式(定額制/割合制)   |
| nomination_fee_style                  | BOOLEAN          | 指名料方式(店舗一律/ホステス別) |
| gm_category                           | BOOLEAN          | GM区分(有無)                    |
| nomination_fee                        | INT              | 指名料                          |
| extension_fee                         | INT              | 延長料金(円)                    |
| extension_per_minutes                 | INT              | 延長料金(/分)                   |
| standard_transportation_expenses      | INT              | 基本交通費                      |
| cancel_fee                            | INT              | キャンセル料                    |
| is_membership_card                    | BOOLEAN          | 会員カード発行(有無)            |
| customer_point_initial_former         | INT              | 顧客ポイント初期値前半          |
| customer_point_initial_latter         | INT              | 顧客ポイント初期値後半          |
| is_nomination_plusback                | BOOLEAN          | 指名プラスバック制(有無)        |
| membership_number_management          | BOOLEAN          | 会員番号発行管理(店舗/グループ) |
| change_fee                            | INT              | チェンジ料                      |
| card_commission                       | INT              | カード手数料                    |
| standard_hostess_recieve_rate         | NUMERIC(5,2)     | 基本ホステス受取率(%)           |
| extension_style                       | ENUM             | 延長方式(固定割合制/ホステス別) |
| extension_hostess_recieve_rate        | NUMERIC(5,2)     | 延長ホステス受取率(%)           |
| panel_nomination_fee                  | INT              | パネル指名料                    |
| star_price                            | INT              | 星単価                          |
| group_no                              | INT(FK)          | 所属グループナンバー            |
| business_style                        | ENUM             | デリヘルまたはホテヘルの列挙型  |
| former_start                          | VARCHAR(10)      | 前半開始時刻(以降)              |
| former_end                            | VARCHAR(10)      | 前半終了時刻(未満)              |
| latter_start                          | VARCHAR(10)      | 後半開始時刻(以降)              |
| latter_end                            | VARCHAR(10)      | 後半終了時刻(未満)              |
| is_hs_send_room_no                    | BOOLEAN          | hs送信客室番号                  |
| is_hs_send_end                        | BOOLEAN          | hs送信完了                      |
| created_at                            | TIMESTAMPTZ      | 作成日時                        |
| updated_at                            | TIMESTAMPTZ      | 更新日時                        |

staff (スタッフテーブル)　マイグレーション済み

| カラム名             | データ型     | 説明                      |
| -------------------- | ------------ | ------------------------- |
| id                   | UUID(PK)     | スタッフの一意なID        |
| sfid                 | INT          | スタッフID(要件定義書より)|
| first_name           | VARCHAR(255) | 名前                      |
| last_name            | VARCHAR(255) | 苗字                      |
| first_name_furigana  | VARCHAR(255) | 名前ふりがな              |
| last_name_furigana   | VARCHAR(255) | 苗字ふりがな              |
| area_division        | VARCHAR(255) | 地域区分                  |
| group                | VARCHAR(255) | グループ                  |
| status               | BOOLEAN      | 在職または退職            |
| bath_towel           | INT          | バスタオル持ち出し基礎数  |
| equipment            | INT          | 備品持ち出し基礎数        |
| joining_date         | TIMESTAMPTZ  | 就労日                    |
| resignation_date     | TIMESTAMPTZ  | 退職日                    |
| position             | VARCHAR(255) | 役職                      |
| employment_type      | VARCHAR(255) | 雇用区分                  |
| job_description      | VARCHAR(255) | 職務                      |
| mobile_email_address | VARCHAR(255) | 携帯メールアドレス        |
| pc_email_address     | VARCHAR(255) | PCメールアドレス          |
| phone_number         | VARCHAR(20)  | 電話番号                  |
| vehicle              | UUID(FK)     | 車情報(staff_car.id)      |
| remarks              | VARCHAR(255) | 備考                      |
| mon_start            | TIME         | 月曜出勤時間              |
| mon_end              | TIME         | 月曜退勤時間              |
| tue_start            | TIME         | 火曜出勤時間              |
| tue_end              | TIME         | 火曜退勤時間              |
| wed_start            | TIME         | 水曜出勤時間              |
| wed_end              | TIME         | 水曜退勤時間              |
| thu_start            | TIME         | 木曜出勤時間              |
| thu_end              | TIME         | 木曜退勤時間              |
| fri_start            | TIME         | 金曜出勤時間              |
| fri_end              | TIME         | 金曜退勤時間              |
| sat_start            | TIME         | 土曜出勤時間              |
| sat_end              | TIME         | 土曜退勤時間              |
| sun_start            | TIME         | 日曜出勤時間              |
| sun_end              | TIME         | 日曜退勤時間              |
| created_at           | TIMESTAMPTZ  | 作成日時                  |
| updated_at           | TIMESTAMPTZ  | 更新日時                  |



staff_car (スタッフ車テーブル)　マイグレーション済み

| カラム名   | データ型 | 説明                     |
| ---------- | ------------ | -------------------- |
| id         | UUID(PK)     | スタッフ車の一意なID |
| car_type   | VARCHAR(100) | 車種                 |
| color      | VARCHAR(255) | 色                   |
| capacity   | INT          | 定員                 |
| area       | VARCHAR(255) | 車ナンバー地域       |
| character  | VARCHAR(255) | 車ナンバーひらがな   |
| number     | INT          | 車ナンバー           |
| is_etc     | BOOLEAN      | ETC有無              |
| created_at | TIMESTAMPTZ  | 作成日時             |
| updated_at | TIMESTAMPTZ  | 更新日時             |



group (グループテーブル)

| カラム名          | データ型     | 説明              |
| ----------------- | ------------ | ----------------- |
| number            | INT(PK)      | グループナンバー  |
| name              | VARCHAR(255) | グループ名        |
| membership_number | INT          | 会員番号発番      |
| initial           | VARCHAR(1)   | 会員番号頭文字    |
| digits            | INT          | 会員番号桁数      |
| expenses_ratio    | NUMERIC(5,2) | 雑費割合          |
| is_discount_use   | BOOLEAN      | 回数割引使用      |
| discount_interval | INT          | 割引回数間隔      |
| discount_price    | INT          | 割引金額          |
| created_at        | TIMESTAMPTZ  | 作成日時          |
| updated_at        | TIMESTAMPTZ  | 更新日時          |



hostess(ホステステーブル) 　未完成

| カラム名      | データ型     | 説明                    |
| ------------- | ------------ | ----------------------- |
| id            | UUID(PK)     | ホステスの一意なID      |
| manager       | UUID(FK)     | マネージャ(staff.id)    |
| phone_number  | VARCHAR(20)  | 電話番号                |
| email         | VARCHAR(255) | メールアドレス          |
| stage_name    | VARCHAR(255) | 源氏名                  |
| shop_id       | UUID(FK)     | 所属店舗(shop.id)       |
| status        | ENUM         | ステータス(新人・退職済)|
| remark        | VARCHAR(255) | 備考                    |
| ng_place      | VARCHAR(255) | ホステスNG場所          |
| created_at    | TIMESTAMPTZ  | 作成日時                |
| updated_at    | TIMESTAMPTZ  | 更新日時                |


hotel(ホテルテーブル)

| カラム名          | データ型     | 説明                 |
| ----------------- | ------------ | -------------------- |
| id                | UUID(PK)     | ホテルの一意なID     |
| no                | INT          | ホテル番号           |
| division          | ENUM         | ホテル区分           |
| name_short        | VARCHAR(255) | ホテル名（省略）     |
| name_furigana     | VARCHAR(255) | ホテル名（ふりがな） |
| name_correct      | VARCHAR(255) | ホテル名（正式）     |
| caution           | VARCHAR(255) | 注意事項             |
| url               | VARCHAR(255) | URL                  |
| phone_number      | VARCHAR(20)  | 電話番号             |
| address_number    | VARCHAR(7)   | 郵便番号             |
| address           | VARCHAR(255) | 住所                 |
| address_in_kyoto  | VARCHAR(255) | 京都府内の住所       |
| address_city      | VARCHAR(255) | 市区町村             |
| address_town      | VARCHAR(255) | 町丁目               |
| address_street    | VARCHAR(255) | 番地                 |
| area_division     | ENUM         | エリア区分           |
| is_available_solo | BOOLEAN      | 一人利用可能か       |
| price_break       | INT          | 休憩料金             |
| price_stay        | INT          | 宿泊料金             |
| google_maps       | VARCHAR(255) | GoogleマップURL      |
| lobby_image       | VARCHAR(255) | ロビー画像URL        |
| created_at        | TIMESTAMPTZ  | 作成日時             |
| updated_at        | TIMESTAMPTZ  | 更新日時             |


present_hostess(出勤予定ホステステーブル)

| カラム名    | データ型     | 説明                              |
| ----------- | ------------ | --------------------------------- |
| hostess     | UUID(FK,PK)  | ホステス(hostess.id) - 複合主キー |
| attend_time | TIME(PK)     | 出勤時間 - 複合主キー             |
| driver      | UUID(FK)     | 迎えドライバ(staff.id)            |
| location    | VARCHAR(255) | 迎え場所                          |
| end_time    | TIME         | 終了時間                          |
| home_time   | TIME         | 帰宅時間                          |
| count       | INT          | 確定予約数                        |
| created_at  | TIMESTAMPTZ  | 作成日時                          |
| updated_at  | TIMESTAMPTZ  | 更新日時                          |

**主キー**: PRIMARY KEY (hostess, attend_time)


reservation(予約リスト)

| カラム名        | データ型     | 説明                  |
| --------------- | ------------ | --------------------- |
| id              | UUID(PK)     | 予約の一意なID        |
| hostess         | UUID(FK)     | ホステス(hostess.id)  |
| customer        | UUID(FK)     | 顧客(customer.id)     |
| course_id       | UUID(FK)     | コース(course.id)     |
| in_driver       | UUID(FK)     | INドライバ(staff.id)  |
| out_driver      | UUID(FK)     | OUTドライバ(staff.id) |
| location        | VARCHAR(255) | 場所                  |
| pickup_location | VARCHAR(255) | 迎え場所              |
| reservation_date| DATE         | 予約日                |
| start_time      | TIME         | 開始時間              |
| end_time        | TIME         | 終了時間              |
| is_receipt      | BOOLEAN      | 領収書                |
| is_waiting      | BOOLEAN      | 待合せ                |
| is_arrival_call | BOOLEAN      | 着TEL                 |
| is_card         | BOOLEAN      | カード                |
| is_option       | BOOLEAN      | オプション            |
| created_at      | TIMESTAMPTZ  | 作成日時              |
| updated_at      | TIMESTAMPTZ  | 更新日時              |
| review          | INT          | 評価(1~5の5段階評価)  |
| is_repeat       | BOOLEAN      | リピート客            |

**パーティショニング**: 日付ベースのパーティショニングを検討（月次パーティショニング推奨）
```sql
PARTITION BY RANGE (reservation_date)
```


gm_division(GM区分テーブル)

| カラム名     | データ型     | 説明              |
| ------------ | ------------ | ----------------- |
| id           | UUID(PK)     | GM区分の一意なID  |
| gm_division  | VARCHAR(255) | GM区分            |
| hostess_type | BOOLEAN      | ホステス種別(A/B) |
| web_name     | VARCHAR(255) | Web名称           |
| hp_number    | INT          | HP番号            |
| sort_order   | INT          | ソート順          |
| created_at   | TIMESTAMPTZ  | 作成日時          |
| updated_at   | TIMESTAMPTZ  | 更新日時          |


course(コーステーブル)

| カラム名              | データ型     | 説明                              |
| --------------------- | ------------ | --------------------------------- |
| id                    | UUID(PK)     | コースの一意なID                  |
| shop_id               | UUID(FK)     | 店舗(shop.id)                     |
| name                  | VARCHAR(255) | コース名                          |
| gm_division_id        | UUID(FK)     | GM区分(gm_division.id)            |
| course_type           | ENUM         | コース種類(Standard/Gold/Premium) |
| type                  | ENUM         | 種別(A/B)                         |
| duration              | INT          | 時間(分)                          |
| price                 | INT          | 料金                              |
| hostess_free_rate     | NUMERIC(5,2) | ホステス取り分(フリー, %)         |
| hostess_panel_rate    | NUMERIC(5,2) | ホステス取り分(パネル, %)         |
| hostess_nominate_rate | NUMERIC(5,2) | ホステス取り分(指名, %)           |
| is_active             | BOOLEAN      | 有効/無効                         |
| created_at            | TIMESTAMPTZ  | 作成日時                          |
| updated_at            | TIMESTAMPTZ  | 更新日時                          |



discount(割引テーブル)

| カラム名          | データ型     | 説明                    |
| ----------------- | ------------ | ----------------------- |
| id                | UUID(PK)     | 割引の一意なID          |
| shop_id           | UUID(FK)     | 店舗(shop.id)           |
| name              | VARCHAR(255) | 割引名                  |
| price             | INT          | 金額                    |
| status            | ENUM         | 現状(使用中/中止)       |
| remarks           | VARCHAR      | 備考                    |