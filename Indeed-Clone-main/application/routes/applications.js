const express = require('express');
const { body } = require('express-validator');
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/application');

const router = express.Router();

// Validation middleware
const createValidation = [
  body('jobId').isMongoId().withMessage('Valid jobId required'),
  body('userId').isMongoId().withMessage('Valid userId required'),
  body('resume').notEmpty().withMessage('Resume is required'),
  body('coverLetter').optional().isString(),
  body('answers').optional().isObject(),
];

const updateValidation = [
  body('resume').optional().isString(),
  body('coverLetter').optional().isString(),
  body('answers').optional().isObject(),
  body('status').optional().isIn(['RECEIVED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']),
];

// Routes
router.get('/', getApplications);
router.post('/', createValidation, createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', updateValidation, updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;