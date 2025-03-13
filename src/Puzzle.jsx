import { useEffect, useState } from "react";
import sendIcon from "./assets/send.svg";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "./utils";

const PuzzleScreen = ({ lang }) => {
	const { puzzle } = useParams();
	const [attemptedWord, setAttemptedWord] = useState("");
	const [gameState, setGameState] = useState("ONGOING");
	const [guesses, setGuesses] = useState([]);
	const [tries, setTries] = useState(0);

	const [attempts, crypt, key] = puzzle.split("--");
	const secretWord = decrypt(crypt, key).toUpperCase();

	const navigate = useNavigate();

	class Guess {
		length;
		word;
		status;
		classes;
		constructor() {
			this.length = secretWord.length;
			this.word = Array.from({ length: this.length }).fill("");
			this.classes = Array.from({ length: this.length }).fill("EMPTY");
			this.status = "OPEN";
		}
		guessWord(word, secret) {
			for (let i = 0; i < this.length; i++) {
				this.word[i] = word[i];

				this.classes[i] =
					word[i] == secret[i] ? "RIGHT" : secret.includes(word[i]) ? "PRESENT" : "AUSENT";
				if (this.classes.includes("PRESENT") || this.classes.includes("AUSENT")) {
					this.status = "CLOSED";
				} else {
					this.status = "CORRECT";
				}
			}
		}
	}

	useEffect(() => {
		// Create guesses objects
		let arr = [];
		for (let i = 0; i < attempts; i++) {
			const instance = new Guess(secretWord);
			arr.push(instance);
		}
		setGuesses(arr);
	}, []);

	const WordRow = ({ guessInstance }) => {
		return (
			<div className="word-row">
				{guessInstance.word.map((ch, idx) => {
					return (
						<div className={guessInstance.classes[idx]} key={idx}>
							{ch}
						</div>
					);
				})}
			</div>
		);
	};

	// Function that gets called when the user submits a guess for the puzzle
	function handleGuessSubmit() {
		if (attemptedWord.length != secretWord.length) {
			return;
		}
		const newArr = [...guesses];
		for (const i in newArr) {
			if (newArr[i].status == "OPEN") {
				newArr[i].guessWord(attemptedWord.toUpperCase(), secretWord);
				setGuesses(newArr);
				setTries(tries + 1);
				break;
			}
		}

		setAttemptedWord("");

		// Check if the game should continue, the game will end if there is one correct guess
		// or all guesses have closed
		const checkGameState = () => {
			for (const guess of guesses) {
				if (guess.status == "CORRECT") {
					return "WON";
				} else if (guess.status == "OPEN") {
					return "ONGOING";
				}
			}
			return "LOST";
		};
		setGameState(checkGameState());
	}

	// Function to create the shareable text
	function shareResults() {
		let text = `${
			{
				en: "My results from Wordle Crafter, can you do better?",
				"pt-br": "Meus resultados do Wordle Crafter, você pode fazer melhor?",
			}[lang]
		}\n${tries}/${attempts}\n`;
		for (const guess of guesses) {
			if (guess.status != "OPEN") {
				for (const cls of guess.classes) {
					text += { AUSENT: "🟥", PRESENT: "🟨", RIGHT: "🟩" }[cls];
				}
			} else break;

			text += "\n";
		}
		text += "\n";
		text += window.location.href;
		return text;
	}

	return (
		<div id="puzzle-screen">
			<div id="puzzle-grid">
				{guesses.map((it, idx) => {
					return <WordRow key={idx} guessInstance={it} />;
				})}
			</div>

			<div id="end-of-game-box">
				{gameState != "ONGOING" ? (
					<>
						<p>
							{
								{
									en: `YOU ${gameState}! THE WORD WAS `,
									"pt-br": `VOCÊ ${gameState == "WON" ? "VENCEU" : "PERDEU"}! A PALAVRA ERA `,
								}[lang]
							}
							<span id="revealed">{`${secretWord}`}</span>
						</p>
						<div id="end-of-game-buttons">
							<button
								onClick={() => {
									navigate("/");
								}}
							>
								{{ en: "AGAIN", "pt-br": "DE NOVO" }[lang]}
							</button>
							<button
								onClick={(e) => {
									navigator.clipboard.writeText(shareResults());
								}}
							>
								{{ en: "COPY RESULTS", "pt-br": "COPIAR RESULTADOS" }[lang]}
							</button>
						</div>
					</>
				) : null}
			</div>
			<div id="input-box">
				<input
					disabled={gameState != "ONGOING"}
					placeholder={{ en: "Guess the word", "pt-br": "Advinhe a palavra" }[lang]}
					value={attemptedWord}
					onChange={(e) => {
						setAttemptedWord(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.repeat) return;
						if (e.key == "Enter") handleGuessSubmit();
					}}
				></input>
				<button onClick={handleGuessSubmit}>
					<img src={sendIcon} width={50} height={50}></img>
				</button>
			</div>
			<h4 id="credits">
				Made by André Vinícius |{" "}
				<a href="https://github.com/AndreCruz2005/Totally-Original-Word-Game">Github</a>
			</h4>
		</div>
	);
};

export default PuzzleScreen;
