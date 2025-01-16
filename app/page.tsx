'use client'
import React, { useState } from 'react';
import {
  Camera,
  Brain,
  ListChecks,
  TrendingUp,
  BarChart,
  Timer,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed w-full bg-black/80 backdrop-blur-lg z-50 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">BodyCount</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-zinc-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#benefits" className="text-zinc-400 hover:text-white transition-colors">Benefits</a>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 bg-black border-b border-zinc-800 px-4 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
                <a href="#testimonials" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                <a href="#benefits" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Benefits</a>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors w-full" onClick={()=>router.push('/app')}>
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-black pt-16" id="hero">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Snap, Track, Thrive: Your Food's Story in Seconds
              </h1>
              <p className="text-xl text-zinc-400 mb-8">
                Simply upload a food photo and instantly get detailed nutrition facts powered by AI
              </p>
              <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl" onClick={()=>router.push('/app')}>
               Use for Free
              </button>
            </div>
            <div className="">
              <img
                src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800"
                alt="Food photography with nutrition overlay"
                className="rounded-2xl shadow-2xl h-auto md:h-screen"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-zinc-900" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-white">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Timer className="w-8 h-8 text-purple-500" />,
                title: "Instant Analysis",
                description: "Get calories, protein, fats, and carbs in seconds"
              },
              {
                icon: <Brain className="w-8 h-8 text-purple-500" />,
                title: "Smart Recognition",
                description: "Works with home-cooked meals, restaurant dishes, and packaged foods"
              },
              {
                icon: <ListChecks className="w-8 h-8 text-purple-500" />,
                title: "Detailed Breakdown",
                description: "Complete nutritional profile including vitamins and minerals"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                title: "Progress Tracking",
                description: "Monitor your daily nutrition goals effortlessly"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-white">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8 text-purple-500" />,
                title: "Snap a Photo",
                description: "Take a picture of your meal or upload from gallery"
              },
              {
                icon: <Sparkles className="w-8 h-8 text-purple-500" />,
                title: "AI Analysis",
                description: "Our AI analyzes your food instantly"
              },
              {
                icon: <BarChart className="w-8 h-8 text-purple-500" />,
                title: "Get Results",
                description: "View detailed nutrition breakdown"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                title: "Track Progress",
                description: "Monitor your daily nutrition journey"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-zinc-800">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-zinc-900" id="testimonials">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-white">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Sarah Johnson",
                role: "Fitness Enthusiast",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
                quote: "Bodycount has completely transformed how I track my nutrition. It's like having a nutritionist in my pocket!"
              },
              {
                name: "Michael Chen",
                role: "Health Coach",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
                quote: "I recommend Bodycount to all my clients. It's accurate, easy to use, and makes nutrition tracking effortless."
              },
              {
                name: "Emma Williams",
                role: "Busy Professional",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
                quote: "Finally, a nutrition app that actually works! No more guessing what's in my food."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-black p-6 rounded-xl shadow-lg border border-zinc-800">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <p className="text-zinc-400 italic mb-4">"{testimonial.quote}"</p>
                <h4 className="font-semibold text-white">{testimonial.name}</h4>
                <p className="text-sm text-zinc-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-white mb-4">Trusted by over 100,000 users worldwide</p>
            <div className="flex justify-center gap-8">
              <Award className="w-12 h-12 text-purple-500" />
              <Users className="w-12 h-12 text-purple-500" />
              <Award className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>
      </section> */}

      {/* Benefits */}
      <section className="py-20 bg-black" id="benefits">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-white">Why Choose Bodycount</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Make informed food choices",
              "Save time on manual tracking",
              "Understand your eating habits",
              "Achieve your health goals"
            ].map((benefit, index) => (
              <div key={index} className="bg-zinc-900 p-6 rounded-xl shadow-lg text-center border border-zinc-800">
                <p className="text-lg font-semibold text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-white">Ready to Transform Your Nutrition Journey?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-900 transition-colors flex items-center justify-center" onClick={()=>router.push('/app')}>
             use for free<ArrowRight className="ml-2 w-5 h-5" />
            </button>
         
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Camera className="w-8 h-8 mr-2 text-purple-500" />
              <span className="text-xl font-bold">Bodycount</span>
            </div>
            <p className="text-zinc-400">© 2024 Bodycount. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;