export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border p-4 shadow-sm bg-white ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-2">{children}</div>
);
