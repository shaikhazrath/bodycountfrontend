'use client'
import React, { useState } from 'react';
import { Upload, Camera, Loader2, X, Info, Plus, Expand } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
const Page = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMealLoading,setAddMealLoading] = useState(false)
  const [foodname,setFoodName] = useState('')
  const router = useRouter()
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
      const  { data, error } = await supabase.functions.invoke('ai',{
        method: 'POST',
        body: formData,
      });
      const d = JSON.parse(data);
      setNutritionData({
        calories: parseFloat(d.Calories),
        carbs: parseFloat(d.Carbs),
        protein: parseFloat(d.Protein),
        fats: parseFloat(d.Fats),
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

  const handleaddmeal = async () => {
    setAddMealLoading(true);
    try {
      const meal = selectedFile;
      const randomFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${meal.name}`;
      
      const { data: image, error: err } = await supabase
        .storage
        .from('meal')
        .upload(randomFileName, meal, {
          cacheControl: '3600',
          upsert: false
        });
        const imageUrl = supabase.storage.from('meal').getPublicUrl(randomFileName)
        const image_url = imageUrl.data.publicUrl
  
      const session = await supabase.auth.getSession();
      const user = session.data.session.user.id;
  
      const { error } = await supabase.from('user_meals').insert({
        Calories: nutritionData.calories,
        Carbs: nutritionData.carbs,
        Protein: nutritionData.protein,
        Fats: nutritionData.fats,
        Meal: foodname,
        image:image_url,
        quantity,
        user
      });
  
      if (error) {
        console.log(error);
      }
      router.push('/app');
    } catch (error) {
      console.log(error);
    } finally {
      setAddMealLoading(false);
    }
  }
  

  return (
    <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <Card className="bg-black border border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
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
                    "group-hover:border-white group-hover:bg-white/5",
                    previewUrl ? "border-white/50" : "border-white/20"
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
                      {/* <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-2 left-2 bg-black/80 rounded-full p-2 hover:bg-white/20 transition-colors"
                      >
                        <Expand className="w-4 h-4 text-white" />
                      </button> */}
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Upload className="w-16 h-16 text-white/50 mb-4" />
                      <p className="text-white/80 font-medium">Drop your image here</p>
                      <p className="text-sm text-white/50 mt-2">or click to browse</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex flex-col gap-5">
              <Input
                  type="text"
                  value={foodname || ''}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Enter meal name"
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
                <Input
                  type="number"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  placeholder="Enter quantity in grams"
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
               
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedFile || !quantity}
                className={cn(
                  "w-full py-4 px-6 rounded-lg text-white font-medium",
                  "transition-all duration-300",
                  isLoading || !selectedFile || !quantity
                    ? "bg-white/10"
                    : "bg-white hover:bg-white/80 text-black"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Food</span>
                  </>
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4 bg-white/5 border-white/20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-black border border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Nutrition Analysis
            </CardTitle>
            {nutritionData &&
            <CardTitle className="text-xl font-semibold text-white">
             {foodname}
            </CardTitle>
}
          </CardHeader>
          <CardContent>
            {nutritionData ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Calories', value: nutritionData.calories, unit: 'kcal', progress: nutritionData.calories / 20 },
                  { title: 'Carbs', value: nutritionData.carbs, unit: 'g', progress: nutritionData.carbs },
                  { title: 'Protein', value: nutritionData.protein, unit: 'g', progress: nutritionData.protein },
                  { title: 'Fats', value: nutritionData.fats, unit: 'g', progress: nutritionData.fats }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 backdrop-blur-sm 
                             border border-white/10 transition-transform duration-300 
                             hover:scale-105"
                  >
                    <div className="text-sm text-white/60 mb-1">{item.title}</div>
                    <div className="text-2xl font-bold text-white">
                      {item.value.toFixed(1)}
                      <span className="text-base ml-1 text-white/60">{item.unit}</span>
                    </div>
                   
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="text-white/60">
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
  className={`w-full mt-8 ${addMealLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-white/80'} text-black focus:outline-none`}
  size="lg"
  onClick={handleaddmeal}
  disabled={addMealLoading} // Disables the button when loading
  aria-busy={addMealLoading} // Indicates if the action is in progress
  aria-label="Add to meal" // Describes the button action
>
  {!addMealLoading ? (
    <div className="flex items-center justify-center">
      <h1>Add to Meal</h1>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      <span>Processing...</span>
    </div>
  )}
</Button>


        
      )}

      {/* Image Modal */}
      {isModalOpen && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl w-full bg-black border border-white/20 rounded-lg p-2">
            <img
              src={previewUrl}
              alt="Full size"
              className="w-full h-auto rounded-lg"
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute top-4 right-4 border-white/20 hover:bg-white/10"
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