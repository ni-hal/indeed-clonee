/* eslint-disable no-underscore-dangle */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { getPagination, errors } = require('u-server-utils');
const { Application } = require('../model');

const getAllJobs = async (auth) => {
  const response = await axios.get(`${global.gConfig.company_url}/jobs`, {
    params: { all: true },
    headers: { Authorization: auth },
  });
  if (!response) {
    throw Error('something went wrong');
  }

  const jobsList = response.data;

  const jobMap = {};
  jobsList.forEach((job) => {
    jobMap[job._id] = job;
  });

  return jobMap;
};

const getJob = async (id, auth) => {
  const response = await axios.get(`${global.gConfig.company_url}/jobs/${id}`, {
    headers: { Authorization: auth },
  });
  if (!response) {
    throw Error('something went wrong');
  }

  return response.data;
};

const getAllUsers = async (auth) => {
  const response = await axios.get(`${global.gConfig.user_url}/users`, {
    params: { all: true },
    headers: { Authorization: auth },
  });
  if (!response) {
    throw Error('something went wrong');
  }

  const userList = response.data;

  const userMap = {};
  userList.nodes?.forEach((user) => {
    userMap[user._id] = user;
  });

  return userMap;
};

const getApplications = async (req, res) => {
  try {
    const { userId, jobIds, all } = req.query;
    const whereOpts = {};
    if (userId && userId !== '') {
      whereOpts.userId = Types.ObjectId(userId);
    }

    if (jobIds && jobIds !== '') {
      const jobIdList = String(jobIds)
        .split(',')
        .map((i) => {
          if (i.trim() !== '') return Types.ObjectId(i.trim());
        });
      whereOpts.jobId = { $in: jobIdList };
    }

    const { limit, offset } = getPagination(req.query.page, req.query.limit);

    const applicationCount = await Application.countDocuments(whereOpts);
    let applicationList = [];
    if (all == 'true') {
      applicationList = await Application.find(whereOpts);
    } else {
      applicationList = await Application.find(whereOpts).skip(offset).limit(limit);
    }

    const result = applicationList.map((app) => ({
      ...app._doc,
      jobId: app.jobId.toString(),
      userId: app.userId.toString()
    }));

    res.status(200).json({ total: applicationCount, nodes: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, jobIds } = req.query;
    const whereOpts = { _id: Types.ObjectId(id) };
    if (userId && userId !== '') {
      whereOpts.userId = Types.ObjectId(userId);
    }

    if (jobIds && jobIds !== '') {
      const jobIdList = String(jobIds)
        .split(',')
        .map((i) => {
          if (i.trim() !== '') return Types.ObjectId(i.trim());
        });
      whereOpts.jobId = { $in: jobIdList };
    }

    const application = await Application.findOne(whereOpts);
    if (!application) {
      res.status(404).json(errors.notFound);
      return;
    }

    const result = {
      ...application._doc,
      applicationId: application._id.toString(),
      jobId: application.jobId.toString(),
      userId: application.userId.toString(),
      jobDetails: {
        title: "Software Engineer",
        company: "Company Name",
        location: "New York, NY (Remote)",
        type: "Full-time",
        salary: "$80,000",
        industry: "Technology",
        posted: "December 14, 2024"
      }
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const valErr = validationResult(req);
    if (!valErr.isEmpty()) {
      res.status(400).json({ status: 400, message: valErr.array() });
      return;
    }
    
    const application = req.body || {};
    application.date = Date.now();
    application.status = 'RECEIVED';
    
    // Convert string IDs to ObjectIds
    if (application.userId) {
      application.userId = Types.ObjectId(application.userId);
    }
    if (application.jobId) {
      application.jobId = Types.ObjectId(application.jobId);
    }

    const newApplication = new Application(application);
    const savedApplication = await newApplication.save();
    
    const result = {
      applicationId: savedApplication._id.toString(),
      jobId: application.jobId.toString(),
      userId: application.userId.toString(),
      jobDetails: {
        title: "Software Engineer",
        company: "Company Name",
        location: "New York, NY (Remote)",
        type: "Full-time",
        salary: "$80,000",
        industry: "Technology",
        posted: "December 14, 2024"
      },
      ...savedApplication.toObject()
    };
    
    res.status(201).json(result);
  } catch (err) {
    console.log('Error creating application:', err);
    res.status(500).json({ error: err.message });
  }
};

// TODO: only employer should be able to update status
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, jobIds } = req.query;

    const valErr = validationResult(req);
    if (!valErr.isEmpty()) {
      res.status(400).json({ status: 400, message: valErr.array() });
      return;
    }

    const whereOpts = { _id: Types.ObjectId(id) };
    if (userId && userId !== '') {
      whereOpts.userId = Types.ObjectId(userId);
    }

    if (jobIds && jobIds !== '') {
      const jobIdList = String(jobIds)
        .split(',')
        .map((i) => {
          if (i.trim() !== '') return Types.ObjectId(i.trim());
        });
      whereOpts.jobId = { $in: jobIdList };
    }

    const updatedApplication = await Application.findOneAndUpdate(whereOpts, req.body, { new: true });
    if (!updatedApplication) {
      res.status(404).json(errors.notFound);
      return;
    }

    const result = {
      ...updatedApplication._doc,
      applicationId: updatedApplication._id.toString(),
      jobId: updatedApplication.jobId.toString(),
      userId: updatedApplication.userId.toString()
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApplication = await Application.findByIdAndDelete(Types.ObjectId(id));
    if (!deletedApplication) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
