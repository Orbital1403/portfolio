// Probe colors from the Live readings chart.
export const thLiveGreen = '#2f6650'
export const thpLiveBlue = '#6e91c4'

// Positions are the centres of the two existing callouts on the 1600 × 1200 lawn photograph.
export const growProbes = [
  {
    icon: 'probe-th',
    label: 'TH · Probe 01',
    address: '03',
    channels: 'Moisture + temperature',
    x: 727,
    y: 804,
    ink: thLiveGreen,
  },
  {
    icon: 'probe-thp',
    label: 'THP · Probe 02',
    address: '02',
    channels: 'Moisture + temperature + pH',
    x: 1008,
    y: 568,
    ink: thpLiveBlue,
  },
] as const
