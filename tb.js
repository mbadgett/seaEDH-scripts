//Note find replace pasted excel data with find:"([\w])(\s+)([0-9]{1,2})" replace:"$1,$3"

let snackPods = [
  `chaotrix,2
kaliri_,6
kingdurkle,2
Snackzones#0923,6`,
  `Btots#8381,0
Ulthyr,5
Isaiah,0
Snackzones#0923,15`,
  `Snackzones#0923,10
subzero719,5
abaddon#2296,0
kaliri_,5`,
  `Snackzones#0923,0
Marcus,0
kingdurkle,15
redxross,5`,
  `chief_vibe,0
Btots#8381,0
Snackzones#0923,10
chaotrix,10`,
  `Mathew V,7
Isaiah,2
Ponzusaus#0001,2
Snackzones#0923,7`,
];

let cloudPods = [
`Darkcloud06#2459,5
Isaiah,5
redxross,5
subzero719,5`,
`abaddon#2296,0
chaotrix,10
Darkcloud06#2459,10
Mathew V,0`,
`Ulthyr,2
Ponzusaus#0001,7
kingdurkle,2
Darkcloud06#2459,7`,
`Mathew V,15
Btots#8381,1
abaddon#2296,1
Darkcloud06#2459,1`,
`KujoFD,0
Isaiah,5
Darkcloud06#2459,15
Marcus,0`,
`redxross,0
Darkcloud06#2459,10
chaotrix,5
kingdurkle,5`
]

let finalScores = {
  "Darkcloud06#2459": 48,
  "Snackzones#0923": 48,
  chief_vibe: 44,
  subzero719: 38,
  chaotrix: 37,
  kingdurkle: 34,
  "abaddon#2296": 30,
  Isaiah: 29,
  "Mathew V": 26,
  kaliri_: 25,
  redxross: 23,
  "Ponzusaus#0001": 20,
  Ulthyr: 18,
  KujoFD: 15,
  "Btots#8381": 12,
  Marcus: 9,
};

let winValue = 5
let drawValue = 1
let playersToPods = {
	"Darkcloud06#2459": cloudPods,
	"Snackzones#0923": snackPods
}
console.log("Final weighted score for players:")
for (const player in playersToPods) {
	let playerWeightedWinScore = 0;
	let playersPods = playersToPods[player]

	console.log(`Player: ${player}`)
	for (let i = 0; i < playersPods.length; i++) {
		const game = playersPods[i]
		let podWeight = 0;
		let playerScore = 0;
		for (const score of game.split("\n")) {
		  res = score.split(",");
	  
		  if (res[0] == player) {
			  playerScore = res[1]
		  } else {
			// Use the name of the player to look up their final score and create a weight for the pod
			podWeight += finalScores[res[0]];
		  }
		}
		playerWins = Math.floor(playerScore / winValue)
		playerDraws = (playerScore%5) / drawValue
		playerWeightedWinScore += playerWins * podWeight
		console.log(`Week ${i+1} => wins: ${playerWins}, weight: ${podWeight}, weighted score:${playerWins * podWeight}`)
	}
	console.log(`Final score:${playerWeightedWinScore}\n`)
}
