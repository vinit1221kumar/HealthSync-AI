import { useEffect, useRef, useState } from 'react';
import { poseAPI } from '../../services/api';

export const PoseDetectionPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [repCount, setRepCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [exerciseName, setExerciseName] = useState('pushup');
  const detectionFrameRef = useRef(null);
  const [tfError, setTfError] = useState(false);
  const [tfLoading, setTfLoading] = useState(true);

  useEffect(() => {
    const loadDetector = async () => {
      try {
        // Dynamic import of TensorFlow - will fail gracefully if not installed
        const tf = await import('@tensorflow/tfjs');
        const poseDetection = await import('@tensorflow-models/pose-detection');

        await tf.ready();
        const detectionResult = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );
        setDetector(detectionResult);
        setTfError(false);
      } catch (err) {
        console.warn('TensorFlow not available:', err.message);
        setTfError(true);
      } finally {
        setTfLoading(false);
      }
    };

    loadDetector();
  }, []);

  const startSession = async () => {
    if (tfError) {
      alert('Pose detection is not available. TensorFlow libraries are not installed.\n\nTo enable pose detection, run:\nnpm install @tensorflow/tfjs @tensorflow-models/pose-detection');
      return;
    }

    try {
      const response = await poseAPI.startSession(exerciseName);
      setSessionId(response.data.data._id);
      setIsRunning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      detectPoses();
    } catch (err) {
      alert('Failed to start session');
    }
  };

  const detectPoses = async () => {
    if (!detector || !videoRef.current) return;

    const video = videoRef.current;

    const detectFrame = async () => {
      try {
        const poses = await detector.estimatePoses(video, {
          maxPoses: 1,
          flipHorizontal: false,
        });

        if (poses.length > 0) {
          const pose = poses[0];
          const keypoints = pose.keypoints;

          // Draw pose on canvas
          drawPose(keypoints);

          // Analyze pose
          if (sessionId) {
            await poseAPI.analyzePose(sessionId, {
              keypoints: keypoints,
              repNumber: repCount,
              timestamp: new Date(),
            });
          }

          // Simple rep counting logic (oscillation detection)
          const shoulderY = keypoints[5]?.y || 0;
          const hipY = keypoints[11]?.y || 0;

          if (
            detectionFrameRef.current &&
            Math.abs(detectionFrameRef.current.shoulderY - shoulderY) > 50
          ) {
            setRepCount((prev) => prev + 1);
          }

          detectionFrameRef.current = { shoulderY };
        }

        if (isRunning) {
          requestAnimationFrame(detectFrame);
        }
      } catch (err) {
        console.error('Pose detection error:', err);
      }
    };

    detectFrame();
  };

  const drawPose = (keypoints) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Draw keypoints
    keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw skeleton
    const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
      poseDetection.SupportedModels.MoveNet
    );

    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;

    adjacentKeyPoints.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      if (kp1.score > 0.3 && kp2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
  };

  const endSession = async () => {
    setIsRunning(false);

    if (sessionId) {
      try {
        const response = await poseAPI.endSession(sessionId);
        setFeedback(response.data.data.improvements.join(', '));
      } catch (err) {
        console.error('Failed to end session:', err);
      }
    }

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Pose Detection 🎥</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TensorFlow Warning Banner */}
          {tfError && (
            <div className="lg:col-span-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">TensorFlow Not Available</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Pose detection requires TensorFlow libraries. To enable this feature, run:</p>
                    <code className="block mt-2 bg-yellow-100 px-2 py-1 rounded text-xs">
                      npm install @tensorflow/tfjs @tensorflow-models/pose-detection
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="relative bg-black rounded overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  autoPlay
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="input-label">Exercise</label>
                  <select
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    disabled={isRunning || tfError}
                    className="input"
                  >
                    <option value="pushup">Push-up</option>
                    <option value="squat">Squat</option>
                    <option value="pullup">Pull-up</option>
                    <option value="plank">Plank</option>
                    <option value="lunge">Lunge</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  {!isRunning ? (
                    <button
                      onClick={startSession}
                      className="btn btn-primary flex-1"
                      disabled={!detector || tfError}
                      title={tfError ? 'TensorFlow libraries not installed' : ''}
                    >
                      {tfError ? 'Pose Detection Unavailable' : 'Start Pose Detection'}
                    </button>
                  ) : (
                    <button
                      onClick={endSession}
                      className="btn btn-danger flex-1"
                    >
                      End Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* Rep Counter */}
            <div className="card">
              <p className="text-gray-600 mb-2">Reps Completed</p>
              <h2 className="text-5xl font-bold text-primary">{repCount}</h2>
            </div>

            {/* Accuracy */}
            <div className="card">
              <p className="text-gray-600 mb-2">Form Accuracy</p>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-primary">{accuracy}%</h2>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>

            {/* Exercise Tips */}
            <div className="card bg-blue-50">
              <h3 className="font-bold text-blue-900 mb-2">Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep camera at chest height</li>
                <li>• Maintain good lighting</li>
                <li>• Stay within camera frame</li>
                <li>• Move at steady pace</li>
              </ul>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="card bg-green-50">
                <h3 className="font-bold text-green-900 mb-2">Feedback</h3>
                <p className="text-sm text-green-800">{feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
