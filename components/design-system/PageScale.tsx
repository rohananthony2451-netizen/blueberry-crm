interface PageScaleProps {
  children: React.ReactNode;
  scale?: number;
}

export function PageScale({
  children,
  scale = 0.9,
}: PageScaleProps) {
  return (
    <div
      style={{
        width: `${100 / scale}%`,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 * scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}