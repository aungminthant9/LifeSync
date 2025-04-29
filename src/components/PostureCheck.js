import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { motion } from 'framer-motion';

const PostureCheck = () => {
  const [net, setNet] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [exerciseType, setExerciseType] = useState('posture'); // Add this state

  useEffect(() => {
    loadPosenet();
  }, []);

  const loadPosenet = async () => {
    try {
      const loadedNet = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: 256,
        quantBytes: 2
      });
      setNet(loadedNet);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading PoseNet:', error);
    }
  };

  const analyzeGymPose = (keypoints) => {
    const feedback = [];
    
    switch(exerciseType) {
      case 'squat':
        feedback.push(...analyzeSquatForm(keypoints));
        break;
      case 'pushup':
        feedback.push(...analyzePushupForm(keypoints));
        break;
      case 'deadlift':
        feedback.push(...analyzeDeadliftForm(keypoints));
        break;
      default:
        return getPostureFeedback(keypoints);
    }
    
    return feedback.length > 0 ? feedback : [{
      issue: "✅ Good Form",
      detail: "Your exercise form looks good! Keep maintaining proper technique.",
      exercises: ["• Continue with current form", "• Consider increasing weight/reps if comfortable"]
    }];
  };

  const analyzeSquatForm = (keypoints) => {
    const feedback = [];
    const knees = findKeypoint(keypoints, 'leftKnee') && findKeypoint(keypoints, 'rightKnee');
    const hips = findKeypoint(keypoints, 'leftHip') && findKeypoint(keypoints, 'rightHip');
    const ankles = findKeypoint(keypoints, 'leftAnkle') && findKeypoint(keypoints, 'rightAnkle');

    if (knees && hips && ankles) {
      // Check knee alignment
      const kneeAngle = calculateAngle(hips, knees, ankles);
      if (kneeAngle < 90) {
        feedback.push({
          issue: "⚠️ Knee Position",
          detail: "Your knees are going too far forward. Keep them aligned with your toes.",
          exercises: [
            "• Practice wall squats",
            "• Box squats for depth control",
            "• Ankle mobility exercises"
          ]
        });
      }

      // Check hip depth
      const hipDepth = calculateHipDepth(hips, knees);
      if (hipDepth > 0.2) {
        feedback.push({
          issue: "⚠️ Squat Depth",
          detail: "You're not reaching parallel depth. Try going lower while maintaining form.",
          exercises: [
            "• Goblet squats for depth practice",
            "• Hip mobility exercises",
            "• Assisted squats with TRX"
          ]
        });
      }
    }

    return feedback;
  };

  const analyzePushupForm = (keypoints) => {
    const feedback = [];
    const shoulders = findKeypoint(keypoints, 'leftShoulder') && findKeypoint(keypoints, 'rightShoulder');
    const elbows = findKeypoint(keypoints, 'leftElbow') && findKeypoint(keypoints, 'rightElbow');
    const wrists = findKeypoint(keypoints, 'leftWrist') && findKeypoint(keypoints, 'rightWrist');

    if (shoulders && elbows && wrists) {
      // Check elbow angle
      const elbowAngle = calculateAngle(shoulders, elbows, wrists);
      if (elbowAngle < 85 || elbowAngle > 95) {
        feedback.push({
          issue: "⚠️ Elbow Position",
          detail: "Keep your elbows at 90 degrees at the bottom of the movement.",
          exercises: [
            "• Modified pushups on knees",
            "• Plank holds for stability",
            "• Eccentric pushups"
          ]
        });
      }
    }

    return feedback;
  };

  const analyzeDeadliftForm = (keypoints) => {
    const feedback = [];
    const shoulders = findKeypoint(keypoints, 'leftShoulder') && findKeypoint(keypoints, 'rightShoulder');
    const hips = findKeypoint(keypoints, 'leftHip') && findKeypoint(keypoints, 'rightHip');
    const knees = findKeypoint(keypoints, 'leftKnee') && findKeypoint(keypoints, 'rightKnee');

    if (shoulders && hips && knees) {
      // Check hip hinge
      const hipAngle = calculateAngle(shoulders, hips, knees);
      if (hipAngle < 45 || hipAngle > 90) {
        feedback.push({
          issue: "⚠️ Hip Hinge",
          detail: "Maintain a proper hip hinge angle. Your back should be straight and parallel to the ground at the bottom.",
          exercises: [
            "• Romanian deadlifts for hip hinge practice",
            "• Good mornings with light weight",
            "• Hip hinge with dowel rod"
          ]
        });
      }

      // Check back alignment
      const backAngle = Math.abs(shoulders.position.y - hips.position.y) / Math.abs(shoulders.position.x - hips.position.x);
      if (backAngle > 0.3) {
        feedback.push({
          issue: "⚠️ Back Position",
          detail: "Keep your back straight throughout the movement. Current form might lead to lower back strain.",
          exercises: [
            "• Plank holds for core strength",
            "• Cat-cow stretches",
            "• Bird-dog exercise"
          ]
        });
      }
    }

    return feedback;
  };

  const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#10B981'; // Emerald color to match theme
        ctx.fill();
      }
    });
  };

 
  const exerciseOptions = (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Analysis Type
      </label>
      <select
        value={exerciseType}
        onChange={(e) => setExerciseType(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
      >
        <option value="posture">General Posture</option>
        <option value="squat">Squat Form</option>
        <option value="pushup">Push-up Form</option>
        <option value="deadlift">Deadlift Form</option>
      </select>
    </div>
  );

  // Modify the analyzePosture function to use the new analysis
  const analyzePosture = async (imageElement) => {
    if (!net) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    try {
      const pose = await net.estimateSinglePose(imageElement, {
        flipHorizontal: false
      });

      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);
      drawKeypoints(pose.keypoints, ctx);
      drawSkeleton(pose.keypoints, ctx); // Add skeleton drawing

      // Use the new analyzeGymPose function
      const postureFeedback = analyzeGymPose(pose.keypoints);
      setFeedback(postureFeedback);
    } catch (error) {
      console.error('Error analyzing posture:', error);
      setFeedback(['Error analyzing posture. Please try again.']);
    }
  };

  //helper function for skeleton drawing
  const drawSkeleton = (keypoints, ctx) => {
    const connections = [
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;

    connections.forEach(([p1, p2]) => {
      const point1 = keypoints.find(k => k.part === p1);
      const point2 = keypoints.find(k => k.part === p2);

      if (point1 && point2 && point1.score > 0.2 && point2.score > 0.2) {
        ctx.beginPath();
        ctx.moveTo(point1.position.x, point1.position.y);
        ctx.lineTo(point2.position.x, point2.position.y);
        ctx.stroke();
      }
    });
  };

  // Add these helper functions
  const calculateAngle = (point1, point2, point3) => {
    const radians = Math.atan2(point3.position.y - point2.position.y,
                              point3.position.x - point2.position.x) -
                   Math.atan2(point1.position.y - point2.position.y,
                              point1.position.x - point2.position.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const calculateHipDepth = (hips, knees) => {
    return Math.abs(hips.position.y - knees.position.y) / knees.position.y;
  };

  const getPostureFeedback = (keypoints) => {
    const feedback = [];
    
    const leftShoulder = findKeypoint(keypoints, 'leftShoulder');
    const rightShoulder = findKeypoint(keypoints, 'rightShoulder');
    const leftHip = findKeypoint(keypoints, 'leftHip');
    const rightHip = findKeypoint(keypoints, 'rightHip');
    const leftKnee = findKeypoint(keypoints, 'leftKnee');
    const rightKnee = findKeypoint(keypoints, 'rightKnee');
    const nose = findKeypoint(keypoints, 'nose');
  
    // Shoulder alignment analysis
    if (leftShoulder && rightShoulder) {
      const shoulderSlope = Math.abs(leftShoulder.position.y - rightShoulder.position.y);
      if (shoulderSlope > 20) {
        feedback.push({
          issue: "⚠️ Uneven Shoulders Detected",
          detail: `Your shoulders show a ${shoulderSlope.toFixed(1)}° misalignment. This could lead to muscle imbalances and upper back pain.`,
          exercises: [
            "• Wall Angels: 3 sets of 10 reps",
            "• Band Pull-Aparts: 3 sets of 15 reps",
            "• Side-lying Shoulder Rotations: 2 sets of 12 per side"
          ]
        });
      }
    }
  
    // Spinal alignment check
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderCenter = {
        x: (leftShoulder.position.x + rightShoulder.position.x) / 2,
        y: (leftShoulder.position.y + rightShoulder.position.y) / 2
      };
      const hipCenter = {
        x: (leftHip.position.x + rightHip.position.x) / 2,
        y: (leftHip.position.y + rightHip.position.y) / 2
      };
      
      const spinalCurve = Math.abs(shoulderCenter.x - hipCenter.x);
      if (spinalCurve > 25) {
        feedback.push({
          issue: "⚠️ Spinal Misalignment",
          detail: "Your spine shows lateral deviation. This could indicate scoliosis or muscular imbalance.",
          exercises: [
            "• Cat-Cow Stretches: 10 repetitions",
            "• Bird-Dog Exercise: 3 sets of 10 per side",
            "• Child's Pose: Hold for 30 seconds, 3 sets"
          ]
        });
      }
    }
  
    // Forward head posture check
    if (nose && leftShoulder && rightShoulder) {
      const shoulderCenter = {
        x: (leftShoulder.position.x + rightShoulder.position.x) / 2
      };
      const headForward = nose.position.x - shoulderCenter.x;
      
      if (headForward > 30) {
        feedback.push({
          issue: "⚠️ Forward Head Posture",
          detail: "Your head is positioned forward of your shoulders, which can strain your neck and upper back.",
          exercises: [
            "• Chin Tucks: 3 sets of 10 reps",
            "• Neck Retraction: Hold 10 seconds, 10 reps",
            "• Upper Trapezius Stretch: Hold 30 seconds each side"
          ]
        });
      }
    }
  
    // Hip alignment check
    if (leftHip && rightHip && leftKnee && rightKnee) {
      const hipDifference = Math.abs(leftHip.position.y - rightHip.position.y);
      if (hipDifference > 15) {
        feedback.push({
          issue: "⚠️ Hip Misalignment",
          detail: "Your hips are not level, which may indicate muscle imbalance or leg length discrepancy.",
          exercises: [
            "• Single-leg Bridges: 3 sets of 12 per side",
            "• Clamshells: 2 sets of 15 per side",
            "• Standing IT Band Stretch: Hold 30 seconds each side"
          ]
        });
      }
    }

    if (feedback.length === 0) {
      return [{
        issue: "✅ Excellent Posture",
        detail: "Your posture alignment is within healthy ranges. Keep maintaining good form!",
        exercises: [
          "Maintenance Exercises:",
          "• Plank Hold: 30 seconds, 3 sets",
          "• Superman Holds: 10 seconds, 10 reps",
          "• Standing Posture Check: Practice throughout the day"
        ]
      }];
    }

    return feedback;
  };

  const findKeypoint = (keypoints, partName) => {
    return keypoints.find(k => k.part === partName && k.score > 0.5);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    setImagePreview(URL.createObjectURL(file));

    const img = new Image();
    img.onload = async () => {
      imageRef.current = img;
      await analyzePosture(img);
      setIsAnalyzing(false);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Posture Check AI</h2>
            <p className="text-emerald-50 mt-2">Upload a photo to analyze your posture and get personalized feedback</p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">Initializing AI model...</p>
            </div>
          ) : (
            <div className="p-8">
              {/* Upload Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select an image for analysis
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                        <span>Upload a photo</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full rounded-lg shadow-lg"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto"></div>
                          <p className="mt-4">Analyzing posture...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h3>
                    <div className="space-y-4">
                      {feedback.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-lg ${
                            item.issue.includes('✅') ? 'bg-green-50' : 'bg-yellow-50'
                          }`}
                        >
                          <h4 className={`text-lg font-semibold mb-2 ${
                            item.issue.includes('✅') ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {item.issue}
                          </h4>
                          <p className="text-gray-700 mb-4">{item.detail}</p>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4">
                            <h5 className="font-medium mb-2">Recommended Exercises:</h5>
                            <ul className="space-y-1 text-gray-600">
                              {item.exercises.map((exercise, idx) => (
                                <li key={idx}>{exercise}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PostureCheck;
