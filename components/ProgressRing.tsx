import React from 'react'

interface ProgressRingProps {
  calories: number
  carbs: number
  protein: number
  fats: number
}

const ProgressRing: React.FC<ProgressRingProps> = ({ calories, carbs, protein, fats }) => {
  const total = carbs + protein + fats
  const carbsPercentage = (carbs / total) * 100
  const proteinPercentage = (protein / total) * 100
  const fatsPercentage = (fats / total) * 100

  const radius = 80
  const circumference = 2 * Math.PI * radius

  const carbsOffset = circumference - (carbsPercentage / 100) * circumference
  const proteinOffset = circumference - (proteinPercentage / 100) * circumference
  const fatsOffset = circumference - (fatsPercentage / 100) * circumference

  return (
    <div className="relative w-64 h-64">
      <svg className="w-full h-full" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#4B5563"
          strokeWidth="12"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#34D399"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={carbsOffset}
          transform="rotate(-90 90 90)"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#60A5FA"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={proteinOffset}
          transform="rotate(-90 90 90)"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#F87171"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={fatsOffset}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">{calories.toFixed(0)}</p>
        <p className="text-lg text-gray-400">kcal</p>
      </div>
    </div>
  )
}

export default ProgressRing

