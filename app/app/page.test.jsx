'use client'

import React, { useState } from 'react';
import { Upload, Camera, Loader2, X, Info, Plus, Expand } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Page = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a food image to analyze.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('quantity', quantity?.toString() || '100');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analyze-image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Error analyzing image');
      let data = await res.json();
      data = JSON.parse(data);
      setNutritionData({
        calories: parseFloat(data.Calories),
        carbs: parseFloat(data.Carbs),
        protein: parseFloat(data.Protein),
        fats: parseFloat(data.Fats),
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setNutritionData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Nutrition Analyzer
          </h1>
          <p className="mt-4 text-gray-400">
            Upload a food image to get detailed nutritional information
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200">
                Upload Food Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
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
                      "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer",
                      "transition-all duration-300",
                      "group-hover:border-blue-500 group-hover:bg-blue-500/10",
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
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="absolute top-2 left-2 bg-gray-800/80 rounded-full p-2 hover:bg-gray-700 transition-colors"
                        >
                          <Expand className="w-4 h-4 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500/80 rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Upload className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-300 font-medium">Drop your image here</p>
                        <p className="text-sm text-gray-400 mt-2">or click to browse</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    placeholder="Enter quantity in grams"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !selectedFile || !quantity}
                  className={cn(
                    "w-full py-4 px-6 rounded-lg text-white font-medium",
                    "transition-all duration-300",
                    isLoading || !selectedFile || !quantity
                      ? "bg-gray-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      <span>Analyze Food</span>
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200">
                Nutrition Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nutritionData ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Calories', value: nutritionData.calories, unit: 'kcal', color: 'from-yellow-500 to-orange-500', progress: nutritionData.calories / 20 },
                    { title: 'Carbs', value: nutritionData.carbs, unit: 'g', color: 'from-green-500 to-emerald-500', progress: nutritionData.carbs },
                    { title: 'Protein', value: nutritionData.protein, unit: 'g', color: 'from-blue-500 to-cyan-500', progress: nutritionData.protein },
                    { title: 'Fats', value: nutritionData.fats, unit: 'g', color: 'from-red-500 to-pink-500', progress: nutritionData.fats }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm 
                               border border-gray-600/30 transition-transform duration-300 
                               hover:scale-105"
                    >
                      <div className="text-sm text-gray-400 mb-1">{item.title}</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value.toFixed(1)}
                        <span className="text-base ml-1 text-gray-400">{item.unit}</span>
                      </div>
                      <Progress value={item.progress} className="mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="text-gray-400 mb-4">
                    <Info className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload a food image to see detailed nutrition information</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add to Meal Button */}
        {nutritionData && (
          <Button
            className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add to Meal Log
          </Button>
        )}

        {/* Image Modal */}
        {isModalOpen && previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-3xl w-full bg-gray-800 rounded-lg p-2">
              <img
                src={previewUrl}
                alt="Full size"
                className="w-full h-auto rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-4 right-4"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;