import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 1600,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic for realistic deceleration
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setValue(easeOutProgress * end);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  const formattedValue = decimals > 0 
    ? value.toFixed(decimals) 
    : Math.floor(value).toLocaleString();

  return (
    <span ref={elementRef} className="tabular-nums font-extrabold">
      {prefix}{formattedValue}{suffix}
    </span>
  );
};
