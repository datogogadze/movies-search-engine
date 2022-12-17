const express = require('express');
const router = express.Router();
const DbConnection = require('../db/index');

const sampleCore = DbConnection.getSampleCore();

const page_size = 10;

router.get('/', async (req, res) => {
  try {
    const { query, page } = req.query;

    const q = sampleCore
      .query()
      .q(query)
      .qf('title^5 year cast^2 genres')
      .df('catch_all')
      .start((page - 1) * page_size)
      .rows(10);
    const result = await sampleCore.search(q);
    const movies = result.response.docs;

    return res.json({
      success: true,
      num_found: result.response.numFound,
      movies,
    });
  } catch (err) {
    return res.json({
      success: false,
      num_found: 0,
      movies: [],
      message: err.message,
    });
  }
});

module.exports = router;
