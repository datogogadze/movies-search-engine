const express = require('express');
const router = express.Router();
const DbConnection = require('../db/index');

const sampleCore = DbConnection.getSampleCore();

router.get('/', async (req, res) => {
  try {
    const { term } = req.query;
    const q = sampleCore.query().q(term);
    const result = await sampleCore.doQuery('suggest', q);
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
