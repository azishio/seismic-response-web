"use client";

import { createTheme } from "@mui/material";
import { Noto_Sans_JP } from "next/font/google";

const noto = Noto_Sans_JP({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	palette: {
		mode: "light",
	},
	typography: {
		fontFamily: noto.style.fontFamily,
	},
});

export default theme;
