import React from "react";

const FridayLogo = ({ size = "1.5rem", color = "#E0E0E0" }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "2px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "-0.05em",
        lineHeight: 1,
        color: color,
        position: "relative",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontSize: size,
          display: "inline-block",
          transform: "scaleY(1.4)",
          transformOrigin: "bottom",
          marginRight: "4px",
        }}
      >
        FRIDAY
      </span>
      <span
        style={{
          fontSize: `calc(${size} * 0.35)`,
          fontWeight: 400,
          position: "relative",
          top: "-2px",
        }}
      >
        ®
      </span>
    </div>


  );
};

export default FridayLogo;
