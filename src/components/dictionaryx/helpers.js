export const getRiskColorClasses = (riskLevel) => {
  const level = (riskLevel || '').toLowerCase();
  if (level.includes('high') || level.includes('severe')) {
    return {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      dot: 'bg-red-400'
    };
  }
  if (level.includes('low') || level.includes('mild')) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      dot: 'bg-emerald-400'
    };
  }
  // default to moderate
  return {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    dot: 'bg-amber-400'
  };
};

export const getAbnormalValueColor = (status) => {
  const norm = (status || '').toLowerCase();
  if (norm.includes('low')) return 'text-red-400';
  if (norm.includes('high')) return 'text-amber-400';
  return 'text-indigo-200';
};
