import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const animate = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.x}px, ${current.y}px)`;
      }

      if (
        Math.abs(target.x - current.x) > 0.5 ||
        Math.abs(target.y - current.y) > 0.5
      ) {
        frameId = requestAnimationFrame(animate);
      } else {
        frameId = null;
      }
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!frameId) frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[1] will-change-transform"
      aria-hidden="true"
    >
      <div className="cursor-glow" />
    </div>
  );
};

export default CursorGlow;
