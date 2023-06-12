const express = require('express');
const router = express.Router();
const DbConnection = require('../db/index');

const sampleCore = DbConnection.getSampleCore();

router.get('/', async (req, res) => {
  try {
    let { query, page, page_size, from, to } = req.query;

    const q = sampleCore
      .query()
      .q(query)
      .facet({ on: true })
      .fq({ field: 'year', value: `[${from} TO ${to}]` })
      .start((page - 1) * page_size)
      .rows(page_size);

    const result = await sampleCore.search(q);

    const genresList = result.facet_counts.facet_fields.genres;
    const genres = {};
    for (let i = 0; i < genresList.length; i += 2) {
      const genre = genresList[i];
      const count = genresList[i + 1];
      genres[genre] = count;
    }

    return res.json({
      success: true,
      num_found: result.response.numFound,
      movies: result.response.docs,
      genres,
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
