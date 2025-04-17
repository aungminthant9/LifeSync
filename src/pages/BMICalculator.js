import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const BMICalculator = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          calculateBMI(data.height, data.weight);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      generateRecommendation(bmiValue);
    }
  };

  const generateRecommendation = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    let rec = '';

    if (bmiNum < 18.5) {
      rec = {
        category: 'Underweight',
        diet: [
          'Increase caloric intake with nutrient-dense foods',
          'Include healthy fats like avocados, nuts, and olive oil',
          'Eat protein-rich foods with every meal',
          'Have frequent meals and healthy snacks',
          'Consider protein smoothies and shakes'
        ],
        tips: 'Focus on gaining weight healthily through balanced nutrition and strength training.'
      };
    } else if (bmiNum >= 18.5 && bmiNum < 24.9) {
      rec = {
        category: 'Normal Weight',
        diet: [
          'Maintain balanced meals with varied nutrients',
          'Include plenty of fruits and vegetables',
          'Choose whole grains over refined grains',
          'Moderate portions of lean proteins',
          'Stay hydrated with water'
        ],
        tips: 'Continue maintaining a balanced diet and regular exercise routine.'
      };
    } else if (bmiNum >= 25 && bmiNum < 29.9) {
      rec = {
        category: 'Overweight',
        diet: [
          'Control portion sizes',
          'Increase fiber intake through vegetables',
          'Choose lean proteins over fatty meats',
          'Limit processed foods and sugars',
          'Include more whole foods in your diet'
        ],
        tips: 'Focus on creating a slight caloric deficit through diet and exercise.'
      };
    } else {
      rec = {
        category: 'Obese',
        diet: [
          'Consult with a healthcare provider',
          'Focus on whole, unprocessed foods',
          'Increase vegetable intake significantly',
          'Choose water over sugary drinks',
          'Monitor portion sizes carefully'
        ],
        tips: 'Consider working with a registered dietitian for personalized advice.'
      };
    }
    setRecommendation(rec);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* BMI Display */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Your BMI Calculator</h1>
              <p className="text-emerald-100">Based on your profile measurements</p>
            </div>

            <div className="p-8">
              {userData ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-600 mb-2">Height</p>
                      <p className="text-2xl font-bold text-gray-900">{userData.height} cm</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-600 mb-2">Weight</p>
                      <p className="text-2xl font-bold text-gray-900">{userData.weight} kg</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-xl">
                      <p className="text-emerald-600 mb-2">Your BMI</p>
                      <p className="text-3xl font-bold text-emerald-600">{bmi || 'N/A'}</p>
                    </div>
                  </div>

                  {recommendation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="bg-white border border-emerald-100 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          BMI Category: {recommendation.category}
                        </h2>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Recommended Diet Plan
                            </h3>
                            <ul className="space-y-2">
                              {recommendation.diet.map((item, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-emerald-500 mt-1">•</span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Tips
                            </h3>
                            <p className="text-gray-700">{recommendation.tips}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Please update your height and weight in your profile.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BMICalculator;