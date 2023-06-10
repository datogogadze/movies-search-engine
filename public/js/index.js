let active_search = '';
let active = 1;
let num_pages = 1;
const PAGE_SIZE = 10;

const search_bar = document.querySelector('input[name="search_text"]');
const from_date = document.querySelector('input[name="from_date"]');
const to_date = document.querySelector('input[name="to_date"]');

search_bar.addEventListener('input', async (event) => {
  const term = search_bar.value;
  if (term) {
    const { success, suggestions } = await sendSuggestionsRequest(term);
    if (!success) return;
    showSuggestions(suggestions);
  }
});

from_date.addEventListener('input', async (event) => {
  const from = from_date.value;
  const to = to_date.value;
  if (validateNumber(from) && validateNumber(to)) {
    fireSearch(from, to, false, 1);
  }
});

to_date.addEventListener('input', async (event) => {
  const from = from_date.value;
  const to = to_date.value;
  if (validateNumber(from) && validateNumber(to)) {
    fireSearch(from, to, false, 1);
  }
});

document
  .querySelector('.search_bar_button')
  .addEventListener('click', async (event) => {
    fireSearch(from_date.value, to_date.value, true, 1);
  });

function validateNumber(input) {
  var numberRegex = /^\d+$/;
  return (
    numberRegex.test(input) &&
    Number(input) >= 1900 &&
    Number(input) <= new Date().getFullYear()
  );
}

const sendSearchRequest = async (query, page_size, page, from, to) => {
  if (!validateNumber(from)) {
    from = 1900;
    from_date.value = 1900;
  }

  if (!validateNumber(to)) {
    to = new Date().getFullYear();
    to_date.value = new Date().getFullYear();
  }

  const response = await fetch(
    `/search?query=${query}&page_size=${page_size}&page=${page}&from=${from}&to=${to}`
  );
  const data = await response.json();
  return data;
};

const sendSuggestionsRequest = async (term) => {
  const response = await fetch(`/suggest?term=${term}`);
  const data = await response.json();
  return data;
};

const showPagination = (num_movies_found) => {
  if (num_movies_found <= PAGE_SIZE) {
    document.querySelector('.pagination_section').style.display = 'none';
    return;
  }
  document.querySelector('.pagination_section').style.display = 'flex';
  num_pages = Math.ceil(num_movies_found / PAGE_SIZE);
  const pageNumber = document.querySelector('.page-number');
  pageNumber.textContent = `${active} / ${num_pages}`;
};

const previous_button = document.querySelector('.previous-button');
previous_button.addEventListener('click', async (event) => {
  if (active === 1) return;
  active -= 1;
  await fireSearch(from_date.value, to_date.value, false, active);
});

const next_button = document.querySelector('.next-button');
next_button.addEventListener('click', async (event) => {
  if (active === num_pages) return;
  active += 1;
  await fireSearch(from_date.value, to_date.value, false, active);
});

const fireSearch = async (from, to, searchClicked, page) => {
  const query = search_bar.value;
  if (!query || (searchClicked && active_search === query)) return;
  if (searchClicked) {
    active_search = query;
  }
  const result = await sendSearchRequest(
    active_search,
    PAGE_SIZE,
    page,
    from,
    to
  );

  if (!result) return;
  const { success, num_found, movies } = result;

  if (!success) return;
  active = page;
  showResults(movies);
  showPagination(num_found);
};

const showResults = (movies) => {
  const movies_div = document.querySelector('.movies');
  while (movies_div.firstChild) {
    movies_div.removeChild(movies_div.firstChild);
  }

  document.querySelector('.suggestions').style.display = 'none';
  document.querySelector('.pagination_movies').style.display = 'block';

  if (movies.length === 0) {
    const movie_div = document.createElement('div');
    movie_div.classList.add('card', 'movie', 'mb-3');
    const card_body = document.createElement('div');
    card_body.classList.add('card-body');
    const not_found = document.createElement('h5');
    not_found.classList.add('card-title');
    not_found.innerText = `Nothing found...`;
    card_body.appendChild(not_found);
    movie_div.appendChild(card_body);
    movies_div.appendChild(movie_div);
  } else {
    movies.forEach((movie) => {
      const movie_div = document.createElement('div');
      movie_div.classList.add('card', 'movie', 'mb-3');
      const card_body = document.createElement('div');
      card_body.classList.add('card-body');
      const title = document.createElement('h5');
      title.classList.add('card-title');
      title.innerText = `Title: ${movie.title}`;
      card_body.appendChild(title);
      const year = document.createElement('p');
      year.classList.add('card-text');
      year.innerText = `Year: ${movie.year}`;
      card_body.appendChild(year);
      const genres = document.createElement('p');
      genres.classList.add('card-text');
      genres.innerText = `Genres: ${
        movie.genres ? movie.genres.join(', ') : 'No genres info'
      }`;
      card_body.appendChild(genres);
      const cast = document.createElement('p');
      cast.classList.add('card-text');
      cast.innerText = `Cast: ${
        movie.cast ? movie.cast.join(', ') : 'No cast info'
      }`;
      card_body.appendChild(cast);
      movie_div.appendChild(card_body);
      movies_div.appendChild(movie_div);
    });
  }
};

const showSuggestions = (suggestions) => {
  const ul = document.querySelector('.suggestions');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  ul.style.display = 'block';
  document.querySelector('.pagination_movies').style.display = 'none';

  if (suggestions.length === 0) return;

  suggestions.forEach((suggestion) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'suggestion', 'text-start');
    li.appendChild(document.createTextNode(suggestion.term));
    li.addEventListener('mousedown', (event) => {
      search_bar.value = suggestion.term;
      document.querySelector('.search_bar_button').click();
    });
    li.addEventListener('focus', function () {
      this.style.backgroundColor = 'red';
    });
    ul.appendChild(li);
  });
};

search_bar.addEventListener('focusout', (event) => {
  document.querySelector('.suggestions').style.display = 'none';
  document.querySelector('.pagination_movies').style.display = 'block';
  // showPagination();
});
