// eslint-disable-next-line import/extensions
import { getAllMovies, API_URL } from "./movies-api.js";

export function createMovieElt(movieData) {
  const movieElt = document.createElement("article");
  movieElt.classList.add("movie-item");
  movieElt.innerHTML = `
        <img class="movie-item__poster" src="${API_URL}${movieData.poster}/medium" alt="poster of '${movieData.title}'">
        <div class="movie-item__info">
            <div class="movie-item__title">${movieData.title}</div>
        </div>
    `;
  return movieElt;
}

export function updateMoviesElt(page = 1) {
  const urlSearch = new URLSearchParams();
  urlSearch.set("page", page);
  const listEltMovies = document.querySelector(".movies-list");
  listEltMovies.innerHTML = "";
  const moviesList = document.querySelector(".movies-list");
  // eslint-disable-next-line no-use-before-define
  setLoading();
  let controller = new AbortController();
  let signal = controller.signal;
  // eslint-disable-next-line no-use-before-define
  appendSortToQuery(urlSearch);

  getAllMovies(urlSearch, controller)
    .then((movies) => {
      // eslint-disable-next-line no-use-before-define
      emptyElt(moviesList);
      movies.collection.forEach((movie) => {
        // eslint-disable-next-line no-use-before-define
        updatePaginationElt(movies.pagination);
        listEltMovies.appendChild(createMovieElt(movie));
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
}

export function appendSortToQuery(urlSearchParams) {
  const valueButton = document.querySelector("input[name=sort]:checked").value;
  // console.log(button);
  // return `${res}:asc`;
  if (urlSearchParams instanceof URLSearchParams) {
    urlSearchParams.set("sort", `${valueButton}:asc`);
  }
  console.log(`${valueButton}:asc`);
}

export function setSortButtonsEltsEvents() {
  document.querySelector(".sort").addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "INPUT") {
      updateMoviesElt();
    }
  });
}

export function createPaginationButtonElt(materialIcon, isDisabled, page) {
  const buttonElt = document.createElement("button");
  buttonElt.type = "button";
  buttonElt.classList.add("button");
  buttonElt.disabled = isDisabled;
  buttonElt.addEventListener("click", () => updateMoviesElt(page));
  const spanElt = document.createElement("span");
  spanElt.classList.add("material-symbols-outlined");
  spanElt.innerHTML = materialIcon;
  buttonElt.appendChild(spanElt);
  return buttonElt;
}

export function emptyElt(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

export function updatePaginationElt(pagination) {
  const paginationElt = document.querySelector(".pagination");
  emptyElt(paginationElt);

  paginationElt.appendChild(
    createPaginationButtonElt("first_page", pagination.current === 1, 1),
  );
  paginationElt.appendChild(
    createPaginationButtonElt(
      "navigate_before",
      pagination.current === 1,
      pagination.current - 1,
    ),
  );
  const span = document.createElement("span");
  span.classList.add("pagination__info");
  span.innerHTML = `${pagination.current}/${pagination.last}`;
  paginationElt.appendChild(span);
  paginationElt.appendChild(
    createPaginationButtonElt(
      "navigate_next",
      pagination.current === pagination.last,
      pagination.current + 1,
    ),
  );
  paginationElt.appendChild(
    createPaginationButtonElt(
      "last_page",
      pagination.current === pagination.last,
      pagination.last,
    ),
  );
  if (pagination.last === 1) {
    emptyElt(paginationElt);
  }
  return paginationElt;
}

export function setLoading() {
  const navPagination = document.querySelector(".pagination");
  emptyElt(navPagination);
  const articleMoviesList = document.querySelector(".movies-list");
  const articleLoading = document.createElement("article");
  articleLoading.classList.add("loading");
  articleMoviesList.appendChild(articleLoading);
}
