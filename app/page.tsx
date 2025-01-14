'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ChevronRight, Gauge, Leaf, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Tracker from '@/components/Tracker'
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-6"
            >
              <h1 className="text-5xl font-bold leading-tight">
                Instant Food Analysis
                <span className="text-primary block">Powered by AI</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Get detailed nutritional insights from any food photo in seconds. Calories, macros, and more with just a snap.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="text-lg" onClick={()=>router.push('/app')} >
                  Try Now Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  alt="Food Analysis Demo"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -right-0.5 -bottom-4 bg-white p-6 rounded-lg shadow-lg">
                  <div className="space-y-2">
                    <div className="font-medium">Nutritional Analysis</div>
                    <div className="text-sm text-muted-foreground">Calories: 320</div>
                    <div className="text-sm text-muted-foreground">Protein: 12g</div>
                    <div className="text-sm text-muted-foreground">Carbs: 42g</div>
                    <div className="text-sm text-muted-foreground">Fat: 14g</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our AI Food Analysis</h2>
            <p className="text-muted-foreground">Advanced technology meets nutritional expertise</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Instant Analysis"
              description="Get detailed nutritional information in under 2 seconds"
            />
            <FeatureCard
              icon={<Gauge className="h-8 w-8" />}
              title="90% Accuracy"
              description="AI-powered recognition trained on millions of food images"
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="Comprehensive Data"
              description="Complete macro and micronutrient breakdown"
            />
          </div>
        </div>
      </section>
      <Tracker/>

      {/* How It Works */}
      <section className="py-5 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<Camera className="h-6 w-6" />}
              title="Take a Photo"
              description="Snap a picture of any food or meal"
            />
            <StepCard
              number="2"
              icon={<Zap className="h-6 w-6" />}
              title="AI Analysis"
              description="Our AI instantly processes the image"
            />
            <StepCard
              number="3"
              icon={<Smartphone className="h-6 w-6" />}
              title="Get Results"
              description="View detailed nutritional breakdown"
            />
          </div>
        </div>
      </section>
      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground">Join our growing community of health-conscious users</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This app has completely changed how I track my nutrition. It's so fast and accurate!"
              author="Sarah M."
              role="Fitness Coach"
            />
            <TestimonialCard
              quote="The detailed breakdown of nutrients helps me make better food choices every day."
              author="James K."
              role="Professional Athlete"
            />
            <TestimonialCard
              quote="As a nutritionist, I recommend this app to all my clients. It's simply revolutionary."
              author="Dr. Emily Chen"
              role="Nutritionist"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Health Journey Today</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users making better nutritional choices</p>
          <Button size="lg" variant="secondary" className="text-lg">
            Get Started Free
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function StepCard({ number, icon, title, description }) {
  return (
    <Card className="p-6 relative">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <Card className="p-6">
      <p className="mb-4 text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
    </Card>
  );
}