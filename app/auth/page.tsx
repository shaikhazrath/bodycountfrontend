'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import  supabase  from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const AuthPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app/onboarding',
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent mb-2">
            Bodycount Ai
          </h1>
          <p className="text-gray-400">Track your nutrition journey</p>
        </div>

        <Card className="bg-white/5 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-200">
              Welcome
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access your nutrition dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 rounded-lg py-3 px-4 font-medium
                         hover:bg-gray-100 transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* <div className="mt-6 text-center text-sm text-gray-400">
              By continuing, you agree to our{' '}
              <button className="text-blue-400 hover:text-blue-300">Terms of Service</button>{' '}
              and{' '}
              <button className="text-blue-400 hover:text-blue-300">Privacy Policy</button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AuthPage