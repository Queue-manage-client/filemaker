import type { TransportCar } from '@/types/vehicle';

// お迎え用車両サンプルデータ（青系）
export const pickupCars: TransportCar[] = [
  {
    id: 'p1',
    name: '1号車',
    vehicleNumber: '品川 500 あ 12-34',
    driverName: '山田 太郎',
    driverPhone: '090-1234-5678',
    eta: '18:30',
    color: '#3b82f6',
    purpose: 'pickup',
  },
  {
    id: 'p2',
    name: '2号車',
    vehicleNumber: '品川 500 い 56-78',
    driverName: '田中 一郎',
    driverPhone: '090-2345-6789',
    eta: '18:45',
    color: '#06b6d4',
    purpose: 'pickup',
  },
  {
    id: 'p3',
    name: '3号車',
    vehicleNumber: '品川 500 う 90-12',
    driverName: '佐藤 次郎',
    driverPhone: '090-3456-7890',
    eta: '19:00',
    color: '#2563eb',
    purpose: 'pickup',
  },
  {
    id: 'p4',
    name: '4号車',
    vehicleNumber: '品川 500 え 34-56',
    driverName: '渡辺 三郎',
    driverPhone: '090-4567-8901',
    eta: '19:15',
    color: '#0284c7',
    purpose: 'pickup',
  },
];

// 送迎用車両サンプルデータ（緑系）
export const sendoffCars: TransportCar[] = [
  {
    id: 's1',
    name: '送迎A車',
    vehicleNumber: '品川 300 か 11-22',
    driverName: '鈴木 健一',
    driverPhone: '090-5678-9012',
    eta: '2:00',
    color: '#22c55e',
    purpose: 'sendoff',
  },
  {
    id: 's2',
    name: '送迎B車',
    vehicleNumber: '品川 300 き 33-44',
    driverName: '高橋 誠二',
    driverPhone: '090-6789-0123',
    eta: '2:15',
    color: '#10b981',
    purpose: 'sendoff',
  },
  {
    id: 's3',
    name: '送迎C車',
    vehicleNumber: '品川 300 く 55-66',
    driverName: '伊藤 幸三',
    driverPhone: '090-7890-1234',
    eta: '2:30',
    color: '#059669',
    purpose: 'sendoff',
  },
  {
    id: 's4',
    name: '送迎D車',
    vehicleNumber: '品川 300 け 77-88',
    driverName: '中村 良四',
    driverPhone: '090-8901-2345',
    eta: '2:45',
    color: '#16a34a',
    purpose: 'sendoff',
  },
];
