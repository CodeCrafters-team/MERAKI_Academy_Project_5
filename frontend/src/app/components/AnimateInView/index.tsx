"use client";

import { useInView } from "react-intersection-observer";

export default function AnimateInView({
  children,
  animation ,
}: {
  children: React.ReactNode;
  animation?: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.5,    
  });

  return (
    <div
      ref={ref}
      className={`animate__animated ${inView ? animation : ""}`}
      style={{ opacity: inView ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
