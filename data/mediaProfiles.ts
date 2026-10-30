import { VipProfile } from '../types';

export const mediaProfilesData: VipProfile[] = [
  {
    id: 'vip_m1',
    numericId: 1001,
    name: 'Blendi Fevziu',
    imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/BF_Opinion.jfif',
    category: 'Media',
    shortBio: 'Gazetar dhe drejtues i emisionit "Opinion".',
    detailedBio: 'Blendi Fevziu është një nga figurat më jetëgjata dhe me ndikim në median shqiptare...',
    dynamicScore: 88,
    maragonAnalysis: [
      { dimension: 'Pajtueshmëria Etike', score: 85, peerAverage: 70, globalBenchmark: 80, description: '', commentary: '' },
      { dimension: 'Profesionalizmi në Kriza', score: 92, peerAverage: 75, globalBenchmark: 85, description: '', commentary: '' },
      { dimension: 'Saktësia Faktike & Verifikimi', score: 80, peerAverage: 65, globalBenchmark: 88, description: '', commentary: '' },
      { dimension: 'Paanshmëria, Balanca & Anshmëria', score: 75, peerAverage: 60, globalBenchmark: 90, description: '', commentary: '' },
      { dimension: 'Thellësia e Analizës/Pyetjeve', score: 95, peerAverage: 70, globalBenchmark: 85, description: '', commentary: '' },
      { dimension: 'Qartësia & Koherenca', score: 98, peerAverage: 75, globalBenchmark: 90, description: '', commentary: '' },
      { dimension: 'Promovimi i të Menduarit Kritik', score: 82, peerAverage: 68, globalBenchmark: 85, description: '', commentary: '' }
    ]
  }
];
