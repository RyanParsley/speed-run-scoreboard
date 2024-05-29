// Handle for where scores will be placed
const scoreHolder = document.getElementById("scores");

// Currently hard coded list of teams to include.

/**
 *
 * ## Frontend
 *
 * Corbin Edwards
 * Austen Solvie
 * Jonathan Hogate
 * Matt Couts
 * Stephen Reich
 */
const contestants = [
  {
    name: "Edwards",
    scoreLocation: "data/day1-frontend-edwards-corbin-score.json",
  },
  {
    name: "Solvie",
    scoreLocation: "data/day1-frontend-solvie-austen-score.json",
  },
  {
    name: "Hogate",
    scoreLocation: "data/day1-frontend-hogate-jonathan-score.json",
  },
  {
    name: "Couts",
    scoreLocation: "data/day1-frontend-couts-matt-score.json",
  },
  {
    name: "Reich",
    scoreLocation: "data/day1-frontend-reich-stephen-score.json",
  },
];

/*
 * ## Backend
 *
 * Benjamin Osowiecki (Java)
 * Charles Frais (.NET)
 * Ryan Green (Java)
 * Samuel Reagan (Java)
 *
 **/

/*
const contestants = [
  {
    name: "Osowieki",
    scoreLocation: "data/day1-backend-osowiecki-benjamin-score.json",
  },
  {
    name: "Frais",
    scoreLocation: "data/day1-backend-osowiecki-frais-charles-score.json",
  },
  {
    name: "Green",
    scoreLocation: "data/day1-backend-osowiecki-green-ryan-score.json",
  },
  {
    name: "Reagan",
    scoreLocation: "data/day1-backend-osowiecki-reagan-samuel-score.json",
  },
];

 **/
/**
 * Create a div per team to be injected into the DOM
 * @param { { name: string, scoreLocation: string }[] } contestants
 */
const renderScores = (contestants) => {
  return contestants
    .map(
      ({ name }) =>
        `
        <div data-team="${name}">
          <h1>${name}</h1>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th class="value">Value</th>
              </tr>
            </thead>
            <tbody id="${name}-list"></tbody>
          </table>
        </div>

       `,
    )
    .join("");
};

// create a score placeholder per team
scoreHolder?.innerHTML && (scoreHolder.innerHTML = renderScores(contestants));

// Handles to the table set up for each team's score data
const scoreElements = contestants.map(({ name }) => ({
  name,
  element: document.getElementById(`${name}-list`),
}));

/**
 * Initialize the app's state
 * @type { { team: string, testScore: string, lintModifier: string, total: string}[] }
 */
let scores = [];

// Fetch many json files and update the dom to store them.
const fetchScores = async () => {
  return contestants.map(async ({ name: team, scoreLocation }) => {
    fetch(`${scoreLocation}`)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(
            "Looks like there was a problem. Status Code: " + response.status,
          );
          return;
        }
        response.json().then(function ({ testScore, lintModifier, total }) {
          // Amend to shared state
          scores = [
            ...scores,
            {
              team,
              testScore,
              lintModifier,
              total,
            },
          ];
          // render state to DOM
          updateList(scores);
        });
      })
      .catch(function (err) {
        console.error("Fetch Error :-S", err);
      });
  });
};

/**
 * Inject scores to the approprate table
 * @param { { team: string, testScore: string, lintModifier: string, total: string}[] } scores
 */
const updateList = (scores) => {
  scores.forEach((score) => {
    const scoreElement = scoreElements.find(
      (element) => element.name == score.team,
    );
    scoreElement?.element &&
      (scoreElement.element.innerHTML = renderList([
        { title: "Test Score", value: score.testScore },
        { title: "Lint Modifier", value: score.lintModifier },
        { title: "Total", value: score.total },
      ]));
  });
};

/**
 * Define DOM to wrap around data
 * @param { {title: string, value: string}[] } items
 */
const renderList = (items = []) =>
  items
    .map(
      ({ title = "", value = "" }) =>
        `
          <tr>
            <td>${title}</td>
            <td class="value">${value}</td>
         </tr>
       `,
    )
    .join("");

// Fetch data and inject it in the DOM
fetchScores();
