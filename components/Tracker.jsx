'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, ChevronRight, Gauge, Leaf, Smartphone, Zap, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';


export default function Tracker() {
  return (
      
      <section className="py-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Track Your Nutrition Journey</h2>
            <p className="text-muted-foreground">Comprehensive insights across different time periods</p>
          </div>
          
          <Tabs defaultValue="daily" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="daily">
                <Calendar className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <BarChart3 className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly">
                <TrendingUp className="h-4 w-4 mr-2" />
                Monthly
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Calories</span>
                        <span className="font-medium">2,145 kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span className="font-medium">82g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs</span>
                        <span className="font-medium">245g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat</span>
                        <span className="font-medium">95g</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Meals</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="font-medium">Breakfast - 8:30 AM</div>
                        <div className="text-muted-foreground">Oatmeal with berries - 320 kcal</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Lunch - 12:45 PM</div>
                        <div className="text-muted-foreground">Grilled chicken salad - 450 kcal</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Dinner - 7:00 PM</div>
                        <div className="text-muted-foreground">Salmon with quinoa - 580 kcal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <Card className="p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Weekly Overview</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center">
                        <div className="font-medium">{day}</div>
                        <div className="text-sm text-muted-foreground">2,145</div>
                        <div className="mt-2 h-24 bg-primary/10 rounded-t-lg relative">
                          <div 
                            className="absolute bottom-0 w-full bg-primary rounded-t-lg"
                            style={{ height: '70%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg. Daily Calories</div>
                      <div className="text-2xl font-semibold">2,145</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Best Day</div>
                      <div className="text-2xl font-semibold">Wednesday</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Goal Progress</div>
                      <div className="text-2xl font-semibold">85%</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <Card className="p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Monthly Progress</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Monthly Average</div>
                        <div className="text-2xl font-semibold">2,180 kcal/day</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Meals Tracked</div>
                        <div className="text-2xl font-semibold">93 meals</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Goal Completion</div>
                        <div className="text-2xl font-semibold">92%</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Nutritional Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Protein Goal</span>
                          <span className="text-green-600">↑ 12%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Carb Intake</span>
                          <span className="text-blue-600">↓ 8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Fat Balance</span>
                          <span className="text-green-600">↑ 5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Calorie Consistency</span>
                          <span className="text-green-600">↑ 15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

  );
}