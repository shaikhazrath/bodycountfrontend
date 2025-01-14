'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Delete, Settings, Trash, User } from 'lucide-react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import supabase from '@/lib/supabase'
import { useEffect, useState } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function NutritionTracker() {
    const [todayCount,setTodayCount]=useState({
        Calories:0,
        Protein:0,
        Fats:0,
        Carbs:0,
    })
    const [meals, setMeals] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [mealToDelete, setMealToDelete] = useState(null)
    const [goals,setGoals]=useState(null)

    const router = useRouter()
    const chechAuth = async () => {
        const session = await supabase.auth.getSession()
        const user = (await supabase.auth.getUser()).data.user?.id
        if (!session || !user) {
            router.push('/auth')
        }
        const {data,error} = await supabase.from('users').select("*").eq("user",user)
        if(data.length === 0){
            router.push('/app/profile')
        }else{
            const filteredData = {
                Calories: data[0].Calories || 0,
                Fats: data[0].Fats || 0,
                Protein: data[0].Protein || 0,
                Carbs: data[0].Carbs || 0,
            };
            setGoals(filteredData);
        }

        console.log(user)
    }

    useEffect(() => {
        setLoading(true)
        chechAuth()
        fetchMeals()
    },[])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const fetchMeals = async () => {
        try {
            const user = (await supabase.auth.getUser()).data.user?.id
            if (!user) {
                console.log("User not found");
                return;
            }
            const date = new Date().toISOString().split('T')[0]
            let { data: user_meals, error } = await supabase
                .from('user_meals')
                .select('*')
                .eq('user', user)
                .eq('date', date);
                const md = {
                    Calories: 0,
                    Protein: 0,
                    Fats: 0,
                    Carbs: 0,
                };
                
                user_meals.forEach((data) => {
                    md.Calories += data.Calories || 0;  
                    md.Protein += data.Protein || 0;   
                    md.Fats += data.Fats || 0;         
                    md.Carbs += data.Carbs || 0;      
                });
                
            if (error) {
                console.log("Error fetching meals:", error);
            } else {
                console.log("Today's meals:", user_meals);
                setMeals(user_meals)
                setTodayCount(md)
            }
        } catch (error) {
            console.log("Error:", error);
        } finally{
            setLoading(false)
        }
    }

    const handleDeleteMeal = async (mealId) => {
        try {
            await supabase
                .from('user_meals')
                .delete()
                .eq('id', mealId)
            setMeals(meals.filter(meal => meal.id !== mealId))
            setShowDeletePopup(false)
        } catch (error) {
            console.log("Error deleting meal:", error)
        }
    }

    if (loading) {
        return <h1>Loading..</h1>
    }

    return (
        <div className="max-w-md mx-auto p-6 min-h-screen bg-black text-white">
            <header className="mb-8 text-center">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold mb-6">Bodycount</h1>
                    <Link href='/app/profile'>
                        <Settings />
                    </Link>
                </div>
                <Tabs defaultValue="today" className="w-full">
                    <TabsList className="w-full bg-white/5 border border-white/20">
                        <TabsTrigger value="today" className="w-1/2 text-lg text-center hover:bg-white/10">Today</TabsTrigger>
                        <TabsTrigger value="history" className="w-1/2 text-lg text-center hover:bg-white/10">History</TabsTrigger>
                    </TabsList>
                </Tabs>
            </header>

            <div className="grid gap-6">
    <div className="grid grid-cols-2 gap-6">
        <Card className="p-4 bg-white/5 border border-white/20 text-white rounded-lg">
            <div className="text-sm opacity-75">Calories</div>
            <div className="text-xl font-semibold">
                {todayCount && todayCount.Calories}/{goals && goals.Calories}
            </div>
            <Progress
                value={
                    goals && todayCount?.Calories
                        ? Math.min((todayCount.Calories / goals.Calories) * 100, 100)
                        : 0
                }
                className="mt-3 bg-white/10"
                color="bg-red-400"
            />
        </Card>

        <Card className="p-4 bg-white/5 border border-white/20 text-white rounded-lg">
            <div className="text-sm opacity-75">Protein</div>
            <div className="text-xl font-semibold">
                {todayCount && todayCount.Protein}/{goals && goals.Protein}
            </div>
            <Progress
                value={
                    goals && todayCount?.Protein
                        ? Math.min((todayCount.Protein / goals.Protein) * 100, 100)
                        : 0
                }
                className="mt-3 bg-white/10"
                color="bg-green-400"
            />
        </Card>

        <Card className="p-4 bg-white/5 border border-white/20 text-white rounded-lg">
            <div className="text-sm opacity-75">Fats</div>
            <div className="text-xl font-semibold">
                {todayCount && todayCount.Fats}/{goals && goals.Fats}
            </div>
            <Progress
                value={
                    goals && todayCount?.Fats
                        ? Math.min((todayCount.Fats / goals.Fats) * 100, 100)
                        : 0
                }
                className="mt-3 bg-white/10"
                color="bg-yellow-400"
            />
        </Card>

        <Card className="p-4 bg-white/5 border border-white/20 text-white rounded-lg">
            <div className="text-sm opacity-75">Carbs</div>
            <div className="text-xl font-semibold">
                {todayCount && todayCount.Carbs}/{goals && goals.Carbs}
            </div>
            <Progress
                value={
                    goals && todayCount?.Carbs
                        ? Math.min((todayCount.Carbs / goals.Carbs) * 100, 100)
                        : 0
                }
                className="mt-3 bg-white/10"
                color="bg-blue-400"
            />
        </Card>
    </div>

    <Link
        href="/app/takephoto"
        className="w-full py-2 text-lg text-center text-black bg-white border border-white/20 rounded-lg mt-6"
    >
        Add Meal
    </Link>

    <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-white">Today's Meals</h2>
        {meals.map((meal, index) => (
            <MealCard
                key={index}
                {...meal}
                handleDeleteMeal={handleDeleteMeal}
            />
        ))}
    </div>
</div>


            {/* Delete Confirmation Popup */}

        </div>
    )
}

function MealCard({ Meal, created_at, amount, Calories, Protein, Carbs, Fats, image, quantity, onDelete, handleDeleteMeal, id }) {

    return (
        <Card className="p-4 hover:shadow-md transition-shadow bg-gray-100">
            <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                    <img src={image} alt="" className="h-16 w-16 object-cover rounded-xl" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900">{Meal}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {quantity}g
                            </p>
                        </div>
                        <Popover>
                            <PopoverTrigger className=" hover:bg-white">
                                <Button className=" bg-gray-100 hover:bg-gray-100">
                                    <Trash size={14} color="red" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-max">
                                <h1>Are you sure u want to delete</h1>
                                <Button
                                    onClick={() => handleDeleteMeal(id)}
                                    className="px-4 py-2 bg-red-600 rounded-lg text-white"
                                >
                                    Yes
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="mt-2 flex gap-3 text-xs text-gray-500">
                        <span>{Protein}g protein</span>
                        <span>{Carbs}g carbs</span>
                        <span>{Fats}g fats</span>
                        <span>{Calories}g cal</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
