'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Goals {
  Calories: number
  Fats: number
  Protein: number
  Carbs: number
}

interface UserData {
  weight: number
  height: number
  goalWeight: number
}

const DEFAULT_GOALS: Goals = {
  Calories: 0,
  Fats: 0,
  Protein: 0,
  Carbs: 0,
}

const GoalsPage = () => {
  const router = useRouter()
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS)
  const [userData, setUserData] = useState<UserData>({
    weight: 60,
    height: 5.6,
    goalWeight: 80,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkExistingUser()
  }, [])

  const checkExistingUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq("user", user.id)
      
        console.log(data)

      if (error) throw error
      if (data.length !== 0) {
        router.push('/app')
      }
    } catch (error) {
      // setError('Error checking user status')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserData
  ) => {
    const value = parseFloat(e.target.value) || 0
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleGoalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Goals
  ) => {
    const value = parseFloat(e.target.value) || 0
    setGoals(prev => ({ ...prev, [field]: value }))
  }

  const calculateGoals = async () => {
    setError(null)
    setCalculating(true)
    try {
      const { data, error } = await supabase.functions.invoke('findgoals', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      console.log(data)
      if (error) throw error

      const parsedGoals = JSON.parse(data)
      if (parsedGoals.Calories === 0) {
        calculateGoals()
      }

      setGoals({
        Calories: parseFloat(parsedGoals.Calories),
        Carbs: parseFloat(parsedGoals.Carbs),
        Protein: parseFloat(parsedGoals.Protein),
        Fats: parseFloat(parsedGoals.Fats),
      })
    } catch (error) {
      setError('Failed to calculate goals')
      console.error(error)
    } finally {
      setCalculating(false)
    }
  }

  const saveGoals = async () => {
    setError(null)
    setSaving(true)
    try {
      // Get the authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        throw new Error('User not authenticated. Please log in.')
      }
  
      const userId = authData.user.id
  
      // Insert data into the user_goals table
      const { data, error } = await supabase.from('user_goals').insert({
        user: userId,
        ...userData,
        ...goals,
      })
  
      if (error) {
        throw new Error('Failed to save goals. Please try again.')
      }
  
      console.log('Goals saved successfully:', data)
      router.push('/app')
    } catch (error: any) {
      // Log and set error message
      console.error(error)
      setError(error.message || 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }
  const areValuesZero =
  !goals ||
  (goals.Calories === 0 &&
    goals.Carbs === 0 &&
    goals.Protein === 0 &&
    goals.Fats === 0);
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Set Your Goals</h1>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {Object.entries({
            height: 'Height (feet)',
            weight: 'Weight (kg)',
            goalWeight: 'Goal Weight (kg)',
          }).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {label}
              </label>
              <Input
                type="number"
                value={userData[key as keyof UserData]}
                onChange={(e) => handleInputChange(e, key as keyof UserData)}
                className="bg-white/10 text-white"
                min={0}
                step={key === 'height' ? 0.01 : 1}
                disabled={calculating || saving}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Nutritional Goals</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(goals).map((field) => (
              <div key={field} className="bg-white/20 p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-300">
                  {field}
                </label>
                <Input
                  type="number"
                  className="mt-1 block w-full rounded-md bg-black/50 text-white"
                  value={goals[field as keyof Goals]}
                  onChange={(e) => handleGoalChange(e, field as keyof Goals)}
                  min={0}
                  disabled={calculating || saving}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={calculateGoals}
            disabled={calculating || saving}
          >
            {calculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate with AI'
            )}
          </Button>
         
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={saveGoals}
            disabled={calculating || saving||areValuesZero}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save and Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GoalsPage