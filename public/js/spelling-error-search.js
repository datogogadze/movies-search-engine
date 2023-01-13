const search_bar = document.querySelector('input[name="search_text"]');

document
  .querySelector('.search_bar_button')
  .addEventListener('click', async (event) => {
    const query = search_bar.value;
    if (!query) return;
    const result = await sendSearchRequest(query);
    if (!result) return;
    const { success, data } = result;
    if (!success) return;
    showResults(data);
  });

const sendSearchRequest = async (query) => {
  const response = await fetch(`/spell?query=${query}`);
  const data = await response.json();
  console.log({ data });
  console.log(data);
  return data;
};

const showResults = async (data) => {
  const data_section = document.querySelector('.data');
  data_section.innerHTML = JSON.stringify(data, null, 4);
};
