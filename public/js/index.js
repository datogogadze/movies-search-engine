let active_search = '';

document
  .querySelector('.search_bar_button')
  .addEventListener('click', async (event) => {
    const searchInput = document.querySelector('input[name="search_text"]');
    const query = searchInput.value;
    if (!query) return;
    active_search = query;
    const result = await sendRequest(query, 1);
    if (!result) return;
    const { success, num_found, movies } = result;
    if (!success) return;
    active = undefined;
    addPagination(num_found);
    showResults(movies);
  });

const sendRequest = async (query, page) => {
  const response = await fetch(`/search?query=${query}&page=${page}`);
  const data = await response.json();
  console.log(data);
  return data;
};

let active = undefined;
const addPagination = (num_found) => {
  const num_pages = Math.ceil(num_found / 10);
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
      const searchInput = document.querySelector('input[name="search_text"]');
      let query = searchInput.value;
      if (!query) {
        if (!active_search) return;
        query = active_search;
        searchInput.value = query;
      }
      const result = await sendRequest(query, i);
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
