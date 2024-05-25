"use client";
import { InputSlider } from "@/components/InputSlider";
import { MyLineChart } from "@/components/MyLineChart";
import { dummyData } from "@/dummyData";
import { GitHub, Loop, UploadFile } from "@mui/icons-material";
import {
	Button,
	ButtonGroup,
	Divider,
	Link,
	Slider,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import type React from "react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

const defaultStates = {
	naturalPeriodStart: 1,
	naturalPeriodOffset: 10,
	numOfNaturalPeriods: 250,
	dt: 10,
	dampingH: 0.05,
	rBeta: 4,
	initX: 0,
	initV: 0,
	initA: 0,
	initXg: 0,
	resAccIndex: 0,
	csvColIndex: 0,
};

export default function Home() {
	const [data, setData] = useState([dummyData]);

	const [naturalPeriodStart, setNaturalPeriodStart] = useState(
		defaultStates.naturalPeriodStart,
	);
	const [naturalPeriodOffset, setNaturalPeriodOffset] = useState(
		defaultStates.naturalPeriodOffset,
	);
	const [numOfNaturalPeriods, setNumOfNaturalPeriods] = useState(
		defaultStates.numOfNaturalPeriods,
	);

	const [dt, setDt] = useState(defaultStates.dt);
	const [dampingH, setDampingH] = useState(defaultStates.dampingH);
	const [rBeta, setRBeta] = useState(defaultStates.rBeta);
	const [initX, setInitX] = useState(defaultStates.initX);
	const [initV, setInitV] = useState(defaultStates.initV);
	const [initA, setInitA] = useState(defaultStates.initA);
	const [initXg, setInitXg] = useState(defaultStates.initXg);

	const [time, setTime] = useState<number[]>([1]);
	const [resAcc, setResAcc] = useState<number[][]>([[1]]);
	const [resAccIndex, setResAccIndex] = useState<number>(0);

	const [naturalPeriodsSec, setNaturalPeriodsSec] = useState<number[]>([1]);
	const [spectrum, setSpectrum] = useState<number[]>([1]);

	const [csvColIndex, setCsvColIndex] = useState<number>(
		defaultStates.csvColIndex,
	);

	function setDefaultStates() {
		setNaturalPeriodStart(defaultStates.naturalPeriodStart);
		setNaturalPeriodOffset(defaultStates.naturalPeriodOffset);
		setNumOfNaturalPeriods(defaultStates.numOfNaturalPeriods);
		setDt(defaultStates.dt);
		setDampingH(defaultStates.dampingH);
		setRBeta(defaultStates.rBeta);
		setInitX(defaultStates.initX);
		setInitV(defaultStates.initV);
		setInitA(defaultStates.initA);
		setInitXg(defaultStates.initXg);
		setResAccIndex(defaultStates.resAccIndex);
		setCsvColIndex(defaultStates.csvColIndex);
	}

	useEffect(() => {
		const timeoutId = setTimeout(
			() =>
				(async () => {
					const { ResponseAccAnalyzer } = await import("seismic-response");

					const naturalPeriods = Array.from(
						{ length: numOfNaturalPeriods },
						(_, i) => naturalPeriodStart + i * naturalPeriodOffset,
					);
					const resAccList = naturalPeriods.map((naturalPeriod) => {
						const params = {
							natural_period_ms: naturalPeriod,
							dt_ms: dt,
							damping_h: dampingH,
							beta: 1 / rBeta,
							init_x: initX,
							init_v: initV,
							init_a: initA,
							init_xg: initXg,
						};

						const analyzer = ResponseAccAnalyzer.from_params(params);
						return Array.from(analyzer.analyze(data[csvColIndex]));
					});

					setTime(
						Array.from(
							{ length: resAccList[0].length },
							(_, i) => i * (dt / 1000),
						),
					);

					setResAcc(resAccList);

					setNaturalPeriodsSec(
						naturalPeriods.map((naturalPeriod) => naturalPeriod / 1000),
					);

					const spectrum = resAccList.map((resAcc) => {
						return resAcc.reduce((acc, cur) => Math.max(acc, Math.abs(cur)), 0);
					});
					setSpectrum(spectrum);
				})(),
			100,
		);
		return () => clearTimeout(timeoutId);
	}, [
		data,
		naturalPeriodStart,
		naturalPeriodOffset,
		numOfNaturalPeriods,
		dt,
		dampingH,
		rBeta,
		initX,
		initV,
		initA,
		initXg,
		csvColIndex,
	]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.item(0);
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			setCsvColIndex(0);

			const text = e.target?.result as string;

			const csvArray = text
				.split("\n")
				.map((s) => s.split(",").map(Number.parseFloat));

			const columns = Array.from({ length: csvArray[0].length }, (_, i) =>
				csvArray.map((row) => row[i]),
			).map((v) => Float64Array.from(v).filter((v) => !Number.isNaN(v)));

			console.log(
				"aaa",
				columns.map((v) => v.filter((v) => Number.isNaN(v))),
			);

			setData(columns);
			setDefaultStates();
		};
		if (file instanceof Blob) reader.readAsText(file);
	}

	return (
		<main>
			<Stack marginX={5} spacing={2} style={{ userSelect: "none" }}>
				<Typography variant="h2">
					1質点系 地震応答解析ツール{" "}
					<Link href={"https://github.com/azishio/seismic-response-web"}>
						<GitHub fontSize="large" />
					</Link>
				</Typography>
				<Box textAlign="right" mt={10}>
					<ButtonGroup>
						<Button startIcon={<Loop />} onClick={() => setDefaultStates()}>
							サンプルデータをロード
						</Button>
						<Button startIcon={<UploadFile />} component="label" tabIndex={-1}>
							ファイルをアップロード
							<VisuallyHiddenInput
								type="file"
								accept=".csv"
								onChange={(e) => handleFileChange(e)}
								onClick={(e) => {
									// @ts-ignore これがないと同じファイルが選択された時にchangeイベントが発火しない
									e.target.value = "";
								}}
							/>
						</Button>
					</ButtonGroup>
				</Box>
				<Divider />
				<Typography variant="h3">パラメータ</Typography>
				<Stack
					direction="row"
					spacing={5}
					justifyContent={"center"}
					divider={<Divider orientation="vertical" flexItem />}
					flexWrap="wrap"
				>
					<Stack>
						<InputSlider
							value={csvColIndex}
							setValue={setCsvColIndex}
							max={data.length - 1}
							min={0}
							label={`参照列 [0, ${data.length - 1}]`}
						/>
						<InputSlider
							value={dt}
							setValue={setDt}
							max={100}
							min={1}
							label={"時間分解能 [ms]"}
						/>
						<InputSlider
							value={dampingH}
							setValue={setDampingH}
							max={3}
							step={0.01}
							min={0}
							label={"減衰定数"}
						/>
						<InputSlider
							value={rBeta}
							setValue={setRBeta}
							max={6}
							min={1}
							label={"Newmark β の逆数"}
						/>
					</Stack>
					<Stack>
						<Typography>固有周期 [ms]</Typography>
						<br />
						<InputSlider
							value={naturalPeriodStart}
							setValue={setNaturalPeriodStart}
							min={1}
							max={5000}
							label="開始"
						/>
						<InputSlider
							value={naturalPeriodOffset}
							setValue={setNaturalPeriodOffset}
							min={1}
							max={1000}
							label="間隔"
						/>
						<InputSlider
							value={numOfNaturalPeriods}
							setValue={setNumOfNaturalPeriods}
							min={2}
							max={1000}
							label="サンプル数"
						/>
					</Stack>
					<Stack>
						<InputSlider
							value={initX}
							setValue={setInitX}
							max={100}
							min={-100}
							label={"初期応答変位 [m]"}
						/>
						<InputSlider
							value={initV}
							setValue={setInitV}
							max={100}
							min={-100}
							label={"初期応答速度 [m/s]"}
						/>
						<InputSlider
							value={initA}
							setValue={setInitA}
							max={100}
							min={-100}
							label={"初期応答加速度 [gal]"}
						/>
						<InputSlider
							value={initXg}
							setValue={setInitXg}
							max={100}
							min={-100}
							label={"初期地震加速度 [m]"}
						/>
					</Stack>
				</Stack>
				<Divider />
				<Stack>
					<Stack marginX={5} spacing={5} divider={<Divider flexItem />}>
						<Typography variant="h3">応答解析結果</Typography>
						<Box>
							<Stack direction="row" spacing={2}>
								<Typography noWrap>サンプル</Typography>
								<Slider
									style={{ width: "90%" }}
									max={resAcc.length - 1}
									min={0}
									step={1}
									valueLabelDisplay="auto"
									value={resAccIndex}
									onChange={(_, v) => setResAccIndex(v as number)}
								/>
							</Stack>
							<Typography>
								固有周期:{" "}
								{naturalPeriodStart + naturalPeriodOffset * resAccIndex} [ms]
							</Typography>
							<MyLineChart
								x={time}
								y={resAcc[resAccIndex]}
								xLabel="時間 [s]"
								yLabel="絶対応答加速度 [gal]"
							/>
						</Box>
						<Typography variant="h3">応答スペクトル</Typography>
						<MyLineChart
							x={naturalPeriodsSec}
							y={spectrum}
							xLabel="固有周期 [s]"
							yLabel="絶対応答加速度 [gal]"
						/>
					</Stack>
				</Stack>
			</Stack>
		</main>
	);
}
