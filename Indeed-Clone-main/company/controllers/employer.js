/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { getPagination, errors } = require('u-server-utils');
const { Employer, Company } = require('../model');
const { makeRequest } = require('../util/kafka/client');

const getAllEmployers = async (req, res) => {
  let { limit, offset } = getPagination(req.query.page, req.query.limit);

  const employersCount = await Employer.count();

  if (req.query.all === 'true') {
    limit = employersCount;
    offset = 0;
  }

  const employerList = await Employer.aggregate([
    {
      $lookup: {
        from: 'companies',
        foreignField: '_id',
        localField: 'companyId',
        as: 'company',
      },
    },
  ])
    .skip(offset)
    .limit(limit);

  res.status(200).json({ total: employersCount, nodes: employerList });
};

const getEmployerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(404).json(errors.notFound);
      return;
    }

    const employerList = await Employer.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'companies',
          foreignField: '_id',
          localField: 'companyId',
          as: 'company',
        },
      },
    ]);
    if (employerList.length === 0) {
      res.status(404).json(errors.notFound);
      return;
    }
    
    const employer = employerList[0];
    // Ensure company is always an object, not null
    if (!employer.company || employer.company.length === 0) {
      employer.company = null;
    } else {
      employer.company = employer.company[0];
    }
    
    res.status(200).json(employer);
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const createEmployer = async (req, res) => {
  try {
    console.log('Creating employer with data:', req.body);
    
    const employer = req.body;
    
    // Set _id from id if provided
    if (employer.id) {
      employer._id = employer.id;
    }

    // Validate required fields
    if (!employer.name || !employer.address) {
      res.status(400).json({ status: 400, message: 'name and address are required' });
      return;
    }

    // Check if company exists if companyId provided
    if (employer.companyId && employer.companyId !== '') {
      try {
        const company = await Company.findById(new Types.ObjectId(employer.companyId));
        if (!company) {
          res.status(404).json({ status: 404, message: 'company does not exist' });
          return;
        }
      } catch (companyErr) {
        console.log('Company lookup error:', companyErr);
        // Continue without company validation if ObjectId is invalid
      }
    }

    // Create employer
    const newEmployer = new Employer(employer);
    const savedEmployer = await newEmployer.save();
    
    console.log('Employer saved:', savedEmployer._id);
    
    // Return simple response
    res.status(201).json(savedEmployer);
  } catch (err) {
    console.log('Create employer error:', err);
    res.status(500).json({ status: 500, message: err.message || 'Internal server error' });
  }
};

const updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req.headers;
    if (user && user != id) {
      res.status(400).json({
        ...errors.badRequest,
        message: 'id should be same as logged in user',
      });
      return;
    }

    const valErr = validationResult(req);
    if (!valErr.isEmpty()) {
      console.error(valErr);
      res.status(400).json({ status: 400, message: valErr.array() });
      return;
    }

    const employer = req.body;
    delete employer.companyId;

    const dbEmployer = await Employer.findById(id);
    if (!dbEmployer) {
      res.status(404).json(errors.notFound);
      return;
    }

    makeRequest('employer.update', { id: dbEmployer._id, data: employer }, async (err, resp) => {
      if (err) {
        console.error(err);
        res.status(500).send(errors.serverError);
        return;
      }

      const result = await Employer.aggregate([
        { $match: { _id: Types.ObjectId(resp._id) } },
        {
          $lookup: {
            from: 'companies',
            foreignField: '_id',
            localField: 'companyId',
            as: 'company',
          },
        },
      ]);

      res.status(200).json(result[0]);
    });
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      res.status(400).json(errors.badRequest);
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const deleteEmployer = async (req, res) => {
  try {
    const { id } = req.params;

    makeRequest('employer.delete', { id }, (err, resp) => {
      if (err) {
        console.error(err);
        res.status(500).send(errors.serverError);
        return;
      }

      if (resp.success) {
        res.status(200).json(null);
      } else {
        res.status(500).json(errors.serverError);
      }
    });
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
  getAllEmployers,
  getEmployerById,
  createEmployer,
  updateEmployer,
  deleteEmployer,
};
