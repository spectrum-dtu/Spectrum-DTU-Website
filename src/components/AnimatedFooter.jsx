
import { useEffect, useRef, useState } from "react";
import "./AnimatedFooter.css";

export default function AnimatedFooter() {
  const sceneRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (sceneRef.current) observer.observe(sceneRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sceneRef}
      className={`antenna-landscape ${visible ? "is-visible" : ""}`}
    >
      <div className="antenna-image" />
    </section>
  );
}
