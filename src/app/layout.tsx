import theme from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "1質点系地盤応答解析ツール",
	description: "構造物の地震応答解析と応答スペクトルを計算するツール",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<>
			<meta name="viewport" content="initial-scale=1, width=device-width" />
			<html lang="ja">
				<body>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline enableColorScheme />
							{children}
						</ThemeProvider>
					</AppRouterCacheProvider>
				</body>
			</html>
		</>
	);
}
