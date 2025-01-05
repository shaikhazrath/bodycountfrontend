import React from 'react'

interface NutritionCardProps {
  title: string
  value: number
  unit: string
  color: string
}

const NutritionCard: React.FC<NutritionCardProps> = ({ title, value, unit, color }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center">
      <h3 className={`text-lg font-semibold mb-2 ${color}`}>{title}</h3>
      <p className="text-3xl font-bold">
        {value.toFixed(1)}
        <span className="text-lg ml-1 text-gray-400">{unit}</span>
      </p>
    </div>
  )
}

export default NutritionCard

