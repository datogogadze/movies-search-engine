const express = require('express');
const router = express.Router();
const DbConnection = require('../db/index');

const sampleCore = DbConnection.getSampleCore();

const page_size = 10;

router.get('/', async (req, res) => {
  try {
    const { query, page } = req.query;
    const result = await sampleCore.doQuery(
      'query',
      `defType=dismax&qf=title^10 year cast^2 genres&df=catch_all&start=${
        (page - 1) * page_size
      }&rows=${page_size}&q=${query}`.replaceAll(' ', '%20')
    );

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

router.get('/suggestions', async (req, res) => {
  try {
    const { term } = req.query;
    const result = await sampleCore.doQuery(
      'suggest',
      `suggest=true&suggest.build=false&suggest.dictionary=mySuggester&wt=json&suggest.q=${term}`.replaceAll(
        ' ',
        '%20'
      )
    );

    const suggestions = result.suggest.mySuggester[term].suggestions;

    return res.json({
      success: true,
      suggestions,
    });
  } catch (err) {
    console.log({ err });
    return res.json({
      success: false,
      suggestions: [],
      message: err.message,
    });
  }
});

module.exports = router;
