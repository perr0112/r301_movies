export const API_URL = "http://movies-api";

export function getAllMovies(urlSearchParams, abortController) {
  // eslint-disable-next-line no-param-reassign
  abortController = new AbortController();
  const res = abortController.signal;
  if (!(urlSearchParams instanceof URLSearchParams)) {
    return Promise.reject(
      new Error(
        "UrlSearchParams n'est pas un paramètre d'instance de URLSearchParams",
      ),
    );
  }
  console.log(`${API_URL}/movies?${urlSearchParams.toString()}`, { res });
  return fetch(`${API_URL}/movies?${urlSearchParams.toString()}`, { res }).then(
    // eslint-disable-next-line no-use-before-define
    extractCollectionAndPagination,
  );
}

export function posterUrl(imagePath, size) {
  return `${API_URL}${imagePath}/${size || "original"}`;
}

export function extractPaginationFromHeaders(response) {
  const current = response.headers.get("Pagination-Current-Page");
  const last = response.headers.get("Pagination-Last-Page");
  return {
    current: parseInt(current, 10),
    last: parseInt(last, 10),
  };
}

export function extractCollectionAndPagination(response) {
  return response.json().then((collection) => ({
    pagination: extractPaginationFromHeaders(response),
    collection,
  }));
}
