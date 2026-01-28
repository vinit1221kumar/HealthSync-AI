const express = require('express');
const {
  generateAnalysis,
  getReports,
  getReportById,
  getLatestReport,
} = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.post('/analyze', generateAnalysis);
router.get('/reports', getReports);
router.get('/latest', getLatestReport);
router.get('/reports/:id', getReportById);

module.exports = router;
