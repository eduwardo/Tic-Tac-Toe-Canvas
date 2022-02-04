function init() {
	// remove preloadFont
	document.getElementById('fontPreload').remove();
	// get canvas
	const canvas = document.getElementById('TicTacToe');
	canvas.height = 330;
	canvas.width = 330;
	const ctx = canvas.getContext('2d');
	// space between innerWindow and canvas
	let rect = document.getElementById('TicTacToe').getBoundingClientRect();
	// resize window
	window.addEventListener('resize', () => {
		rect = document.getElementById('TicTacToe').getBoundingClientRect();
	});
	// mouse events & styles
	const mouse = {x: 0, y: 0};
	let cursor = document.getElementById("TicTacToe");
	// mouse events
	document.addEventListener('mousemove', (event) => callCheckEvent(event, 'hover'));
	document.addEventListener('click', (event) => callCheckEvent(event, 'click'));
	// call event check function
	const callCheckEvent = (event, message) => {
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		// check mouse only over canvas
		if (mouse.x >= rect.left + 10 && mouse.x <= rect.right - 10
			&& mouse.y >= rect.top + 10 && mouse.y <= rect.bottom - 10) {
			game.checkEvent(mouse, message);
		}
	};
	// audio theme
	const soundtrack = {
		changeScreen: new Audio(soundtrack_176666238),
		gameStarted: new Audio(soundtrack_114248243),
		playerX: new Audio(soundtrack_227830187),
		playerO: new Audio(soundtrack_227830190)
	}

	/*========================= Table Settings ==========================*/

	let map = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
	let winCombo = [
		[ 0 , 1 , 2 ], [ 3 , 4 , 5 ],
		[ 6 , 7 , 8 ], [ 0 , 3 , 6 ],
		[ 1 , 4 , 7 ], [ 2 , 5 , 8 ],
		[ 0 , 4 , 8 ], [ 2 , 4 , 6 ]
	];

	/*========================= Init Settings ==========================*/

	let X = 1, O = -1;
	let player;
	let playerOne, playerTwo, AI;
	let score = {playerOne: 0, playerTwo: 0, AI: 0};

	/*========================= Game ==========================*/

	function TicTacToe() {
		// == private drawing variables ==
		let cellSize = 110;
		let centerWidth = canvas.width / 2;
		let marginTop = canvas.height / 3;
		// == game settings ==
		this.isGameStart = false;
		this.isIntro = true;
		this.isChoosePlayer = false;
		this.isChooseMode = false;
		this.isGameResults = false;
		this.mode = '';
		this.turn = playerOne;
		this.turnCount = 1;
		this.firstTurn = true;

		/*========================== Game Condition Scenario ==========================*/

		this.checkEvent = (mouse, message) => {
			let posX = centerWidth + rect.left;
			let posY = marginTop + rect.top;
			let playButton = {x: posX - 50, y: posY + 130, x1: posX + 50, y1: posY + 170},
				xButton = {x: posX - 50, y: posY + 130, x1: posX - 20, y1: posY + 170},
				oButton = {x: posX + 25, y: posY + 130, x1: posX + 60, y1: posY + 170},
				singleButton = {x: posX - 70, y: posY + 125, x1: posX + 75, y1: posY + 145},
				multiButton = {x: posX - 65, y: posY + 165, x1: posX + 70, y1: posY + 185},
				quitButton = {x: posX - 99, y: posY + 129, x1: posX - 15, y1: posY + 161},
				nextButton = {x: posX + 20, y: posY + 129, x1: posX + 104, y1: posY + 161};

			if (this.isIntro) {
				if (message === 'hover') {
					if (mouse.x >= playButton.x && mouse.x <= playButton.x1 && mouse.y >= playButton.y && mouse.y <= playButton.y1) {
						this.intro();
						this.drawText(centerWidth, marginTop + 160, 'white', "#ffe936", 12, 'bold', '30px', 'Audiowide', 'PLAY');
						cursor.style.cursor = "pointer";
					} else {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						this.drawBackground();
						this.drawTitle();
						this.drawText(centerWidth, marginTop + 160, 'white', "#b041ff", 12, 'bold', '30px', 'Audiowide', 'PLAY');
						cursor.style.cursor = "default";
					}
				}
				if (message === 'click') {
					if (mouse.x >= playButton.x && mouse.x <= playButton.x1 && mouse.y >= playButton.y && mouse.y <= playButton.y1) {
						// go to Choose Player screen
						this.isIntro = false;
						if (!this.isChoosePlayer) {
							this.playSound('changeScreen');
							setTimeout(() => {
								this.isChoosePlayer = true;
								this.choosePlayer();
							}, 200);
						}
					}
				}
			}
			if (this.isChoosePlayer) {
				if (message === 'hover') {
					if (mouse.x >= xButton.x && mouse.x <= xButton.x1 && mouse.y >= xButton.y && mouse.y <= xButton.y1) {
						this.choosePlayer();
						this.drawText(centerWidth - 40, marginTop + 160, 'white', '#ffe936', 12, 'bold', '28px', 'Audiowide', 'X');
						cursor.style.cursor = "pointer";
					}
					else if (mouse.x >= oButton.x && mouse.x <= oButton.x1 && mouse.y >= oButton.y && mouse.y <= oButton.y1) {
						this.choosePlayer();
						this.drawText(centerWidth + 40, marginTop + 160, 'white', '#ffe936', 12, 'bold', '28px', 'Audiowide', 'O');
						cursor.style.cursor = "pointer";
					} else {
						this.choosePlayer();
						cursor.style.cursor = "default";
					}
				}
				if (message === 'click') {
					// choose player 'X' or 'Y'
					if (mouse.x >= xButton.x && mouse.x <= xButton.x1 && mouse.y >= xButton.y && mouse.y <= xButton.y1) {
						this.isChoosePlayer = false;
						// the choice is 'X'
						playerOne = X;
						playerTwo = playerOne === X ? O : X;
						if (!this.isChoosePlayer) {
							this.playSound('changeScreen');
							setTimeout(() => {
								this.isChooseMode = true;
								this.chooseMode();
							}, 200);
						}
					}
					else if (mouse.x >= oButton.x && mouse.x <= oButton.x1 && mouse.y >= oButton.y && mouse.y <= oButton.y1) {
						this.isChoosePlayer = false;
						// the choice is 'O'
						playerOne = O;
						playerTwo = playerOne === O ? X : O;
						if (!this.isChoosePlayer) {
							this.playSound('changeScreen');
							setTimeout(() => {
								this.isChooseMode = true;
								this.chooseMode();
							}, 200);
						}
					}
				}
			}
			if (this.isChooseMode) {
				if (message === 'hover') {
					if (mouse.x >= singleButton.x && mouse.x <= singleButton.x1 && mouse.y >= singleButton.y && mouse.y <= singleButton.y1) {
						this.chooseMode();
						this.drawText(centerWidth, marginTop + 140, 'white', "#ffe936", 12, '600', '15px', 'Audiowide', 'SINGLE PLAYER');
						cursor.style.cursor = "pointer";
					}
					else if (mouse.x >= multiButton.x && mouse.x <= multiButton.x1 && mouse.y >= multiButton.y && mouse.y <= multiButton.y1) {
						this.chooseMode();
						this.drawText(centerWidth, marginTop + 180, 'white', "#ffe936", 12, '600', '15px', 'Audiowide', 'MULTIPLAYER');
						cursor.style.cursor = "pointer";
					} else {
						this.chooseMode();
						cursor.style.cursor = "default";
					}
				}
				if (message === 'click') {
					// choose mode 'single player' or 'multi player'
					if (mouse.x >= singleButton.x && mouse.x <= singleButton.x1 && mouse.y >= singleButton.y && mouse.y <= singleButton.y1) {
						// single player
						this.isChooseMode = false;
						this.mode = 'singlePlayer';
						// set AI as second player
						AI = playerTwo;
						if (!this.isGameStart) {
							this.playSound('gameStarted', 200);
							setTimeout(() => {
								if (this.firstTurn) {
									this.whoStart();
								}
							}, 200);
						}
					}
					else if (mouse.x >= multiButton.x && mouse.x <= multiButton.x1 && mouse.y >= multiButton.y && mouse.y <= multiButton.y1) {
						// multi player
						this.isChooseMode = false;
						this.mode = 'multiPlayer';
						if (!this.isGameStart) {
							this.playSound('gameStarted', 200);
							setTimeout(() => {
								if (this.firstTurn) {
									this.whoStart();
								}
							}, 200);
						}
					}
				}
			}
			if (this.isGameStart) {
				if (message === 'click') {
					if (map[this.getCellOnClick(mouse)] === 0) {
						this.playTurn();
					} else {
						// move set already done
					}
				}
			}
			if (this.isGameResults) {
				if (message === 'hover') {
					if (mouse.x >= quitButton.x && mouse.x <= quitButton.x1 && mouse.y >= quitButton.y && mouse.y <= quitButton.y1) {
						cursor.style.cursor = "pointer";
					}
					else if (mouse.x >= nextButton.x && mouse.x <= nextButton.x1 && mouse.y >= nextButton.y && mouse.y <= nextButton.y1) {
						cursor.style.cursor = "pointer";
					} else {
						cursor.style.cursor = "default";
					}
				}
				if (message === 'click') {
					if (mouse.x >= quitButton.x && mouse.x <= quitButton.x1 && mouse.y >= quitButton.y && mouse.y <= quitButton.y1) {
						this.quitGame();
						// quit game button
					}
					else if (mouse.x >= nextButton.x && mouse.x <= nextButton.x1 && mouse.y >= nextButton.y && mouse.y <= nextButton.y1) {
						this.nextMatch();
						// next match button
					}
				}
			}
		};

		/*========================== Game core Logic ==========================*/

		this.whoStart = () => {
			if (this.mode === 'singlePlayer') {
				// boost AI turn + 04
				this.turn = Math.round(Math.random() + 0.4 ) ? AI : playerOne;
			}
			else if (this.mode === 'multiPlayer') {
				this.turn = Math.round(Math.random()) ? playerOne : playerTwo;
			}
			player = this.turn;
			this.drawWhoStart();
		};

		this.drawWhoStart = () => {
			let playerStart = (this.turn === playerOne) ? 'PLAYER 1' : (this.mode === 'singlePlayer') ? 'COMPUTER' : 'PLAYER 2';
			this.drawBoard();
			this.fillBoard();
			this.drawText(centerWidth, marginTop + 45, '#fff', "#d8abff", 12, 'bold', '34px', 'Audiowide', 'Will Start');
			this.drawText(centerWidth, marginTop + 80, '#fbff92', "#d8b4ff", 12, 'bold', '17px', 'Audiowide', playerStart);
			this.startGame();
		};

		this.startGame = () => {
			setTimeout(() => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				this.drawBoard();
				this.fillBoard();
				this.isGameStart = true;
				if (this.turn === AI && this.mode === 'singlePlayer') {
					this.playTurn();
				}
				else {
					this.firstTurn = false;
				}
			}, 2500);
		};

		this.playTurn = () => {
			if (this.mode === 'multiPlayer') {
				this.playPlayerMoveSound();
				if (this.turn === playerOne) {
					this.playerOne();
				}
				else if (this.turn === playerTwo) {
					this.playerTwo();
				}
			}
			else if (this.mode === 'singlePlayer') {
				if (this.turn === playerOne && this.isGameStart) {
					this.playPlayerMoveSound();
					this.playerOne();
					if (this.turn === AI && this.isGameStart) {
						setTimeout(()=> {
							player === X ? this.playSound('playerX') : this.playSound('playerO');
							this.computerPlay();
						}, 400);
					}
				} else if (this.turn === AI && this.isGameStart && this.firstTurn) {
					this.firstTurn = false;
					setTimeout(()=> {
						this.playPlayerMoveSound();
						this.computerPlay();
					}, 400);
				}
			}
		};

		this.playerOne = () => {
			player = playerOne;
			map[this.getCellOnClick(mouse)] = player;
			this.fillBoard();
			this.nextTurn();
		};

		this.playerTwo = () => {
			player = playerTwo;
			map[this.getCellOnClick(mouse)] = player;
			this.fillBoard();
			this.nextTurn();
		};

		this.computerPlay = () => {
			let setMove = Math.floor(Math.random() * map.length),
				corners = [0, 2, 6, 8];

			const processNextMove = () => {
				let moveSet = winCombo.map(combo => {
					return {
						cpu: {
							winMoves: combo.map(i => { return { [i]: map[i] } }),
							score: combo.reduce((value, i) => { return map[i] === AI ? value + 5 : map[i] === 0 ? value : value - 100 }, 0 )
						},
						opponent: {
							winMoves: combo.map(i => { return { [i]: map[i] } }),
							score: combo.reduce((value, i) => { return map[i] === playerOne ? value + 5 : map[i] === 0 ? value : value - 100 }, 0 ) 
						}
					}
				});
				
				let bestMoveCPU = { score: -Infinity };
				let bestMoveOpponent = { score: -Infinity };
				
				moveSet.forEach((move) => {
					let freeSlotMoveCPU = move.cpu.winMoves.some((slot) => Object.values(slot)[0] === 0);
					let freeSlotMoveOpponent = move.opponent.winMoves.some((slot) => Object.values(slot)[0] === 0);
					bestMoveCPU = bestMoveCPU.score < move.cpu.score && freeSlotMoveCPU ? move.cpu : bestMoveCPU;
					bestMoveOpponent = bestMoveOpponent.score < move.opponent.score && freeSlotMoveOpponent ? move.opponent : bestMoveOpponent;
				});
				
				let nextPossibleMovesCPU = bestMoveCPU.winMoves.filter((slot) => Object.values(slot)[0] !== playerOne && Object.values(slot)[0] !== AI).map((slot) => Object.keys(slot)[0]);
				let nextPossibleMovesOpponent = bestMoveOpponent.winMoves.filter((slot) => Object.values(slot)[0] !== playerOne && Object.values(slot)[0] !== AI).map((slot) => Object.keys(slot)[0]);

				return { bestMoveCPU, bestMoveOpponent, nextPossibleMovesCPU, nextPossibleMovesOpponent }
			}
			
			let { bestMoveCPU, bestMoveOpponent, nextPossibleMovesCPU, nextPossibleMovesOpponent } = processNextMove();

			if (this.turnCount === 1) {
				setMove = corners[Math.floor(Math.random() * corners.length)];
			} 
			else {
				if (bestMoveOpponent.score <= 5 || bestMoveCPU.score === 10) {
					setMove = nextPossibleMovesCPU[Math.floor(Math.random() * nextPossibleMovesCPU.length)];
				}
				else {
					setMove = nextPossibleMovesOpponent[Math.floor(Math.random() * nextPossibleMovesOpponent.length)];
				}
			}

			map[setMove] = player;
			this.fillBoard();
			this.nextTurn();
		};

		this.nextTurn = () => {
			playerTwo = (this.mode === 'singlePlayer') ? AI : playerTwo;
			player = player === playerOne ? playerTwo : playerOne;
			this.turn = player;
			this.checkWin();
			this.turnCount++;
		};

		this.checkWin = () => {
			playerTwo = (this.mode === 'singlePlayer') ? AI : playerTwo;
			let arrOne = new Set(map.map((num, index) => num === playerOne ? index : ''));
			let arrTwo = new Set(map.map((num, index) => num === playerTwo ? index : ''));
			for (let i = 0; i < winCombo.length; i++) {
				let playerOneWon = winCombo[i].every(num => arrOne.has(num));
				let playerTwoWon = winCombo[i].every(num => arrTwo.has(num));
				if (playerOneWon) {
					// winner is player one
					this.isGameStart = false;
					setTimeout(() => {
						this.isGameResults = true;
						score.playerOne += 1;
						let plName = (this.mode === 'singlePlayer') ? 'YOU' : 'PLAYER 1';
						this.gameResults(plName);
					}, 250);
					break;
				}
				if (playerTwoWon) {
					// winner is player two
					this.isGameStart = false;
					if (this.mode === 'singlePlayer') {
						score.AI += 1;
						setTimeout(() => {
							this.isGameResults = true;
							this.gameResults('COMPUTER');
						}, 250);
					}
					else if (this.mode === 'multiPlayer') {
						score.playerTwo += 1;
						setTimeout(() => {
							this.isGameResults = true;
							this.gameResults('PLAYER 2');
						}, 250);
					}
					break;
				}
				if (i === winCombo.length - 1 && this.turnCount === 9) {
					if (!playerTwoWon && !playerTwoWon) {
						this.isGameStart = false;
						setTimeout(() => {
							this.isGameResults = true;
							this.gameResults('Draw');
						}, 250);
					}
				}
			}
		};

		/*========================== Game Results Scenario ==========================*/

		this.gameResults = (message) => {
			this.drawBackground();
			this.drawBoard();
			this.fillBoard();
			this.drawModal();
			this.drawStatus(message);
			this.quitButton();
			this.nextButton();
		};

		this.nextMatch = () => {
			map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.turnCount = 1;
			this.turn = playerOne;
			this.firstTurn = true;
			setTimeout(() => {
				if (this.firstTurn) {
					this.isGameResults = false;
					this.whoStart();
					cursor.style.cursor = "default";
				}
			}, 500);
		};

		this.quitGame = () => {
			map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.turnCount = 1;
			this.firstTurn = true;
			this.turn = playerOne;
			setTimeout(() => {
				score = {playerOne: 0, playerTwo: 0, AI: 0};
				this.isGameStart = false;
				this.isIntro = true;
				this.isChoosePlayer = false;
				this.isChooseMode = false;
				this.isGameResults = false;
				this.mode = '';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				this.drawBackground();
				this.intro();
				cursor.style.cursor = "default";
			}, 250)
		};

		this.drawStatus = (message) => {
			if (message === 'Draw') {
				this.drawText(centerWidth, marginTop, '#FFC107', "#FFEB3B", 12, 'bold', '33px', 'Audiowide', message);
				this.drawText(centerWidth, marginTop + 30, '#a57aef', "#d8b4ff", 12, 'bold', '17px', 'Audiowide', 'Try again!');
				this.drawScores();
			} else {
				this.drawText(centerWidth, marginTop, '#FFC107', "#FFEB3B", 12, 'bold', '33px', 'Audiowide', 'Winner');
				this.drawText(centerWidth, marginTop + 30, '#a57aef', "#d8b4ff", 12, 'bold', '17px', 'Audiowide', message);
				this.drawScores();
			}
		};

		this.drawScores = () => {
			let playerOneName = (this.mode === 'singlePlayer') ? 'YOU' : 'PLAYER 1';
			let playerTwoName = (this.mode === 'singlePlayer') ? 'COMPUTER' : 'PLAYER 2';
			let playerOneScore = score.playerOne;
			let playerTwoScore = (this.mode === 'singlePlayer') ? score.AI : score.playerTwo;
			this.drawText(centerWidth, marginTop + 60, '#8e5be6', "#d8b4ff", 12, 'bold', '20px', 'Audiowide', 'SCORE');
			this.drawText(centerWidth, marginTop + 85, '#a57aef', "#d8b4ff", 12, 'bold', '14px', 'Audiowide', `${playerOneName}:`);
			this.drawText(centerWidth + 60, marginTop + 85, '#FFC107', "#FFEB3B", 12, 'bold', '14px', 'Audiowide', playerOneScore);
			this.drawText(centerWidth, marginTop + 105, '#a57aef', "#d8b4ff", 12, 'bold', '14px', 'Audiowide', `${playerTwoName}:`);
			this.drawText(centerWidth + 60, marginTop + 105, '#FFC107', "#FFEB3B", 12, 'bold', '14px', 'Audiowide', playerTwoScore);
		};

		this.drawModal = () => {
			ctx.fillStyle = 'rgba(0,0,0,0.5)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			let rectSet = {
				x: 50,
				y: 50,
				width: canvas.width - 100,
				height: canvas.height - 100,
				radius: 7,
				strokeWidth: 1,
				shadowWidth: 33,
				color: 'rgba(255,255,255,1)',
				strokeColor: '#fff',
				shadowColor: 'rgba(78,57,228,1)',
			};
			this.drawRectRounded(rectSet.x, rectSet.y, rectSet.width, rectSet.height,
				rectSet.radius, rectSet.strokeWidth, rectSet.shadowWidth, rectSet.color,
				rectSet.strokeColor, rectSet.shadowColor);
		};

		this.quitButton = () => {
			let rectSet = {
				x: 65,
				y: canvas.height - 93,
				width: 78,
				height: 28,
				radius: 5,
				strokeWidth: 1,
				shadowWidth: 3,
				color: '#4c4c4c',
				strokeColor: '#4c4c4c',
				shadowColor: 'rgba(0,0,0,0.5)',
			};
			this.drawRectRounded(rectSet.x, rectSet.y, rectSet.width, rectSet.height,
				rectSet.radius, rectSet.strokeWidth, rectSet.shadowWidth, rectSet.color,
				rectSet.strokeColor, rectSet.shadowColor);
			this.drawText(103, canvas.height - 72, '#fff', "rgba(0,0,0,0.3)", 12, 'normal', '22px', 'Audiowide', 'Quit');
		};

		this.nextButton = () => {
			let rectSet = {
				x: 185,
				y: canvas.height - 93,
				width: 78,
				height: 28,
				radius: 5,
				strokeWidth: 1,
				shadowWidth: 3,
				color: '#9b62ff',
				strokeColor: '#9b62ff',
				shadowColor: 'rgba(83, 24, 187, 0.8)',
			};
			this.drawRectRounded(rectSet.x, rectSet.y, rectSet.width, rectSet.height,
				rectSet.radius, rectSet.strokeWidth, rectSet.shadowWidth, rectSet.color,
				rectSet.strokeColor, rectSet.shadowColor);
			this.drawText(canvas.width - 105, canvas.height - 72, '#fff', "#7c65e0", 12, 'normal', '22px', 'Audiowide', 'Next');
		};

		/*========================== Intro Scenario ==========================*/

		this.intro = () => {
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			this.drawBackground();
			this.drawTitle();
			this.drawText(centerWidth, marginTop + 160, 'white', "#b041ff", 12, 'bold', '30px', 'Audiowide', 'PLAY');
		};

		this.drawTitle = () => {
			let centerW = (canvas.width / 2);
			let marginTop = canvas.height / 3;
			let titleGr = ctx.createLinearGradient(canvas.width / 3, canvas.height / 9, canvas.width / 2 - 50, canvas.height / 1.8);
			titleGr.addColorStop(0,"#e100ff");
			titleGr.addColorStop(0.4,"#3622ff");
			titleGr.addColorStop(1,"#e100ff");
			ctx.textAlign = 'center';
			ctx.save();
			ctx.fillStyle = titleGr;
			ctx.font = 'bold 70px Bangers';
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'rgba(255,255,255,0.4';
			ctx.strokeText('Tic', centerW, marginTop);
			ctx.fillText('Tic', centerW, marginTop);
			ctx.strokeText('Tic', centerW, marginTop);
			ctx.font = 'bold 32px Bangers';
			ctx.lineWidth = 1.4;
			ctx.strokeText('Tac', centerW, marginTop + 35);
			ctx.fillText('Tac', centerW, marginTop + 35);
			ctx.strokeText('Tac', centerW, marginTop + 35);
			ctx.font = 'bold 50px Bangers';
			ctx.lineWidth = 2.3;
			ctx.strokeText('Toe', centerW, marginTop + 85);
			ctx.fillText('Toe', centerW, marginTop + 85);
			ctx.strokeText('Toe', centerW, marginTop + 85);
			ctx.restore();
		};

		/*========================== Choose player symbol  Scenario ==========================*/

		this.choosePlayer = () => {
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			this.drawBackground();
			this.drawTitle();
			this.drawText(centerWidth - 40, marginTop + 160, 'white', '#b041ff', 12, 'bold', '28px', 'Audiowide', 'X');
			this.drawText(centerWidth, marginTop + 160, 'white', "#b041ff", 12, '', '20px', 'Audiowide', 'or');
			this.drawText(centerWidth + 40, marginTop + 160, 'white', '#b041ff', 12, 'bold', '28px', 'Audiowide', 'O');
		};

		/*========================== Choose game mode Scenario ==========================*/

		this.chooseMode = () => {
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			this.drawBackground();
			this.drawTitle();
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(0,0,0,0.1)';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.moveTo(centerWidth - 50, marginTop + 155);
			ctx.lineTo(centerWidth + 50, marginTop + 155);
			ctx.stroke();
			ctx.restore();
			this.drawText(centerWidth, marginTop + 140, 'white', "#b041ff", 12, '600', '15px', 'Audiowide', 'SINGLE PLAYER');
			this.drawText(centerWidth, marginTop + 180, 'white', "#b041ff", 12, '600', '15px', 'Audiowide', 'MULTIPLAYER');
		};

		/*========================== Game core Scenario ==========================*/

		this.drawBoard = () => {
			ctx.save();
			ctx.strokeStyle = 'rgba(0,0,0,0.2)';
			ctx.lineWidth = 6;
			ctx.lineCap = 'round';
			ctx.beginPath();
			// vertical
			ctx.moveTo(cellSize, 10);
			ctx.lineTo(cellSize, canvas.height - 10);
			ctx.moveTo(cellSize * 2, 10);
			ctx.lineTo(cellSize * 2, canvas.height - 10);
			// horizontal
			ctx.moveTo(10, cellSize);
			ctx.lineTo(canvas.width - 10, cellSize);
			ctx.moveTo(10, cellSize * 2);
			ctx.lineTo(canvas.width - 10, cellSize * 2);
			// draw
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		};

		this.fillBoard = () => {
			cursor.style.cursor = "default";
			this.drawBackground();
			this.drawBoard();
			for (let i = 0; i < map.length; i++) {
				let {x, y} = this.getCell(i);
				switch (map[i]) {
					case X:
						this.drawX(x, y);
						break;
					case O:
						this.drawO(x, y);
						break;
				}
			}
		};

		this.drawX = (x, y) => {
			x = x + 55;
			y = y + 55;
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.lineCap = 'round';
			ctx.lineWidth = 6;
			ctx.moveTo(x - 28, y - 28);
			ctx.lineTo(x + 28, y + 28);
			ctx.moveTo(x + 28, y - 28);
			ctx.lineTo(x - 28, y + 28);
			ctx.stroke();
		};

		this.drawO = (x, y) => {
			x = x + 55;
			y = y + 55;
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 6;
			ctx.arc(x, y, 30, Math.PI * 2, 0, false);
			ctx.stroke();
		};

		/*========================== Standard drawing functions ==========================*/

		this.drawText = (x, y, color, colorBlur, sizeBlur, fontWeight, fontSize, fontType, text) => {
			ctx.save();
			ctx.lineWidth = 3;
			ctx.shadowColor = colorBlur;
			ctx.shadowBlur = sizeBlur;
			ctx.fillStyle = color;
			ctx.font = `${fontWeight} ${fontSize} ${fontType}`;
			ctx.fillText(text, x, y);
			ctx.restore();
		};

		this.drawRectRounded = (x, y, width, height, radius, strokeWidth, shadowWidth, color, strokeColor, shadowColor) => {
			ctx.save();
			ctx.shadowBlur = shadowWidth;
			ctx.lineWidth = strokeWidth;
			ctx.fillStyle = color;
			ctx.shadowColor = shadowColor;
			ctx.strokeStyle = strokeColor;
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y + height - radius);
			ctx.arcTo(x, y + height, x + radius, y + height, radius);
			ctx.lineTo(x + width - radius, y + height);
			ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
			ctx.lineTo(x + width, y + radius);
			ctx.arcTo(x + width, y, x + width - radius, y, radius);
			ctx.lineTo(x + radius, y);
			ctx.arcTo(x, y, x, y + radius, radius);
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		};

		this.drawBackground = () => {
			let bgGr = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			bgGr.addColorStop(0,"#bc62ff");
			bgGr.addColorStop(0.4,"#9244ff");
			bgGr.addColorStop(1,"#746aff");
			ctx.fillStyle = bgGr;
			ctx.fillRect(0,0, canvas.width, canvas.height);
		};

		/*========================== Get cells ==========================*/

		this.getCell = (cell) => {
			return {x: (cell % 3) * cellSize, y: Math.floor(cell / 3) * cellSize};
		};

		this.getCellOnClick = (mouse) => {
			return (Math.floor((mouse.x - rect.left) / cellSize) % 3) + (Math.floor((mouse.y - rect.top) / cellSize) * 3);
		};

		/*========================== Set sound ==========================*/

		this.playPlayerMoveSound = () => {
			player === X ? this.playSound('playerX') : this.playSound('playerO');
		}
		
		this.playSound = (type, ms = 100) => {
			setTimeout(() => {
				
				const play = (type) => {
					soundtrack[type].pause();
					soundtrack[type].currentTime = 0; 
					soundtrack[type].play();
				};

				switch(type) {
					case 'changeScreen': 
						play(type);
						break;
					case 'gameStarted': 
						soundtrack.changeScreen.pause();
						play(type);
						break;
					case 'playerX': 
						soundtrack.playerO.pause();
						soundtrack.gameStarted.pause();
						play(type);
						break;
					case 'playerO': 
						soundtrack.playerX.pause();
						soundtrack.gameStarted.pause();
						play(type);
						break;
					default:
						break;
				}
			}, ms);
		}
	}

	let game = new TicTacToe();
	game.intro();
}
// preload fonts
(() => document.getElementById('main').insertAdjacentHTML('afterbegin', `<span id="fontPreload">.<span class="second">.</span></span>`))();