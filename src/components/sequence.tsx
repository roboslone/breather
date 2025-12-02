import React from "react";

interface P {
  values: React.ReactNode[];
}

export const Sequence: React.FC<P> = ({ values }) => (
  <div className="flex items-center gap-1">
    {values.map((v, idx) => (
      <React.Fragment key={idx}>
        {v}
        {idx !== values.length - 1 && <span className="opacity-50">/</span>}
      </React.Fragment>
    ))}
  </div>
);
