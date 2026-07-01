interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}
export default function Button({
  children, variant = 'primary', loading, className = '', ...props
}: ButtonProps) {
  const base = 'px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50';
  const styles = {
    primary:   'bg-alpha-green text-white hover:bg-green-800',
    secondary: 'bg-alpha-gold text-alpha-dark hover:opacity-90',
    danger:    'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? 'Loading…' : children}
    </button>
  );
}
