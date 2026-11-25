// Positions are the centres of the two existing callouts on the 1600 × 1200 lawn photograph.
export const growProbes = [
  {
    icon: 'probe-th',
    label: 'TH · Probe 01',
    address: '03',
    channels: 'Moisture + temperature',
    x: 727,
    y: 804,
    ink: '#25634d',
  },
  {
    icon: 'probe-thp',
    label: 'THP · Probe 02',
    address: '02',
    channels: 'Moisture + temperature + pH',
    x: 1008,
    y: 568,
    ink: '#aa4608',
  },
] as const
