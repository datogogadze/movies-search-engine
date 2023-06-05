let active_search = '';

const search_bar = document.querySelector('input[name="search_text"]');
search_bar.addEventListener('input', async (event) => {
  const term = search_bar.value;
  if (term) {
    const { success, suggestions } = await sendSuggestionsRequest(term);
    if (!success) return;
    showSuggestions(suggestions);
  }
});

document
  .querySelector('.search_bar_button')
  .addEventListener('click', async (event) => {
    const query = search_bar.value;
    if (!query) return;
    active_search = query;
    const result = await sendSearchRequest(query, PAGE_SIZE, 1);
    if (!result) return;
    const { success, num_found, movies } = result;
    if (!success) return;
    active = 1;
    addPagination(num_found);
    showResults(movies);
  });

const sendSearchRequest = async (query, page_size, page) => {
  const response = await fetch(
    `/search?query=${query}&page_size=${page_size}&page=${page}`
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const sendSuggestionsRequest = async (term) => {
  const response = await fetch(`/search/suggestions?term=${term}`);
  const data = await response.json();
  console.log(data);
  return data;
};

let active = 1;
const PAGE_SIZE = 10;
const addPagination = (num_found) => {
  let num_pages = Math.ceil(num_found / 10);
  const pagination = document.querySelector('.pagination_section');
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  if (num_found <= PAGE_SIZE) {
    return;
  }

  const previous_button = document.createElement('button');
  previous_button.classList.add('btn', 'btn-primary');
  previous_button.innerHTML = '<i class="bi bi-arrow-left"></i> Previous';
  previous_button.addEventListener('click', async (event) => {
    if (active === 1) return;
    active -= 1;
    updatePage(active);
  });

  const next_button = document.createElement('button');
  next_button.classList.add('btn', 'btn-primary', 'ms-3');
  next_button.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
  next_button.addEventListener('click', async (event) => {
    if (active === num_pages) return;
    active += 1;
    updatePage(active);
  });

  pagination.appendChild(previous_button);
  pagination.appendChild(next_button);
};

const updatePage = async (page) => {
  let query = search_bar.value;
  if (!query) {
    if (!active_search) return;
    query = active_search;
    search_bar.value = query;
  }
  const result = await sendSearchRequest(query, PAGE_SIZE, page);
  if (!result) return;
  const { success, num_found, movies } = result;
  if (!success) return;
  showResults(movies);
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
});
