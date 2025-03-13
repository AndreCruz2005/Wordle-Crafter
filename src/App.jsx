import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SettingsBox from "./Settings";
import PuzzleScreen from "./Puzzle";
import { Route, Routes, useParams } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<SettingsBox />} />
				<Route path="/en/:puzzle" element={<PuzzleScreen lang={"en"} />} />
				<Route path="/pt-br/:puzzle" element={<PuzzleScreen lang={"pt-br"} />} />
				<Route path="*" element={<SettingsBox />} />
			</Routes>
		</>
	);
}

export default App;
