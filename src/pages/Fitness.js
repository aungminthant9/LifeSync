import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Fitness = () => {
  const { user } = useContext(AuthContext);
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const exercisesByGoal = {
    'weight-loss': [
      {
        title: "High-Intensity Cardio",
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
        description: "Burn calories and improve cardiovascular health",
        exercises: ["Burpees", "Mountain Climbers", "Jump Rope", "High Knees"]
      },
      {
        title: "Circuit Training",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        description: "Combined strength and cardio for maximum calorie burn",
        exercises: ["Jumping Jacks", "Squats", "Push-ups", "Lunges"]
      }
    ],
    'muscle-gain': [
      {
        title: "Strength Training",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        description: "Build muscle mass and increase strength",
        exercises: ["Bench Press", "Deadlifts", "Rows", "Shoulder Press"]
      },
      {
        title: "Progressive Overload",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        description: "Gradually increase weights for muscle growth",
        exercises: ["Squats", "Pull-ups", "Dips", "Barbell Curls"]
      }
    ],
    'flexibility': [
      {
        title: "Dynamic Stretching",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        description: "Improve range of motion and prevent injuries",
        exercises: ["Yoga Flow", "Dynamic Lunges", "Arm Circles", "Leg Swings"]
      },
      {
        title: "Mobility Work",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        description: "Enhance joint mobility and flexibility",
        exercises: ["Hip Openers", "Shoulder Mobility", "Ankle Mobility", "Spine Mobility"]
      }
    ],
    'endurance': [
      {
        title: "Endurance Training",
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
        description: "Build stamina and cardiovascular endurance",
        exercises: ["Long Distance Running", "Cycling", "Swimming", "Row Machine"]
      },
      {
        title: "Stamina Building",
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
        description: "Increase workout duration and intensity",
        exercises: ["Interval Training", "Tempo Runs", "Circuit Training", "Tabata"]
      }
    ],
    'maintenance': [
      {
        title: "Full Body Workout",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        description: "Maintain current fitness level and body composition",
        exercises: ["Body Weight Squats", "Push-ups", "Pull-ups", "Planks"]
      },
      {
        title: "Active Recovery",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        description: "Stay active while preventing overtraining",
        exercises: ["Light Jogging", "Swimming", "Yoga", "Walking"]
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

  const recommendedWorkouts = exercisesByGoal[userGoal] || exercisesByGoal['maintenance'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Dynamic Background */}
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
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Fitness Journey</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-medium">
              Personalized workouts for: {userGoal?.replace('-', ' ').toUpperCase()}
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Today
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Workouts with Enhanced Design */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Recommended Workouts
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {recommendedWorkouts.map((workout, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative">
                  <img 
                    src={workout.image} 
                    alt={workout.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">{workout.title}</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg">{workout.description}</p>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-emerald-600 text-lg">Exercise Plan:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {workout.exercises.map((exercise, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center space-x-2 text-gray-700"
                          whileHover={{ x: 10 }}
                        >
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>{exercise}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Begin Workout
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

export default Fitness;