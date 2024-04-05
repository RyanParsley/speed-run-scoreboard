// Handle for where scores will be placed
const scoreHolder = document.getElementById("scores");

// Currently hard coded list of teams to include.
const contestants = [
  {
    name: "Ryan's Test Project with a long name",
    scoreLocation: "https://ryanparsley.github.io/speed-run-fork/score.json",
  },
  {
    name: "StubOut 2024",
    scoreLocation:
      "https://storage.googleapis.com/jslc1refspeedruncdn01/2024-05-skill-up/scoreboard/data/stubOut2024-score.json",
  },
  { name: "team-b", scoreLocation: "data/team-b-score.json" },
  { name: "team-c", scoreLocation: "data/team-c-score.json" },
  { name: "team-d", scoreLocation: "data/team-d-score.json" },
  { name: "team-e", scoreLocation: "data/team-e-score.json" },
  { name: "team-f", scoreLocation: "data/team-f-score.json" },
];

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

// Adjust the app link based on if we're in dev mode or not.
const appUrl = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://localhost:4200/"
  : "https://ryanparsley.github.io/speed-run/speed-run/browser/";

// wire up a link to the demo app
let outbound = document?.getElementById("outbound");
outbound && (outbound["href"] = appUrl);

/**
 * Initialize the app's state
 * @type { { team: string, testScore: string, timeScore: string, lintModifier: string, total: string}[] }
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
        response.json().then(function ({
          testScore,
          timeScore,
          lintModifier,
          total,
        }) {
          // Amend to shared state
          scores = [
            ...scores,
            {
              team,
              testScore,
              timeScore,
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
 * @param { { team: string, testScore: string, timeScore: string, lintModifier: string, total: string}[] } scores
 */
const updateList = (scores) => {
  scores.forEach((score) => {
    const scoreElement = scoreElements.find(
      (element) => element.name == score.team,
    );
    scoreElement?.element &&
      (scoreElement.element.innerHTML = renderList([
        { title: "Test Score", value: score.testScore },
        { title: "Time Score", value: score.timeScore },
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
