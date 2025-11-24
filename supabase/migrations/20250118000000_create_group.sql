-- group table
create table if not exists public."group" (
  number integer primary key,
  name varchar(255),
  membership_number integer,
  initial varchar(1),
  digits integer,
  expenses_ratio numeric(5,2),
  is_discount_use boolean,
  discount_interval integer,
  discount_price integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public."group" is 'グループテーブル';
comment on column public."group".number is 'グループナンバー';
comment on column public."group".name is 'グループ名';
comment on column public."group".membership_number is '会員番号発番';
comment on column public."group".initial is '会員番号頭文字';
comment on column public."group".digits is '会員番号桁数';
comment on column public."group".expenses_ratio is '雑費割合';
comment on column public."group".is_discount_use is '回数割引使用';
comment on column public."group".discount_interval is '割引回数間隔';
comment on column public."group".discount_price is '割引金額';
comment on column public."group".created_at is '作成日時';
comment on column public."group".updated_at is '更新日時';

create trigger set_timestamp
before update on public."group"
for each row
execute function public.set_current_timestamp_updated_at();

