'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import supabase from '@/lib/supabase';
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

export default function YearlyDataChart({selectedNutrient}) {
  const [yearlyData, setYearlyData] = useState(null); // Store yearly data
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const checkAuth = async () => {
    try {
      const session = await supabase.auth.getSession();
      const user = (await supabase.auth.getUser()).data.user?.id;
      if (!session || !user) {
        router.push('/auth');
      } else {
        const { data, error } = await supabase.from('user_goals').select("*").eq("user", user);
        if (data && data.length === 0) {
          router.push('/app/profile');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    checkAuth();
  }, []);

  async function getUserYearlyMeals() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const startDate = new Date();
      startDate.setMonth(0, 1); // Start of the year
      const endDate = new Date();
      endDate.setMonth(11, 31); // End of the year

      const { data, error } = await supabase
        .from('user_meals')
        .select('Calories, Carbs, Fats, Protein, created_at')
        .eq('user', user.id)
        .gte('created_at', startDate.toISOString().split('T')[0])
        .lte('created_at', endDate.toISOString().split('T')[0])
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Organize meals by month
      const monthData = Array(12).fill().map(() => ({ Calories: 0, Protein: 0, Fats: 0, Carbs: 0 }));

      data.forEach(meal => {
        const mealDate = new Date(meal.created_at);
        const monthIndex = mealDate.getMonth(); // Get the month index (0 = January, 11 = December)
        
        // Add the nutrients of the meal to the corresponding month
        monthData[monthIndex].Calories += meal.Calories || 0;
        monthData[monthIndex].Protein += meal.Protein || 0;
        monthData[monthIndex].Fats += meal.Fats || 0;
        monthData[monthIndex].Carbs += meal.Carbs || 0;
      });

      setYearlyData(monthData);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserYearlyMeals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const nutrientData = yearlyData?.map((month) => month[selectedNutrient]);

  const lineChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ], // Monthly labels
    datasets: [
      {
        label: `${selectedNutrient} Growth for the Year`,
        data: nutrientData,
        fill: true,  // To make it a filled area chart
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light background color
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.4, // To make the line curve a bit like a stock market chart
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-6 text-black">
      <main>
     

        <Card className="p-6 border mt-6">
          <h3 className="font-semibold mb-4">{`${selectedNutrient} Growth for the Year`}</h3>
          <Line data={lineChartData} />
        </Card>
      </main>
    </div>
  );
}
