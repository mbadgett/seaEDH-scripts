const { parse } = require("csv-parse");
const fs = require("fs");

let winValue = 5;
let drawValue = 1;

function parsePods(parseScoresCallback) {
  let pods = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  let weekTracker = 1;
  fs.createReadStream("./csv/pods.csv")
    .pipe(parse({ delimiter: ",", columns: true, ltrim: true, from_line: 1 }))
    .on("data", function (week) {
      for (const pod in week) {
        if (Object.hasOwnProperty.call(week, pod)) {
          const matchup = week[pod];
          pods[weekTracker].push(
            matchup.replace("Guy, like the word", "Guy like the word")
          );
        }
      }
      weekTracker++;
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      parseScoresCallback(pods);
    });
}

function parseScores(calculateResultsCallback) {
  return function (pods) {
    let players = {};
    fs.createReadStream("./csv/scores.csv")
      .pipe(parse({ delimiter: ",", columns: true, ltrim: true, from_line: 1 }))
      .on("data", function (row) {
        let player = row["Players:"].replace("Guy, like the word", "Guy like the word");
        let playerObj = {
          1: row["Week 1:"],
          2: row["Week 2:"],
          3: row["Week 3:"],
          4: row["Week 4:"],
          5: row["Week 5:"],
          6: row["Week 6:"],
          total: row["Total Points:"],
        };

        players[player] = playerObj;
      })
      .on("error", function (error) {
        console.log(error.message);
      })
      .on("end", function () {
        calculateResultsCallback(players, pods);
      });
  };
}

function calculate(players, pods) {
  console.log("Final weighted score for players:");
  const weightedPlayerScores = {}
  for (const week in pods) {
    const games = pods[week];

    for (game of games) {
	  const playerWinsForWeek = {}
      let podWeight = 0;
      participants = game.split(", ")
	  for (player of participants) {
		playerWinsForWeek[player] = 0
		let playerScore = parseInt(players[player][week]);
		podWeight += parseInt(players[player]["total"])
		let playerWins = Math.floor(playerScore / winValue);
		let playerDraws = (playerScore % winValue) / drawValue;
		if (weightedPlayerScores[player] == undefined) {
			weightedPlayerScores[player] = 0
		}
		playerWinsForWeek[player] = playerWins
	  }
	  for (player of participants) {
		weightedPlayerScores[player] += playerWinsForWeek[player] * podWeight
		// console.log(
		// 	`Week ${
		// 	  week
		// 	} Player: ${player} => wins: ${playerWinsForWeek[player]}, weight: ${podWeight}, cumulative weighted score:${
		// 		weightedPlayerScores[player]
		// 	}`
		//   );
	  }
    }
  }

  var sortedScores = Object.keys(weightedPlayerScores).map(function(player) {
	return [player, weightedPlayerScores[player]];
  }).sort(function(first, second) {
	return second[1] - first[1];
  });
  
  for (score of sortedScores) {
	console.log(
		`Final score for player: ${score[0]} => ${score[1]}`
	  );
  }
}

parsePods(parseScores(calculate));
