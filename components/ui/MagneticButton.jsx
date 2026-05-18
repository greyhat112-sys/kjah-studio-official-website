'use client';
import { useRef } from 'react';

export default function MagneticButton({ children, className, href, onClick }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onLeave = () => {
    ref.current.style.transform = 'translate(0,0)';
    ref.current.style.transition = 'transform 400ms cubic-bezier(0.25,0.1,0.25,1)';
  };

  const onEnter = () => {
    ref.current.style.transition = 'transform 100ms linear';
  };

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{ display: 'inline-block' }}
    >
      {children}
    </Tag>
  );
}
