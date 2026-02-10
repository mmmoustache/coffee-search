type Props = {
  children: React.ReactNode;
};

export function ProductTitle({ children }: Readonly<Props>) {
  if (!children) return;
  return (
    <div className="product-title">
      <h1 className="font-heading relative z-10">{children}</h1>
      <span
        className="font-mega uppercase leading-0 text-gray-50 opacity-10"
        aria-hidden
      >
        {children}
      </span>
    </div>
  );
}
