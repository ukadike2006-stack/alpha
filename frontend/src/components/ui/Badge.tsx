const colours: Record<string, string> = {
  FUNDED:             'bg-green-100 text-green-800',
  ELIGIBILITY_PASSED: 'bg-blue-100 text-blue-800',
  ELIGIBILITY_FAILED: 'bg-red-100 text-red-800',
  SHORTLISTED:        'bg-purple-100 text-purple-800',
  SUBMITTED:          'bg-yellow-100 text-yellow-800',
  REJECTED:           'bg-gray-100 text-gray-600',
  DRAFT:              'bg-gray-100 text-gray-500',
};

export default function Badge({ label }: { label: string }) {
  const cls = colours[label] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`${cls} text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {label.replace(/_/g, ' ')}
    </span>
  );
}
