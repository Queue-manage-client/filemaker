'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  EMPLOYMENT_TYPE_LABELS,
  JOB_TYPE_LABELS,
  ROLE_LABELS,
} from '@/types';

type StaffDetailPageProps = {
  params: Promise<{ id: string }>;
};

type Day =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

type BasicDaySchedule = {
  work: boolean;
  start: string;
  end: string;
};

type BasicSchedule = Record<Day, BasicDaySchedule>;

type AttendanceRecord = {
  date: string;
  checkIn: string;
  checkOut: string;
  workMinutes: number;
  note: string;
};

const SAMPLE_ATTENDANCE: AttendanceRecord[] = [
  { date: '2026-03-26', checkIn: '09:02', checkOut: '18:15', workMinutes: 553, note: '' },
  { date: '2026-03-25', checkIn: '08:55', checkOut: '18:00', workMinutes: 545, note: '' },
  { date: '2026-03-24', checkIn: '09:10', checkOut: '19:05', workMinutes: 595, note: '残業' },
  { date: '2026-03-21', checkIn: '08:58', checkOut: '18:02', workMinutes: 544, note: '' },
  { date: '2026-03-20', checkIn: '09:05', checkOut: '18:10', workMinutes: 545, note: '' },
  { date: '2026-03-19', checkIn: '09:00', checkOut: '17:45', workMinutes: 525, note: '早退' },
  { date: '2026-03-18', checkIn: '09:03', checkOut: '18:20', workMinutes: 557, note: '' },
  { date: '2026-03-17', checkIn: '08:50', checkOut: '18:00', workMinutes: 550, note: '' },
  { date: '2026-03-14', checkIn: '09:15', checkOut: '18:30', workMinutes: 555, note: '' },
  { date: '2026-03-13', checkIn: '09:00', checkOut: '18:00', workMinutes: 540, note: '' },
  { date: '2026-03-12', checkIn: '09:05', checkOut: '18:45', workMinutes: 580, note: '残業' },
  { date: '2026-03-11', checkIn: '08:55', checkOut: '18:05', workMinutes: 550, note: '' },
  { date: '2026-03-10', checkIn: '09:00', checkOut: '18:00', workMinutes: 540, note: '' },
  { date: '2026-03-07', checkIn: '09:10', checkOut: '18:15', workMinutes: 545, note: '' },
  { date: '2026-03-06', checkIn: '09:02', checkOut: '18:00', workMinutes: 538, note: '' },
];

function formatWorkTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}m`;
}

export default function StaffDetailPage({ params }: StaffDetailPageProps) {
  const { id } = React.use(params);
  const router = useRouter();

  React.useEffect(() => {
    document.title = 'スタッフ詳細 - Dispatch Harmony Hub';
  }, []);
  const { toast } = useToast();

  const [sfid, setSfid] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastNameKana, setLastNameKana] = useState<string>('');
  const [firstNameKana, setFirstNameKana] = useState<string>('');
  const [areaDivision, setAreaDivision] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [mobileEmail, setMobileEmail] = useState<string>('');
  const [pcEmail, setPcEmail] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [carType, setCarType] = useState<string>('');
  const [carColor, setCarColor] = useState<string>('');
  const [carCapacity, setCarCapacity] = useState<string>('');
  const [carNumber, setCarNumber] = useState<string>('');
  const [bathTowel, setBathTowel] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // 追加フィールド: 生年月日・入社日
  const [dateOfBirth, setDateOfBirth] = useState<string>('1985-04-15');
  const [hireDate, setHireDate] = useState<string>('2020-04-01');

  // 緊急連絡先
  const [emergencyName, setEmergencyName] = useState<string>('山田 花子');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('配偶者');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('090-1234-5678');

  // 銀行口座情報
  const [bankName, setBankName] = useState<string>('三菱UFJ銀行');
  const [bankBranch, setBankBranch] = useState<string>('新宿支店');
  const [bankAccountType, setBankAccountType] = useState<string>('普通');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('1234567');
  const [bankAccountHolder, setBankAccountHolder] = useState<string>('ヤマダ タロウ');

  // 資格・免許
  const [qualifications, setQualifications] = useState<string>(
    '普通自動車免許, 大型自動車免許, フォークリフト運転技能講習修了証'
  );

  const [employmentStatus, setEmploymentStatus] = useState<'active' | 'inactive'>('active');
  const [employmentDate, setEmploymentDate] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<'employee' | 'part_time' | 'outsourced'>('employee');
  const [jobDriver, setJobDriver] = useState<boolean>(false);
  const [jobOffice, setJobOffice] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [etcEnabled, setEtcEnabled] = useState<boolean>(false);
  const [device, setDevice] = useState<'mobile' | 'iphone' | 'pc'>('mobile');
  const [hostessContactAllowed, setHostessContactAllowed] = useState<'yes' | 'no'>('yes');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [assignedCasts, setAssignedCasts] = useState<{ id: string; name: string }[]>([]);

  const [schedule, setSchedule] = useState<BasicSchedule>({
    mon: { work: true,  start: '09:00', end: '18:00' },
    tue: { work: true,  start: '09:00', end: '18:00' },
    wed: { work: true,  start: '09:00', end: '18:00' },
    thu: { work: true,  start: '09:00', end: '18:00' },
    fri: { work: true,  start: '09:00', end: '18:00' },
    sat: { work: false, start: '09:00', end: '18:00' },
    sun: { work: false, start: '09:00', end: '18:00' },
  });

  // APIから詳細を取得し各フィールドに流し込む
  React.useEffect(() => {
    const DayScheduleSchema = z.object({
      work: z.boolean(),
      start: z.string(), // HH:MM
      end: z.string(),   // HH:MM
    });
    const ResponseSchema = z.object({
      employmentStatus: z.enum(['active', '']).optional().default(''),
      employmentDate: z.string().optional().default(''),
      employmentType: z.enum(['employee', 'part_time']).optional().default('employee'),
      jobDriver: z.boolean().optional().default(false),
      jobOffice: z.boolean().optional().default(false),
      role: z.enum([
        'chairman','advisor','president','general_manager','manager',
        'admin_manager','office_manager','female_manager','office_staff','pr'
      ]).optional().default('office_staff'),
      etcEnabled: z.boolean().optional().default(false),
      vehicleId: z.string().nullable().optional(),
      sfid: z.string().optional().default(''),
      lastName: z.string().optional().default(''),
      firstName: z.string().optional().default(''),
      lastNameKana: z.string().nullable().optional(),
      firstNameKana: z.string().nullable().optional(),
      areaDivision: z.string().nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      mobileEmail: z.string().nullable().optional(),
      pcEmail: z.string().nullable().optional(),
      bathTowel: z.number().nullable().optional(),
      equipment: z.number().nullable().optional(),
      remarks: z.string().nullable().optional(),
      car: z.object({
        carType: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
        capacity: z.number().nullable().optional(),
        area: z.string().nullable().optional(),
        character: z.string().nullable().optional(),
        number: z.number().nullable().optional(),
      }).nullable().optional(),
      schedule: z.record(DayScheduleSchema).optional().default({}),
      assignedCasts: z.array(z.object({
        id: z.string(),
        name: z.string(),
      })).optional().default([]),
    });

    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/staff/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`failed: ${res.status}`);
        const json = await res.json();
        // remarksフィールドが存在しない場合はnullを設定（omitemptyでJSONに含まれない場合の対応）
        if (json.remarks === undefined) {
          json.remarks = null;
        }
        const data = ResponseSchema.parse(json);

        setEmploymentStatus(data.employmentStatus === 'active' ? 'active' : 'inactive');
        setEmploymentDate(data.employmentDate ?? '');
        setEmploymentType(data.employmentType as 'employee' | 'part_time' | 'outsourced');
        setJobDriver(Boolean(data.jobDriver));
        setJobOffice(Boolean(data.jobOffice));
        setRole(data.role);
        setEtcEnabled(Boolean(data.etcEnabled));
        setVehicleId(data.vehicleId ?? '');
        setSfid(data.sfid);
        setLastName(data.lastName);
        setFirstName(data.firstName);
        setLastNameKana(data.lastNameKana ?? '');
        setFirstNameKana(data.firstNameKana ?? '');
        setAreaDivision(data.areaDivision ?? '');
        setPhoneNumber(data.phoneNumber ?? '');
        setMobileEmail(data.mobileEmail ?? '');
        setPcEmail(data.pcEmail ?? '');
        setBathTowel(data.bathTowel != null ? String(data.bathTowel) : '');
        setEquipment(data.equipment != null ? String(data.equipment) : '');
        setRemarks(data.remarks ?? '');
        if (data.car) {
          setCarType(data.car.carType ?? '');
          setCarColor(data.car.color ?? '');
          setCarCapacity(data.car.capacity != null ? String(data.car.capacity) : '');
          const plate = [data.car.area ?? '', data.car.character ?? '', data.car.number != null ? String(data.car.number) : '']
            .filter(Boolean).join(' ');
          setCarNumber(plate);
        } else {
          setCarType('');
          setCarColor('');
          setCarCapacity('');
          setCarNumber('');
        }

        setAssignedCasts(data.assignedCasts ?? []);

        const applySchedule: BasicSchedule = {
          mon: { work: false, start: '09:00', end: '18:00' },
          tue: { work: false, start: '09:00', end: '18:00' },
          wed: { work: false, start: '09:00', end: '18:00' },
          thu: { work: false, start: '09:00', end: '18:00' },
          fri: { work: false, start: '09:00', end: '18:00' },
          sat: { work: false, start: '09:00', end: '18:00' },
          sun: { work: false, start: '09:00', end: '18:00' },
        };
        (Object.keys(applySchedule) as Day[]).forEach((d) => {
          const s = data.schedule[d];
          if (s) {
            applySchedule[d] = { work: s.work, start: s.start, end: s.end };
          }
        });
        setSchedule(applySchedule);
      } catch {
        // UI_002: 取得失敗時は初期値のまま
      }
    };
    fetchDetail();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        sfid,
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        areaDivision,
        employmentStatus: employmentStatus === 'active' ? 'active' : '',
        employmentDate,
        employmentType: employmentType === 'outsourced' ? 'employee' : employmentType,
        jobDriver,
        jobOffice,
        role,
        phoneNumber,
        mobileEmail,
        pcEmail,
        vehicleId: vehicleId ?? '',
        remarks: remarks.trim() !== '' ? remarks : null,
        schedule: {
          mon: schedule.mon,
          tue: schedule.tue,
          wed: schedule.wed,
          thu: schedule.thu,
          fri: schedule.fri,
          sat: schedule.sat,
          sun: schedule.sun,
        },
      };
      if (bathTowel.trim() !== '') {
        const n = Number(bathTowel);
        if (!Number.isNaN(n)) payload.bathTowel = n;
      }
      if (equipment.trim() !== '') {
        const n = Number(equipment);
        if (!Number.isNaN(n)) payload.equipment = n;
      }
      const car: Record<string, unknown> = {};
      if (carType) car.carType = carType;
      if (carColor) car.color = carColor;
      if (carCapacity) {
        const n = Number(carCapacity);
        if (!Number.isNaN(n)) car.capacity = n;
      }
      car.isETC = etcEnabled;
      if (Object.keys(car).length > 0) payload.car = car;

      const res = await fetch(`http://localhost:8080/api/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast({ title: '保存エラー', description: `保存に失敗しました（${res.status}）`, variant: 'destructive' });
        return;
      }
      toast({ title: '保存しました', description: 'スタッフ情報を更新しました。' });
      // 保存後に最新データを再取得
      window.location.reload();
    } catch {
      toast({ title: '保存エラー', description: '通信に失敗しました。', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const dayLabels: Record<Day, string> = {
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
  };

  const handleScheduleChange = (day: Day, field: 'work' | 'start' | 'end', value: boolean | string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value as never,
      },
    }));
  };

  // 週間出勤予定（UIのみ）
  type WeeklyDayPlan = { work: boolean; start: string; end: string };
  type WeeklyPlan = Record<Day, WeeklyDayPlan>;
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({
    mon: { work: false, start: '00:00', end: '00:00' },
    tue: { work: false, start: '00:00', end: '00:00' },
    wed: { work: false, start: '00:00', end: '00:00' },
    thu: { work: false, start: '00:00', end: '00:00' },
    fri: { work: false, start: '00:00', end: '00:00' },
    sat: { work: false, start: '00:00', end: '00:00' },
    sun: { work: false, start: '00:00', end: '00:00' },
  });

  const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];
  const orderedDays: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const getStartOfWeek = (base: Date, offset: number) => {
    const d = new Date(base);
    const day = d.getDay(); // 0-6 (日-土)
    const diffToMonday = (day + 6) % 7; // 月始まり
    d.setDate(d.getDate() - diffToMonday + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const pad2 = (n: number) => n.toString().padStart(2, '0');
  const formatDateLabel = (date: Date) => {
    return `${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}(${WEEKDAY_JA[date.getDay()]})`;
  };

  const startOfWeek = getStartOfWeek(new Date(), weekOffset);
  const weekDates: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const handleWeeklyChange = (day: Day, field: 'work' | 'start' | 'end', value: boolean | string) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value as never,
      },
    }));
  };

  // 出勤データ集計
  const totalWorkDays = SAMPLE_ATTENDANCE.length;
  const totalWorkMinutes = SAMPLE_ATTENDANCE.reduce((sum, r) => sum + r.workMinutes, 0);
  const avgWorkMinutes = Math.round(totalWorkMinutes / totalWorkDays);

  // 資格・免許をカンマ区切りで配列化して表示
  const qualificationList = qualifications
    .split(',')
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">スタッフ詳細</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>閉じる</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? '保存中...' : '保存'}</Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">基本情報</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">SFID</Label>
                <Input className="col-span-4" placeholder="例: 687" value={sfid} onChange={(e) => setSfid(e.target.value)} />
                <Label className="col-span-2 text-xs">表示順</Label>
                <Input className="col-span-4" placeholder="例: 1" />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">姓</Label>
                <Input className="col-span-4" placeholder="例: 山田" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <Label className="col-span-2 text-xs">名</Label>
                <Input className="col-span-4" placeholder="例: 太郎" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">姓かな</Label>
                <Input className="col-span-4" placeholder="例: やまだ" value={lastNameKana} onChange={(e) => setLastNameKana(e.target.value)} />
                <Label className="col-span-2 text-xs">名かな</Label>
                <Input className="col-span-4" placeholder="例: たろう" value={firstNameKana} onChange={(e) => setFirstNameKana(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">生年月日</Label>
                <Input
                  className="col-span-4"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <Label className="col-span-2 text-xs">入社日</Label>
                <Input
                  className="col-span-4"
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">所属店舗ID</Label>
                <Input className="col-span-4" placeholder="店舗ID" />
                <Label className="col-span-2 text-xs">地域区分</Label>
                <Input className="col-span-4" placeholder="地域区分" value={areaDivision} onChange={(e) => setAreaDivision(e.target.value)} />
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">バスタオル持出基礎</Label>
                <Input className="col-span-4" type="number" placeholder="例: 1" value={bathTowel} onChange={(e) => setBathTowel(e.target.value)} />
                <Label className="col-span-2 text-xs">備品持出基礎</Label>
                <Input className="col-span-4" type="number" placeholder="例: 1" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">在職</Label>
                <div className="col-span-10">
                  <RadioGroup
                    className="flex gap-4"
                    value={employmentStatus}
                    onValueChange={(v) => setEmploymentStatus(v as 'active' | 'inactive')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="status-active" value="active" />
                      <Label htmlFor="status-active" className="text-xs">在職</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="status-inactive" value="inactive" />
                      <Label htmlFor="status-inactive" className="text-xs">退職</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">就労日</Label>
                <Input
                  className="col-span-4"
                  type="date"
                  value={employmentDate}
                  onChange={(e) => setEmploymentDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">退職日</Label>
                <Input className="col-span-4" type="date" />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">雇用区分</Label>
                <div className="col-span-4">
                  <RadioGroup
                    className="flex gap-4"
                    value={employmentType}
                    onValueChange={(v) => setEmploymentType(v as 'employee' | 'part_time' | 'outsourced')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="emp-employee" value="employee" />
                      <Label htmlFor="emp-employee" className="text-xs">{EMPLOYMENT_TYPE_LABELS.employee}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="emp-parttime" value="part_time" />
                      <Label htmlFor="emp-parttime" className="text-xs">{EMPLOYMENT_TYPE_LABELS.part_time}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="emp-outsourced" value="outsourced" />
                      <Label htmlFor="emp-outsourced" className="text-xs">外部</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Label className="col-span-2 text-xs">役職</Label>
                <div className="col-span-4">
                  <Select value={role} onValueChange={(v) => setRole(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label as string}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">職務</Label>
                <div className="col-span-10 flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="job-driver" checked={jobDriver} onCheckedChange={(v) => setJobDriver(Boolean(v))} />
                    <Label htmlFor="job-driver" className="text-xs">{JOB_TYPE_LABELS.driver}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="job-office" checked={jobOffice} onCheckedChange={(v) => setJobOffice(Boolean(v))} />
                    <Label htmlFor="job-office" className="text-xs">{JOB_TYPE_LABELS.office}</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">連絡先</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">携帯電話</Label>
                <Input className="col-span-4" placeholder="090-XXXX-XXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <Label className="col-span-2 text-xs">連絡機器</Label>
                <div className="col-span-4">
                  <RadioGroup className="flex gap-4" value={device} onValueChange={(v) => setDevice(v as 'mobile' | 'iphone' | 'pc')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="dev-mobile" value="mobile" />
                      <Label htmlFor="dev-mobile" className="text-xs">携帯</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="dev-iphone" value="iphone" />
                      <Label htmlFor="dev-iphone" className="text-xs">iPhone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="dev-pc" value="pc" />
                      <Label htmlFor="dev-pc" className="text-xs">PC</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">携帯メール</Label>
                <Input className="col-span-4" placeholder="mobile@example.com" value={mobileEmail} onChange={(e) => setMobileEmail(e.target.value)} />
                <Label className="col-span-2 text-xs">PCメール</Label>
                <Input className="col-span-4" placeholder="pc@example.com" value={pcEmail} onChange={(e) => setPcEmail(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">ホステス連絡</Label>
                <div className="col-span-10">
                  <RadioGroup className="flex gap-6" value={hostessContactAllowed} onValueChange={(v) => setHostessContactAllowed(v as 'yes' | 'no')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="hostess-yes" value="yes" />
                      <Label htmlFor="hostess-yes" className="text-xs">可能</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="hostess-no" value="no" />
                      <Label htmlFor="hostess-no" className="text-xs">不可</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Separator />
              <p className="text-xs font-medium text-gray-600">緊急連絡先</p>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">氏名</Label>
                <Input
                  className="col-span-4"
                  placeholder="例: 山田 花子"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
                <Label className="col-span-2 text-xs">続柄</Label>
                <Input
                  className="col-span-4"
                  placeholder="例: 配偶者"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">電話番号</Label>
                <Input
                  className="col-span-4"
                  placeholder="090-XXXX-XXXX"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">住所・車両情報</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">居住地域</Label>
                <Input className="col-span-10" placeholder="例: 東京都〇〇区" value={areaDivision} onChange={(e) => setAreaDivision(e.target.value)} />
              </div>

              <Separator />

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">車種</Label>
                <Input className="col-span-4" placeholder="例: セダン" value={carType} onChange={(e) => setCarType(e.target.value)} />
                <Label className="col-span-2 text-xs">色</Label>
                <Input className="col-span-4" placeholder="例: 白" value={carColor} onChange={(e) => setCarColor(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">車名</Label>
                <Input className="col-span-4" placeholder="例: カローラ" />
                <Label className="col-span-2 text-xs">定員</Label>
                <Input className="col-span-4" placeholder="例: 5" value={carCapacity} onChange={(e) => setCarCapacity(e.target.value)} />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">車ナンバー</Label>
                <Input className="col-span-4" placeholder="例: 品川 300 あ 12-34" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />
                <Label className="col-span-2 text-xs">ETC</Label>
                <div className="col-span-4">
                  <RadioGroup
                    className="flex gap-6"
                    value={etcEnabled ? 'yes' : 'no'}
                    onValueChange={(v) => setEtcEnabled(v === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="etc-yes" value="yes" />
                      <Label htmlFor="etc-yes" className="text-xs">有</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="etc-no" value="no" />
                      <Label htmlFor="etc-no" className="text-xs">無</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">銀行口座情報</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">銀行名</Label>
                <Input
                  className="col-span-4"
                  placeholder="例: 三菱UFJ銀行"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <Label className="col-span-2 text-xs">支店名</Label>
                <Input
                  className="col-span-4"
                  placeholder="例: 新宿支店"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">口座種別</Label>
                <div className="col-span-4">
                  <RadioGroup
                    className="flex gap-4"
                    value={bankAccountType}
                    onValueChange={(v) => setBankAccountType(v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="bank-futsu" value="普通" />
                      <Label htmlFor="bank-futsu" className="text-xs">普通</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="bank-toza" value="当座" />
                      <Label htmlFor="bank-toza" className="text-xs">当座</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Label className="col-span-2 text-xs">口座番号</Label>
                <Input
                  className="col-span-4"
                  placeholder="例: 1234567"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <Label className="col-span-2 text-xs">口座名義</Label>
                <Input
                  className="col-span-10"
                  placeholder="例: ヤマダ タロウ（カタカナ）"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">資格・免許</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {qualificationList.map((q, i) => (
                  <Badge key={i} variant="secondary">{q}</Badge>
                ))}
              </div>
              <Textarea
                rows={2}
                placeholder="資格・免許をカンマ区切りで入力（例: 普通自動車免許, 大型自動車免許）"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">備考</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                placeholder="備考を入力"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">担当キャスト</h2>
            </CardHeader>
            <CardContent>
              {assignedCasts.length === 0 ? (
                <p className="text-xs text-gray-400">担当キャストなし</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {assignedCasts.map((cast) => (
                    <Link
                      key={cast.id}
                      href={`/hostess-ledger?id=${cast.id}`}
                      className="text-blue-600 underline hover:text-blue-800 cursor-pointer text-sm"
                    >
                      {cast.name}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h2 className="font-semibold">写真</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="w-full aspect-[4/5] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                写真プレビュー
              </div>
              <Button variant="outline" className="w-full">写真挿入</Button>
              <Separator />
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-600">
                サムネイル
              </div>
              <Button variant="outline" className="w-full">写真挿入</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">基本スケジュール</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {Object.entries(dayLabels).map(([k, v]) => (
                      <th key={k} className="border border-gray-300 px-2 py-2">{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {(Object.keys(dayLabels) as Day[]).map((day) => (
                      <td key={day} className="border border-gray-300 px-2 py-2 align-top">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox
                            id={`${day}-work`}
                            checked={schedule[day].work}
                            onCheckedChange={(v) => handleScheduleChange(day, 'work', Boolean(v))}
                          />
                          <Label htmlFor={`${day}-work`} className="text-xs">出勤</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="time"
                            value={schedule[day].start}
                            onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                            className="h-8"
                          />
                          <span className="px-1">〜</span>
                          <Input
                            type="time"
                            value={schedule[day].end}
                            onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">週間出勤予定</h2>
              <Button>基本スケジュールで週間予定を作成</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>今週</Button>
              <Button variant="outline" size="sm" onClick={() => setWeekOffset((v) => v - 1)}>前週</Button>
              <Button variant="outline" size="sm" onClick={() => setWeekOffset((v) => v + 1)}>翌週</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    {weekDates.map((d, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-300 px-2 py-2 bg-emerald-200 text-gray-900"
                      >
                        {formatDateLabel(d)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-emerald-100">
                    {orderedDays.map((day) => (
                      <td key={day} className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`weekly-${day}-work`}
                            checked={weeklyPlan[day].work}
                            onCheckedChange={(v) => handleWeeklyChange(day, 'work', Boolean(v))}
                          />
                          <Label htmlFor={`weekly-${day}-work`} className="text-xs">出勤</Label>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {orderedDays.map((day) => (
                      <td key={day} className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center gap-1">
                          <Input
                            type="time"
                            value={weeklyPlan[day].start}
                            onChange={(e) => handleWeeklyChange(day, 'start', e.target.value)}
                            className="h-8"
                          />
                          <span className="px-1">〜</span>
                          <Input
                            type="time"
                            value={weeklyPlan[day].end}
                            onChange={(e) => handleWeeklyChange(day, 'end', e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {orderedDays.map((day) => (
                      <td key={day} className="border border-gray-300 px-2 py-2">
                        <Button variant="outline" size="sm" className="w-full">データ表示</Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 出勤データ (#53) */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">出勤データ（過去30日）</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* サマリー */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border bg-white p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">出勤日数</p>
                <p className="text-2xl font-bold">{totalWorkDays}<span className="text-sm font-normal ml-1">日</span></p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">総勤務時間</p>
                <p className="text-2xl font-bold">{formatWorkTime(totalWorkMinutes)}</p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">平均勤務時間</p>
                <p className="text-2xl font-bold">{formatWorkTime(avgWorkMinutes)}</p>
              </div>
            </div>

            {/* 出勤記録テーブル */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold">日付</TableHead>
                    <TableHead className="text-xs font-semibold">出勤時間</TableHead>
                    <TableHead className="text-xs font-semibold">退勤時間</TableHead>
                    <TableHead className="text-xs font-semibold">勤務時間</TableHead>
                    <TableHead className="text-xs font-semibold">備考</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ATTENDANCE.map((record) => (
                    <TableRow key={record.date}>
                      <TableCell className="text-xs">{record.date}</TableCell>
                      <TableCell className="text-xs">{record.checkIn}</TableCell>
                      <TableCell className="text-xs">{record.checkOut}</TableCell>
                      <TableCell className="text-xs">{formatWorkTime(record.workMinutes)}</TableCell>
                      <TableCell className="text-xs">
                        {record.note ? (
                          <Badge variant="outline" className="text-xs">{record.note}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
