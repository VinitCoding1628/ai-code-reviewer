
import React, { useEffect, useState } from "react";

const ScoreGauge = ({
  score,
  size,
  strokeWidth = size * 0.089,
  animationDuration = 1100,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const fontSize = size * 0.3;
  const progress = (normalizedScore / 100) * circumference;

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Reset before animating to the latest score
    setAnimatedScore(0);
    setAnimatedProgress(0);

    const frame = requestAnimationFrame(() => {
      setAnimatedScore(normalizedScore);
      setAnimatedProgress(progress);
    });

    return () => cancelAnimationFrame(frame);
  }, [normalizedScore, progress]);

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Code quality score: ${normalizedScore} out of 100`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EDF2F7"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${score < 50 ? "#EF4444" : score < 75 ? "#F59E0B" : "#10B981"}`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - animatedProgress}
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-in-out`,
          }}
        />
      </svg>

      {/* Animated score */}
      <span
        className="absolute font-bold leading-none tabular-nums"
        style={{
          fontSize,
          fontVariantNumeric: "tabular-nums",
          transition: `opacity 200ms ease`,
        }}
      >
        {Math.round(animatedScore)}
      </span>
    </div>
  );
};

export default ScoreGauge;
