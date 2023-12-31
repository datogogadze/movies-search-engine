let active_search = '';
let active = 1;
let num_pages = 1;
let active_genres = [];
const PAGE_SIZE = 12;

const search_bar = document.querySelector('input[name="search_text"]');
const from_date = document.querySelector('input[name="from_date"]');
const to_date = document.querySelector('input[name="to_date"]');

search_bar.addEventListener('input', async (event) => {
  const term = search_bar.value;
  if (term) {
    const { success, suggestions } = await sendSuggestionsRequest(term);
    if (!success) return;
    showSuggestions(suggestions);
  } else {
    document.querySelector('.suggestions').style.display = 'none';
  }
});

from_date.addEventListener('input', async (event) => {
  const from = from_date.value;
  const to = to_date.value;
  if (validateNumber(from) && validateNumber(to)) {
    fireSearch(from, to, false, 1, active_genres);
  }
});

to_date.addEventListener('input', async (event) => {
  const from = from_date.value;
  const to = to_date.value;
  if (validateNumber(from) && validateNumber(to)) {
    fireSearch(from, to, false, 1, active_genres);
  }
});

document
  .querySelector('.search_bar_button')
  .addEventListener('click', async (event) => {
    fireSearch(from_date.value, to_date.value, true, 1, active_genres);
  });

function validateNumber(input) {
  var numberRegex = /^\d+$/;
  return (
    numberRegex.test(input) &&
    Number(input) >= 1900 &&
    Number(input) <= new Date().getFullYear()
  );
}

const sendSearchRequest = async (
  query,
  page_size,
  page,
  from,
  to,
  selected_genres
) => {
  if (!validateNumber(from)) {
    from = 1900;
    from_date.value = 1900;
  }

  if (!validateNumber(to)) {
    to = new Date().getFullYear();
    to_date.value = new Date().getFullYear();
  }

  const body = {
    query,
    page_size,
    page,
    from,
    to,
    selected_genres,
  };

  const response = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

const sendSuggestionsRequest = async (term) => {
  const response = await fetch(`/suggest?term=${term}`);
  const data = await response.json();
  return data;
};

const showPagination = (num_movies_found) => {
  const pagination_section = document.querySelector('.pagination_section');

  while (pagination_section.firstChild) {
    pagination_section.removeChild(pagination_section.firstChild);
  }

  if (num_movies_found <= PAGE_SIZE) {
    pagination_section.classList.remove('mb-3');
    return;
  }

  pagination_section.classList.add('mb-3');

  num_pages = Math.ceil(num_movies_found / PAGE_SIZE);

  const previous_button = document.createElement('button');
  previous_button.classList.add(
    'previous-button',
    'btn',
    'btn-outline-primary',
    'btn-sm'
  );
  previous_button.innerHTML = '<i class="bi bi-arrow-left"></i>';

  const page_number = document.createElement('div');
  page_number.classList.add(
    'page-number',
    'btn',
    'btn-secondary',
    'btn-sm',
    'ms-2'
  );
  page_number.textContent = `${active} / ${num_pages}`;

  const next_button = document.createElement('button');
  next_button.classList.add(
    'next-button',
    'btn',
    'btn-outline-primary',
    'btn-sm',
    'ms-2'
  );
  next_button.innerHTML = '<i class="bi bi-arrow-right"></i>';

  pagination_section.appendChild(previous_button);
  pagination_section.appendChild(page_number);
  pagination_section.appendChild(next_button);

  previous_button.addEventListener('click', async (event) => {
    if (active === 1) return;
    active -= 1;
    await fireSearch(
      from_date.value,
      to_date.value,
      false,
      active,
      active_genres
    );
  });

  next_button.addEventListener('click', async (event) => {
    if (active === num_pages) return;
    active += 1;
    await fireSearch(
      from_date.value,
      to_date.value,
      false,
      active,
      active_genres
    );
  });
};

const fireSearch = async (from, to, searchClicked, page, selected_genres) => {
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
    to,
    selected_genres
  );

  if (!result) return;
  const { success, num_found, movies, genres } = result;

  if (!success) return;
  active = page;
  showResults(movies);
  showPagination(num_found);
  showGenres(genres, selected_genres);
};

const showGenres = (genres, selected_genres) => {
  const genres_list = document.querySelector('.genres-list');
  while (genres_list.firstChild) {
    genres_list.removeChild(genres_list.firstChild);
  }

  Object.keys(genres).forEach((genre) => {
    const genre_div = document.createElement('div');
    genre_div.classList.add('list-group-item', 'genre');
    genre_div.innerText = `${genre} (${genres[genre]})`;
    genres_list.appendChild(genre_div);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = genre;
    if (selected_genres.includes(genre)) {
      checkbox.checked = true;
    }
    checkbox.addEventListener('change', handleGenreSelection);
    genre_div.appendChild(checkbox);
  });
};

const handleGenreSelection = (event) => {
  if (event.target.checked) {
    active_genres.push(event.target.value);
  } else {
    active_genres = active_genres.filter((g) => event.target.value !== g);
  }

  fireSearch(from_date.value, to_date.value, false, active, active_genres);
};

const showResults = (movies) => {
  const movies_div = document.querySelector('.movies');
  while (movies_div.firstChild) {
    movies_div.removeChild(movies_div.firstChild);
  }

  document.querySelector('.suggestions').style.display = 'none';

  if (movies.length === 0) {
    const nothing_found = document.createElement('div');
    nothing_found.classList.add('nothing-found');
    nothing_found.innerText = 'Nothing found...';
    movies_div.appendChild(nothing_found);
  } else {
    movies.forEach((movie) => {
      const movie_div = document.createElement('div');
      movie_div.classList.add('card', 'movie');
      const card_body = document.createElement('div');
      card_body.classList.add('card-body');
      const title = document.createElement('h6');
      title.classList.add('card-title');
      title.innerText = `${movie.title}`;
      card_body.appendChild(title);
      const year = document.createElement('div');
      year.classList.add('card-text');
      year.innerText = `Year: ${movie.year}`;
      card_body.appendChild(year);
      const genres = document.createElement('div');
      genres.classList.add('card-text');
      genres.innerText = `${
        movie.genres ? movie.genres.join(', ') : 'No genres info'
      }`;
      card_body.appendChild(genres);
      const cast = document.createElement('div');
      cast.classList.add('card-text');
      cast.innerText = `Cast: ${
        movie.cast ? movie.cast.join(', ') : 'No cast info'
      }`;
      // card_body.appendChild(cast);
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
});
