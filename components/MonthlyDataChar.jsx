'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import supabase from '@/lib/supabase';
import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

export default function MonthlyDataChar({selectedNutrient}) {
  const [monthData, setMonthData] = useState(null); 
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

  async function getUserMonthlyMeals() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Get data for the last 30 days (4 weeks)

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

      // Group meals by week
      const weekData = [[], [], [], []]; // 4 weeks

      data.forEach(meal => {
        const mealDate = new Date(meal.created_at);
        const diffInDays = Math.floor((endDate - mealDate) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffInDays / 7);

        if (weekIndex < 4) {
          weekData[weekIndex].push(meal);
        }
      });

      const monthlyData = weekData.map(weekMeals => {
        const weekNutrients = { Calories: 0, Protein: 0, Fats: 0, Carbs: 0 };
        weekMeals.forEach(meal => {
          weekNutrients.Calories += meal.Calories || 0;
          weekNutrients.Protein += meal.Protein || 0;
          weekNutrients.Fats += meal.Fats || 0;
          weekNutrients.Carbs += meal.Carbs || 0;
        });
        return weekNutrients;
      });

      setMonthData(monthlyData);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserMonthlyMeals();
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

  const nutrientData = monthData?.map((week) => week[selectedNutrient]);

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"], // Represent 4 weeks of data
    datasets: [
      {
        label: `${selectedNutrient} Growth`,
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
          <h3 className="font-semibold mb-4">{`${selectedNutrient} Growth for the Month`}</h3>
          <Line data={lineChartData} />
        </Card>
      </main>
    </div>
  );
}
