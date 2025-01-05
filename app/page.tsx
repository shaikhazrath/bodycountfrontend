'use client'

import React, { useState } from 'react'
import { Upload, Camera, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import NutritionCard from '@/components/NutritionCard'
import ProgressRing from '@/components/ProgressRing'

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [quantity, setQuantity] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nutritionData, setNutritionData] = useState<{
    calories: number
    carbs: number
    protein: number
    fats: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a food image to analyze.')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('quantity', quantity?.toString() || '100')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analyze-image`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        throw new Error('Error analyzing image')
      }
      let data = await res.json()
      data = JSON.parse(data)
      setNutritionData({
        calories: parseFloat(data.Calories),
        carbs: parseFloat(data.Carbs),
        protein: parseFloat(data.Protein),
        fats: parseFloat(data.Fats),
      })
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to analyze image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setNutritionData(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">BodyCount Traker</h1>
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8">
          
        {nutritionData && (
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              Nutrition Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* <div className="flex justify-center items-center">
                <ProgressRing
                  calories={nutritionData.calories}
                  carbs={nutritionData.carbs}
                  protein={nutritionData.protein}
                  fats={nutritionData.fats}
                />
              </div> */}
              <div className="grid grid-cols-2 gap-4">
                <NutritionCard
                  title="Calories"
                  value={nutritionData.calories}
                  unit="kcal"
                  color="text-yellow-400"
                />
                <NutritionCard
                  title="Carbs"
                  value={nutritionData.carbs}
                  unit="g"
                  color="text-green-400"
                />
                <NutritionCard
                  title="Protein"
                  value={nutritionData.protein}
                  unit="g"
                  color="text-blue-400"
                />
                <NutritionCard
                  title="Fats"
                  value={nutritionData.fats}
                  unit="g"
                  color="text-red-400"
                />
              </div>
            </div>
          </div>
        )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer",
                  "transition-colors duration-200",
                  "hover:border-blue-500 hover:bg-gray-800",
                  previewUrl ? "border-blue-500" : "border-gray-600"
                )}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-300">
                      Click or drag a food image here
                    </p>
                  </div>
                )}
              </label>
            </div>
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              placeholder="Enter quantity in grams"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
              <button
                type="submit"
                disabled={isLoading || !selectedFile || !quantity}
                className={cn(
                  "w-full py-3 px-4 rounded-lg text-white font-medium",
                  "transition-colors duration-200",
                  "flex items-center justify-center space-x-2",
                  isLoading || !selectedFile ||  !quantity
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span>Analyze Food</span>
                  </>
                )}
              </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Page

