/* eslint-disable no-underscore-dangle */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types, Schema } = require('mongoose');
const { getPagination, errors } = require('u-server-utils');
const { Job, Company } = require('../model');

// get all applications along with jobs when getApplication=true is passed in query
const getAllJobs = async (req, res) => {
  try {
    const { compId } = req.params;
    const { limit, offset } = getPagination(req.query.page, req.query.limit);
    const { since, q } = req.query;

    const whereOpts = { companyId: Types.ObjectId(compId) };
    if (since && since !== '') {
      whereOpts.postedOn = { $gte: new Date(since) };
    }
    if (q && q !== '') {
      whereOpts.$or = [{ title: { $regex: q, $options: 'i' } }, { jobLocation: { $regex: q, $options: 'i' } }];
    }

    const jobsCount = await Job.countDocuments(whereOpts);
    const jobList = await Job.aggregate([
      { $match: whereOpts },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
    ])
      .skip(offset)
      .limit(limit);

    res.status(200).json({ total: jobsCount, nodes: jobList });
  } catch (err) {
    console.log(err);
    res.status(500).json(errors.serverError);
  }
};

const getJobById = async (req, res) => {
  const { compId, id } = req.params;

  try {
    const result = await Job.aggregate([
      {
        $match: { _id: Types.ObjectId(id), companyId: Types.ObjectId(compId) },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
    ]);
    if (result?.length === 0) {
      res.status(404).json(errors.notFound);
      return;
    }

    const applicationsResp = await axios.get(`${global.gConfig.application_url}/applications`, {
      params: { jobIds: result[0]._id.toString(), all: true },
      headers: { Authorization: req.headers.authorization },
    });

    res.applications = applicationsResp.data?.nodes;

    res.status(200).json({ ...result[0], applications: applicationsResp.data.nodes });
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const createJob = async (req, res) => {
  const { compId } = req.params;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  try {
    const job = req.body;
    job.companyId = compId;

    const newJob = new Job(job);
    const savedJob = await newJob.save();
    const company = await Company.findById(Types.ObjectId(compId));

    const result = { ...savedJob.toObject(), company };
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(errors.serverError);
  }
};

const updateJob = async (req, res) => {
  const { compId, id } = req.params;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const job = req.body;

  try {
    const dbJob = await Job.findOne({
      _id: Types.ObjectId(id),
      companyId: Types.ObjectId(compId),
    });
    if (!dbJob) {
      res.status(404).json(errors.notFound);
      return;
    }

    const updatedJob = await Job.findByIdAndUpdate(dbJob._id, job, { new: true });
    const result = await Job.aggregate([
      { $match: { _id: Types.ObjectId(updatedJob._id) } },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
    ]);

    res.status(200).json(result[0]);
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const deleteJob = async (req, res) => {
  const { compId, id } = req.params;

  try {
    const dbJob = await Job.findOne({
      _id: Types.ObjectId(id),
      companyId: Types.ObjectId(compId),
    });
    if (!dbJob) {
      res.status(404).json(errors.notFound);
      return;
    }

    await Job.findByIdAndDelete(dbJob._id);
    res.status(200).json(null);
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const getJobsList = async (req, res) => {
  try {
    const whereOpts = [];
    const { city, state, q, companyId, location, all, type, industry, since, title } = req.query;

    if (city && city !== '') {
      whereOpts.push({ city });
    }

    if (state && state !== '') {
      whereOpts.push({ state });
    }

    if (location && location !== '' && location.toLowerCase() !== 'any location') {
      whereOpts.push({ jobLocation: location });
    }

    if (companyId && companyId !== '') {
      whereOpts.push({ companyId: Types.ObjectId(companyId) });
    }

    if (type && type !== '') {
      whereOpts.push({ type });
    }

    if (industry && industry !== '') {
      whereOpts.push({ 'industry.name': industry });
    }

    if (title && title !== '') {
      whereOpts.push({ title: { $regex: title, $options: 'i' } });
    }

    if (q && q !== '') {
      whereOpts.push({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { jobLocation: { $regex: q, $options: 'i' } },
          { city: { $regex: q, $options: 'i' } },
          { state: { $regex: q, $options: 'i' } }
        ],
      });
    }

    if (since && since !== '') {
      whereOpts.push({ postedOn: { $gte: new Date(since) } });
    }

    let query = {};
    if (whereOpts.length > 0) {
      query.$and = whereOpts;
    }
    if (all) {
      query = {};
    }

    const { limit, offset } = getPagination(req.query.page, req.query.limit);
    const jobsCnt = await Job.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
      { $match: query },
      { $count: 'count' },
    ]);

    const result = await Job.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
      { $match: query },
    ])
      .skip(offset)
      .limit(limit);

    if (all) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ total: jobsCnt[0]?.count, nodes: result });
    }
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const getJobInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Job.aggregate([
      { $match: { _id: Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: { path: '$company' },
      },
    ]);
    if (!result || result.length === 0) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsList,
  getJobInfoById,
};
