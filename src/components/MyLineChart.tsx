import { Download } from "@mui/icons-material";
import {
	Button,
	FormControlLabel,
	IconButton,
	Slider,
	Stack,
	Switch,
	Tooltip,
} from "@mui/material";
import {
	ChartsClipPath,
	ChartsGrid,
	ChartsXAxis,
	ChartsYAxis,
	LinePlot,
	MarkPlot,
	ResponsiveChartContainer,
} from "@mui/x-charts";
import React, { useEffect, useId, useState } from "react";

export function MyLineChart({
	x,
	y,
	xLabel,
	yLabel,
}: {
	x: number[];
	y: number[];
	xLabel: string;
	yLabel: string;
}) {
	const id = useId();
	const clipPathId = `${id}-clip-path`;
	const [xLimits, setXLimits] = useState([x[0], x[x.length - 1]]);
	useEffect(() => {
		setXLimits([x[0], x[x.length - 1]]);
	}, [x, y]);

	const [xLog, setXLog] = useState(false);
	const [yLog, setYLog] = useState(false);

	const handleChange = (_event: Event, newValue: number | number[]) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		setXLimits([
			Math.min(newValue[0], newValue[1]),
			Math.max(newValue[0], newValue[1]),
		]);
	};

	function downloadCSV() {
		const csv = x
			.map((xi, i) => `${xi.toFixed(3)},${y[i]}`)
			.filter((_, i) => xLimits[0] <= x[i] && x[i] <= xLimits[1])
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "chart.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<Stack marginX={2} alignItems={"center"} border="gray 1px solid">
			<ResponsiveChartContainer
				series={[
					{
						data: y,
						type: "line",
						showMark: false,
					},
				]}
				yAxis={[
					{
						scaleType: yLog ? "log" : "linear",
						label: yLabel,
					},
				]}
				xAxis={[
					{
						data: x,
						min: xLimits[0],
						max: xLimits[1],
						label: xLabel,
						scaleType: xLog ? "log" : "linear",
					},
				]}
				height={400}
				margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
			>
				<ChartsGrid horizontal />
				<g clipPath={`url(#${clipPathId})`}>
					<LinePlot />
				</g>
				<ChartsXAxis />
				<ChartsYAxis />
				<MarkPlot />
				<ChartsClipPath id={clipPathId} />
			</ResponsiveChartContainer>
			<Slider
				value={xLimits}
				onChange={handleChange}
				valueLabelDisplay="auto"
				min={x[0]}
				max={x[x.length - 1]}
				style={{ width: "90%" }}
				step={0.001}
				sx={{ mt: 2 }}
			/>

			<Stack direction="row" spacing={5}>
				<FormControlLabel
					control={
						<Switch
							size="small"
							checked={xLog}
							onChange={() => setXLog((p) => !p)}
						/>
					}
					label="対数軸 x"
				/>
				<FormControlLabel
					control={
						<Switch
							size="small"
							checked={yLog}
							onChange={() => setYLog((p) => !p)}
						/>
					}
					label="対数軸 y"
				/>
				<Button startIcon={<Download />} onClick={() => downloadCSV()}>
					表示範囲のCSVをダウンロード
				</Button>
			</Stack>
		</Stack>
	);
}
