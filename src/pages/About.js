import React from 'react';
import { motion } from 'framer-motion';
import FitnessImage from '../assets/Fitness.png';  // Add a team image to your assets folder

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "AI Specialist",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      description: "Expert in AI-driven fitness solutions with 8+ years of experience."
    },
    {
      name: "Michael Chen",
      role: "Fitness Expert",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      description: "Certified personal trainer specializing in personalized workout programs."
    },
    {
      name: "Emma Davis",
      role: "Nutrition Coach",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      description: "Registered dietitian passionate about healthy eating habits."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-emerald-600">LifeSync AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to revolutionize personal wellness through the power of artificial intelligence.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={FitnessImage} 
                  alt="Our Team" 
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-600/20 to-transparent" />
              </motion.div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2024, LifeSync AI emerged from a simple yet powerful idea: making personalized fitness and wellness accessible to everyone through artificial intelligence.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of fitness experts, nutritionists, and AI specialists work together to provide you with the most advanced and personalized wellness experience possible.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  { number: "10k+", label: "Active Users" },
                  { number: "95%", label: "Success Rate" },
                  { number: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                  >
                    <h3 className="text-2xl font-bold text-emerald-600">{stat.number}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-emerald-600 mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Innovation", description: "Pushing boundaries in AI fitness technology" },
              { title: "Integrity", description: "Building trust through transparency and honesty" },
              { title: "Impact", description: "Making a real difference in people's lives" },
              { title: "Inclusion", description: "Wellness solutions for everyone, everywhere" }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-emerald-600 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;