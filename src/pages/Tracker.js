import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Tracker = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    weight: [],
    water: [],
    steps: [],
    sleep: []
  });

  const [newEntry, setNewEntry] = useState({
    weight: '',
    water: '',
    steps: '',
    sleep: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'tracking', user.uid));
      if (userDoc.exists()) {
        setActivityData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date().toISOString().split('T')[0];
    
    const updatedData = {
      weight: [...activityData.weight, { date, value: parseFloat(newEntry.weight) }],
      water: [...activityData.water, { date, value: parseInt(newEntry.water) }],
      steps: [...activityData.steps, { date, value: parseInt(newEntry.steps) }],
      sleep: [...activityData.sleep, { date, value: parseFloat(newEntry.sleep) }]
    };

    try {
      await setDoc(doc(db, 'tracking', user.uid), updatedData);
      setActivityData(updatedData);
      setNewEntry({ weight: '', water: '', steps: '', sleep: '' });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const createChartData = (data, label, color) => ({
    labels: data.map(item => item.date).slice(-7),
    datasets: [
      {
        label,
        data: data.map(item => item.value).slice(-7),
        borderColor: color,
        tension: 0.4
      }
    ]
  });

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Activity Tracker</h1>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/bmi-calculator"
                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <span>Check BMI & Nutrition Plan</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Data Entry Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water (glasses)</label>
                <input
                  type="number"
                  value={newEntry.water}
                  onChange={(e) => setNewEntry({ ...newEntry, water: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter water intake"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
                <input
                  type="number"
                  value={newEntry.steps}
                  onChange={(e) => setNewEntry({ ...newEntry, steps: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter steps"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newEntry.sleep}
                  onChange={(e) => setNewEntry({ ...newEntry, sleep: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter sleep hours"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="mt-6 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Add Today's Entry
            </motion.button>
          </form>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
              {activityData.weight.length > 0 && (
                <Line options={chartOptions} data={createChartData(activityData.weight, 'Weight (kg)', '#059669')} />
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Water Intake</h3>
              {activityData.water.length > 0 && (
                <Line options={chartOptions} data={createChartData(activityData.water, 'Glasses', '#0891b2')} />
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Steps</h3>
              {activityData.steps.length > 0 && (
                <Line options={chartOptions} data={createChartData(activityData.steps, 'Steps', '#8b5cf6')} />
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sleep Duration</h3>
              {activityData.sleep.length > 0 && (
                <Line options={chartOptions} data={createChartData(activityData.sleep, 'Hours', '#ec4899')} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tracker;