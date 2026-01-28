const mongoose = require('mongoose');

const poseSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutSession',
    },
    exerciseName: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: Date,
    durationSeconds: Number,
    repsCompleted: Number,
    repAnalysis: [
      {
        repNumber: Number,
        accuracy: Number, // 0-100
        feedback: [String], // Form feedback messages
        keypoints: {
          // Pose keypoints
          nose: { x: Number, y: Number, confidence: Number },
          leftEye: { x: Number, y: Number, confidence: Number },
          rightEye: { x: Number, y: Number, confidence: Number },
          leftEar: { x: Number, y: Number, confidence: Number },
          rightEar: { x: Number, y: Number, confidence: Number },
          leftShoulder: { x: Number, y: Number, confidence: Number },
          rightShoulder: { x: Number, y: Number, confidence: Number },
          leftElbow: { x: Number, y: Number, confidence: Number },
          rightElbow: { x: Number, y: Number, confidence: Number },
          leftWrist: { x: Number, y: Number, confidence: Number },
          rightWrist: { x: Number, y: Number, confidence: Number },
          leftHip: { x: Number, y: Number, confidence: Number },
          rightHip: { x: Number, y: Number, confidence: Number },
          leftKnee: { x: Number, y: Number, confidence: Number },
          rightKnee: { x: Number, y: Number, confidence: Number },
          leftAnkle: { x: Number, y: Number, confidence: Number },
          rightAnkle: { x: Number, y: Number, confidence: Number },
        },
        timestamp: Date,
      },
    ],
    overallAccuracy: {
      type: Number,
      min: 0,
      max: 100,
    },
    commonIssues: [String], // Common form issues detected
    improvements: [String], // Areas to improve
    videoUrl: String, // URL to recorded session
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PoseSession', poseSessionSchema);
