import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Nutrition = () => {
  const { user } = useContext(AuthContext);
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const nutritionByGoal = {
    'weight-loss': [
      {
        title: "Calorie-Conscious Meal Plan",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        description: "Focus on nutrient-dense, low-calorie foods",
        meals: [
          "Breakfast: Greek yogurt with berries and honey",
          "Lunch: Grilled chicken salad with avocado",
          "Dinner: Baked salmon with roasted vegetables",
          "Snacks: Apple slices with almond butter"
        ],
        tips: [
          "Create a caloric deficit",
          "Increase protein intake",
          "Choose high-fiber foods",
          "Stay hydrated"
        ]
      },
      {
        title: "Metabolism Boosting Foods",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
        description: "Foods that help increase metabolic rate",
        meals: [
          "Breakfast: Oatmeal with cinnamon and protein powder",
          "Lunch: Turkey and quinoa bowl",
          "Dinner: Lean beef stir-fry with brown rice",
          "Snacks: Green tea and mixed nuts"
        ],
        tips: [
          "Eat smaller, frequent meals",
          "Include thermogenic foods",
          "Time your meals properly",
          "Monitor portion sizes"
        ]
      }
    ],
    'muscle-gain': [
      {
        title: "High-Protein Meal Plan",
        image: "https://images.unsplash.com/photo-1547496502-affa22d38842",
        description: "Protein-rich meals for muscle growth",
        meals: [
          "Breakfast: Protein pancakes with banana",
          "Lunch: Chicken breast with sweet potato",
          "Dinner: Steak with quinoa and vegetables",
          "Snacks: Protein shake with peanut butter"
        ],
        tips: [
          "Eat in caloric surplus",
          "1.6-2.2g protein per kg bodyweight",
          "Include complex carbs",
          "Time protein intake"
        ]
      }
    ],
    'flexibility': [
      {
        title: "Anti-Inflammatory Diet",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        description: "Foods that promote joint health and flexibility",
        meals: [
          "Breakfast: Smoothie bowl with berries and chia seeds",
          "Lunch: Mediterranean quinoa bowl with chickpeas",
          "Dinner: Grilled fish with sweet potato and greens",
          "Snacks: Walnuts and green tea"
        ],
        tips: [
          "Include omega-3 rich foods",
          "Eat colorful vegetables",
          "Stay hydrated",
          "Avoid processed foods"
        ]
      }
    ],
    'endurance': [
      {
        title: "Endurance Nutrition Plan",
        image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e",
        description: "Fuel your body for long-duration activities",
        meals: [
          "Breakfast: Overnight oats with dates and banana",
          "Lunch: Whole grain pasta with lean protein",
          "Dinner: Sweet potato, rice, and grilled chicken",
          "Snacks: Trail mix and energy bars"
        ],
        tips: [
          "Complex carbs are key",
          "Time your nutrition",
          "Maintain electrolyte balance",
          "Pre-workout fuel"
        ]
      }
    ],
    'maintenance': [
      {
        title: "Balanced Nutrition Plan",
        image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
        description: "Maintain your current health and fitness level",
        meals: [
          "Breakfast: Whole grain toast with eggs and avocado",
          "Lunch: Mixed grain bowl with tofu and vegetables",
          "Dinner: Grilled chicken with quinoa and roasted veggies",
          "Snacks: Greek yogurt with honey"
        ],
        tips: [
          "Maintain portion control",
          "Eat balanced meals",
          "Listen to hunger cues",
          "Stay consistent"
        ]
      }
    ]
  };

  useEffect(() => {
    const fetchUserGoal = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserGoal(userDoc.data().fitnessGoal);
          }
        } catch (error) {
          console.error("Error fetching user goal:", error);
        }
      }
      setLoading(false);
    };

    fetchUserGoal();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const recommendedNutrition = nutritionByGoal[userGoal] || nutritionByGoal['maintenance'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 transform -skew-y-6"></div>
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Nutrition Plan</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-medium">
              Tailored nutrition for: {userGoal?.replace('-', ' ').toUpperCase()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nutrition Plans */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {recommendedNutrition.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative">
                  <img 
                    src={plan.image} 
                    alt={plan.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">{plan.title}</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg">{plan.description}</p>
                  
                  {/* Meal Plan Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-emerald-600 text-lg mb-4">Daily Meal Plan:</h4>
                    <div className="space-y-3">
                      {plan.meals.map((meal, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start space-x-3 text-gray-700"
                          whileHover={{ x: 10 }}
                        >
                          <span className="w-2 h-2 mt-2 bg-emerald-500 rounded-full"></span>
                          <span>{meal}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div>
                    <h4 className="font-semibold text-emerald-600 text-lg mb-4">Nutrition Tips:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {plan.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center space-x-2 text-gray-700"
                          whileHover={{ x: 10 }}
                        >
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start This Plan
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Nutrition;