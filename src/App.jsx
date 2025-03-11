import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";

function App() {
	const [puzzleMode, setPuzzleMode] = useState(false);
	const [attempts, setAttempts] = useState(6);
	const [length, setLenght] = useState(5);
	const [lang, setLang] = useState("en");

	const SettingsBox = () => {
		return (
			<div>
				<h2>{{ en: "Settings", "pt-br": "Configurações" }[lang]}</h2>
				<label>
					{{ en: "Attempts", "pt-br": "Tentativas" }[lang]}
					<input type="number" value={attempts} onChange={(e) => setAttempts(e.target.value)}></input>
				</label>
				<label>
					{{ en: "Word length", "pt-br": "Tamanho da palavra" }[lang]}
					<input type="number" value={length} onChange={(e) => setLenght(e.target.value)}></input>
				</label>
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
				<button onClick={() => setPuzzleMode(true)}>{{ en: "Play", "pt-br": "Jogar" }[lang]}</button>
			</div>
		);
	};

	const PuzzleScreen = () => {
		const [secretWord, setSecretWord] = useState("");
		const getWord = () => {
			axios
				.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${lang}`)
				.then((res) => {
					setSecretWord(res.data[0]);
				})
				.catch((error) => {
					console.error(error);
				});
		};

		class Guess {
			word;
			status;
			constructor() {
				this.word = Array.from({ length: length }).fill("");
				this.status = "OPEN";
			}
			guessWord(word) {
				for (let i = 0; i < length; i++) {
					this.word[i] = word[i];
					if (this.word == secretWord) {
						this.status = "CORRECT";
					} else {
						this.status = "INCORRECT";
					}
				}
			}
		}
		const [guesses, setGuesses] = useState([]);

		useEffect(() => {
			getWord();
		}, []);

		const WordRow = () => {};

		return (
			<>
				<div>
					{Array.from({ length: attempts }).map((_, index) => (
						<div key={index}>Attempt {index + 1}</div>
					))}
				</div>
			</>
		);
	};

	return puzzleMode ? <PuzzleScreen /> : <SettingsBox />;
}

export default App;
