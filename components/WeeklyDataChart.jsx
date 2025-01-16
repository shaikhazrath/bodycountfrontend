'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import supabase from '@/lib/supabase';
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export default function NutritionTracker({selectedNutrient}) {
  const [weekData, setweekData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const chechAuth = async () => {
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
    chechAuth();
  }, []);

  async function getUserWeeklyMeals() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

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

      const getDateString = (date) => date.toISOString().split('T')[0];

      const weekData = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() - i);
        const dateString = getDateString(currentDate);

        weekData.push({
          date: dateString,
          Calories: 0,
          Protein: 0,
          Fats: 0,
          Carbs: 0,
        });
      }

      data.forEach(meal => {
        const mealDate = getDateString(new Date(meal.created_at));
        const dayIndex = weekData.findIndex(item => item.date === mealDate);
        if (dayIndex !== -1) {
          weekData[dayIndex].Calories += meal.Calories || 0;
          weekData[dayIndex].Protein += meal.Protein || 0;
          weekData[dayIndex].Fats += meal.Fats || 0;
          weekData[dayIndex].Carbs += meal.Carbs || 0;
        }
      });

      setweekData(weekData);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserWeeklyMeals();
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

  const nutrientData = weekData?.map((data) => data[selectedNutrient]);

  const barChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: selectedNutrient,
        data: nutrientData,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-6 text-black">
      <main>
    

        <Card className="p-6 border mt-6">
          <h3 className="font-semibold mb-4">{`${selectedNutrient} Overview `}</h3>
          <Bar data={barChartData} />
        </Card>
      </main>
    </div>
  );
}
