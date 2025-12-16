const express = require('express');
const { body } = require('express-validator');
const { Types } = require('mongoose');
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/application');

const router = express.Router();

const validateObjectId = (field) => 
  body(field).custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${field}`);
    }
    return true;
  });

const createValidation = [
  validateObjectId('jobId'),
  validateObjectId('userId'),
  body('resume').notEmpty(),
  body('coverLetter').optional().isString(),
  body('answers').optional().isObject(),
];

const updateValidation = [
  body('resume').optional().isString(),
  body('coverLetter').optional().isString(),
  body('answers').optional().isObject(),
  body('status').optional().isIn(['RECEIVED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']),
];

router.get('/', getApplications);
router.post('/', createValidation, createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', updateValidation, updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;