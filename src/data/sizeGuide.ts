// Body measurements in inches, with the usual Indian suit/kurti size range.
export type SizeRow = { size: string; bust: string; waist: string; hip: string; length: string };

export const sizeChart: SizeRow[] = [
  { size: 'XS', bust: '32', waist: '26', hip: '34', length: '42' },
  { size: 'S', bust: '34', waist: '28', hip: '36', length: '43' },
  { size: 'M', bust: '36', waist: '30', hip: '38', length: '44' },
  { size: 'L', bust: '38', waist: '32', hip: '40', length: '45' },
  { size: 'XL', bust: '40', waist: '34', hip: '42', length: '46' },
  { size: 'XXL', bust: '42', waist: '36', hip: '44', length: '47' },
];

export const measureTips: { title: string; body: string }[] = [
  { title: 'Bust', body: 'Measure around the fullest part of your chest, keeping the tape level.' },
  { title: 'Waist', body: 'Measure around the narrowest part of your waist, above the navel.' },
  { title: 'Hip', body: 'Measure around the fullest part of your hips, about 8 inches below the waist.' },
  { title: 'Length', body: 'Measure from the high point of the shoulder down to where you want the hem.' },
];

export const fitNotes: string[] = [
  'Regular fit: sits comfortably with room to move.',
  'Between two sizes? Pick the larger one.',
  'Garment measurements include a little extra ease over the body size.',
];
