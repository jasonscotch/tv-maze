"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $episodesList = $("#episodes-list");
const $searchForm = $("#search-form");

const noImgUrl = 'https://tinyurl.com/tv-missing';

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const url = `http://api.tvmaze.com/search/shows?q=${term}`;
  const res = await axios.get(url);
   
  
  return res.data.map(result => {
    const show = result.show;
    console.log(show);
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.original : noImgUrl,
    };
    
  });

  
}



/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `
          <div data-show-id="${show.id}" class="Show col-md-8 col-lg-4 mb-4">
            <div class="card bg-secondary p-3">  
              <img src="${show.image}" class="card-img-top w-75">
              <div class="media-body">
                <h5 class="card-title text-light">${show.name}</h5>
                <p class="card-text text-light">${show.summary}</p>
                
                <button type="button" class="btn btn-info btn-sm Show-getEpisodes" data-toggle="modal" data-target="#exampleModal">
                Episodes
                </button>

              </div>
            </div>
          </div>
    
      `);

    $showsList.append($show);  }
}
 

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);
  console.log(res);
  return res.data.map(result => {
    
    return {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number,
    };
    
  });

 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const $item = $(
      `<li class="list-group-item bg-light">
        ${episode.name} (season ${episode.season}, episode ${episode.number})
     </li>
    `);

    $episodesList.append($item);  }
      
      // $episodesArea.show();
 }

async function getEpisodesForDisplay(e){ 
  const showId = $(e.target).closest(".Show").attr("data-show-id");

  // const showId = $(e.target).closest(".Show").attr("data-show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
};

$showsList.on('click', '.Show-getEpisodes', getEpisodesForDisplay);
// $('.Show-getEpisodes').on('click', '.Show-getEpisodes', getEpisodesForDisplay);




// {/* <button class="btn btn-info btn-sm Show-getEpisodes">
//                   Episodes
//                 </button> */}

