import { useEffect, useState } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { encrypt } from "./utils";
import axios from "axios";

function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max));
}

const SettingsBox = ({}) => {
	function getWord() {
		axios
			.get(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${lang}`)
			.then((res) => startGame(res.data[0]))
			.catch((error) => {
				console.error(error);
			});
	}

	function startGame(sw) {
		const key = Math.floor(Math.random() * 9);
		navigate(`/${lang}/${attempts}--${encrypt(sw, key)}--${key}`);
	}

	const [attempts, setAttempts] = useState(6);
	const [length, setLenght] = useState(5);
	const [lang, setLang] = useState("en");
	const [secretWord, setSecretWord] = useState("");
	const navigate = useNavigate();

	return (
		<div id="settings-box">
			<h2>Wordle Crafter</h2>
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
				{" (1 - 12)"}
				<input
					type="number"
					value={attempts}
					min={1}
					max={12}
					onChange={(e) => setAttempts(clamp(e.target.value, 1, 12))}
				></input>
			</label>
			<label>
				{{ en: "Word length", "pt-br": "Tamanho da palavra" }[lang]}
				{" (5 - 12)"}
				<input
					type="number"
					value={length}
					min={5}
					max={12}
					onChange={(e) => setLenght(clamp(e.target.value, 5, 12))}
				></input>
			</label>
			<label>
				{{ en: "Secret word", "pt-br": "Palavra secreta" }[lang]}
				<input
					value={secretWord}
					placeholder={
						{
							en: "Leave blank for random word",
							"pt-br": "Deixe vazio para uma palavra aleatória",
						}[lang]
					}
					onChange={(e) => setSecretWord(e.target.value.toUpperCase())}
				></input>
			</label>
			<button
				onClick={() => {
					if (secretWord) startGame(secretWord);
					else getWord();
				}}
			>
				{{ en: "Play", "pt-br": "Jogar" }[lang]}
			</button>
			<h4 id="credits">
				Made by André Vinícius |{" "}
				<a href="https://github.com/AndreCruz2005/Totally-Original-Word-Game">Github</a>
			</h4>
		</div>
	);
};

export default SettingsBox;
