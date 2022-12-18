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
    const searchInput = document.querySelector('input[name="search_text"]');
    const query = searchInput.value;
    if (!query) return;
    active_search = query;
    const result = await sendSearchRequest(query, 1);
    if (!result) return;
    const { success, num_found, movies } = result;
    if (!success) return;
    active = undefined;
    addPagination(num_found);
    showResults(movies);
  });

const sendSearchRequest = async (query, page) => {
  const response = await fetch(`/search?query=${query}&page=${page}`);
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

let active = undefined;
const addPagination = (num_found) => {
  let num_pages = Math.min(15, Math.ceil(num_found / 10));
  const pagination = document.querySelector('.pagination_section');
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  for (let i = 1; i <= num_pages; i++) {
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.textContent = i;
    a.classList.add('page_number');
    if (i === 1) {
      a.classList.add('active');
      active = a;
    }
    a.addEventListener('click', async (event) => {
      if (a == active) return;
      active.classList.remove('active');
      active = a;
      a.classList.add('active');
      let query = searchInput.value;
      if (!query) {
        if (!active_search) return;
        query = active_search;
        search_bar.value = query;
      }
      const result = await sendSearchRequest(query, i);
      if (!result) return;
      const { success, num_found, movies } = result;
      if (!success) return;
      showResults(movies);
    });
    pagination.appendChild(a);
  }
};

const showResults = (movies) => {
  const movies_div = document.querySelector('.movies');
  while (movies_div.firstChild) {
    movies_div.removeChild(movies_div.firstChild);
  }

  document.querySelector('.suggestions').style.display = 'none';
  document.querySelector('.pagination_movies').style.display = 'block';

  if (movies.length === 0) {
    const notFound = document.createElement('p');
    notFound.classList.add('not_found');
    notFound.innerText = 'Nothing found...';
    movies_div.appendChild(notFound);
    return;
  }

  movies.forEach((movie) => {
    const movie_div = document.createElement('div');
    movie_div.classList.add('movie');
    const title = document.createElement('div');
    title.innerText = `Title: ${movie.title}`;
    movie_div.appendChild(title);
    const year = document.createElement('div');
    year.innerText = `Year: ${movie.year}`;
    movie_div.appendChild(year);
    const genres = document.createElement('div');
    genres.innerText = `Genres: ${
      movie.genres ? movie.genres.join(', ') : 'No genres info'
    }`;
    movie_div.appendChild(genres);
    const cast = document.createElement('div');
    cast.innerText = `Cast: ${
      movie.cast ? movie.cast.join(', ') : 'No cast info'
    }`;
    movie_div.appendChild(cast);
    movies_div.appendChild(movie_div);
  });
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
    li.classList.add('suggestion');
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
