const express = require('express');
const router = express.Router();
const DbConnection = require('../db/index');

const testCore = DbConnection.getTestCore();

router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    const result = await testCore.doQuery('query', `q=${query}`);
    const data = result.response.docs;

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.json({
      success: false,
      data: [],
      message: err.message,
    });
  }
});

module.exports = router;
