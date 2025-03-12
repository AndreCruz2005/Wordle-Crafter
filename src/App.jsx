import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import sendIcon from "./assets/send.svg";
import "./App.css";

function App() {
	const [puzzleMode, setPuzzleMode] = useState(false);
	const [attempts, setAttempts] = useState(6);
	const [length, setLenght] = useState(5);
	const [lang, setLang] = useState("en");

	const SettingsBox = () => {
		return (
			<div id="settings-box">
				<h2>{{ en: "Settings", "pt-br": "Configurações" }[lang]}</h2>
				<label>
					{{ en: "Language", "pt-br": "Idioma" }[lang]}
					<select
						value={lang}
						onChange={(e) => {
							setLang(e.target.value);
						}}
					>
						<option value="en">English</option>
						<option value="pt-br">Português</option>
					</select>
				</label>
				<label>
					{{ en: "Attempts", "pt-br": "Tentativas" }[lang]}
					<input
						type="number"
						value={attempts}
						min={1}
						max={12}
						onChange={(e) => setAttempts(e.target.value)}
					></input>
				</label>
				<label>
					{{ en: "Word length", "pt-br": "Tamanho da palavra" }[lang]}
					<input
						type="number"
						value={length}
						min={5}
						max={12}
						onChange={(e) => setLenght(e.target.value)}
					></input>
				</label>
				<button onClick={() => setPuzzleMode(true)}>
					{{ en: "Play", "pt-br": "Jogar" }[lang]}
				</button>
			</div>
		);
	};

	const PuzzleScreen = () => {
		const [secretWord, setSecretWord] = useState("");
		const [attemptedWord, setAttemptedWord] = useState("");
		const [gameState, setGameState] = useState("ONGOING");

		const getWord = () => {
			axios
				.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${lang}`)
				.then((res) => {
					setSecretWord(res.data[0].toUpperCase());
				})
				.catch((error) => {
					console.error(error);
				});
		};

		class Guess {
			word;
			status;
			classes;
			constructor() {
				this.word = Array.from({ length: length }).fill("");
				this.classes = Array.from({ length: length }).fill("EMPTY");
				this.status = "OPEN";
			}
			guessWord(word, secret) {
				for (let i = 0; i < length; i++) {
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
		const [guesses, setGuesses] = useState([]);

		useEffect(() => {
			getWord();
			let arr = [];
			for (let i = 0; i < attempts; i++) {
				const instance = new Guess();
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

		function handleGuessSubmit() {
			if (attemptedWord.length != length) {
				return;
			}
			const newArr = [...guesses];
			for (const i in newArr) {
				if (newArr[i].status == "OPEN") {
					newArr[i].guessWord(attemptedWord.toUpperCase(), secretWord);
					setGuesses(newArr);
					break;
				}
			}

			setAttemptedWord("");

			// Check game state
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

		function shareResults() {
			let text = `${
				{
					en: "My results from TotallyOriginalWordGame, can you do better?",
					"pt-br": "Meus resultados do TotallyOriginalWordGame, você pode fazer melhor?",
				}[lang]
			}\n`;
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
								<button onClick={() => setPuzzleMode(false)}>
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
			</div>
		);
	};

	return puzzleMode ? <PuzzleScreen /> : <SettingsBox />;
}

export default App;
