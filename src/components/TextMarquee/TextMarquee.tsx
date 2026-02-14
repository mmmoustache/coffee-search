import './TextMarquee.css';

type TextMarqueeProps = {
  children: React.ReactNode;
};

export function TextMarquee({ children }: TextMarqueeProps) {
  const repeats = 10;

  return (
    <div className="text-marquee | overflow-hidden whitespace-nowrap w-full opacity-10">
      <div className="text-marquee__track | inline-flex w-max will-change-transform">
        <span>
          {Array.from({ length: repeats }).map((_, i) => (
            <span
              className="text-marquee__item | font-mega uppercase items-center inline-flex"
              key={i}
            >
              {children}
              <span
                className="text-marquee__spacer | shrink-0 w-12 text-center"
                aria-hidden="true"
              >
                •
              </span>
            </span>
          ))}
        </span>

        <span aria-hidden="true">
          {Array.from({ length: repeats }).map((_, i) => (
            <span
              className="text-marquee__item | font-mega uppercase items-center inline-flex"
              key={`dup-${i}`}
            >
              {children}
              <span
                className="text-marquee__spacer | shrink-0 w-12 text-center"
                aria-hidden="true"
              >
                •
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
