import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import type * as React from "react";
import type { Dispatch, SetStateAction } from "react";

export function InputSlider({
	value,
	setValue,
	max,
	min,
	label,
	step,
}: {
	value: number;
	setValue: Dispatch<SetStateAction<number>>;
	max: number;
	min: number;
	label: string;
	step?: number;
}) {
	const handleSliderChange = (_event: Event, newValue: number | number[]) => {
		setValue(newValue as number);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value === "" ? min : Number(event.target.value));
	};

	const handleBlur = () => {
		if (value < min) {
			setValue(min);
		} else if (value > max) {
			setValue(max);
		}
	};

	return (
		<Box sx={{ width: "25vw" }}>
			<Typography>{label}</Typography>
			<Stack direction="row" spacing={2}>
				<Grid item xs>
					<Slider
						value={value}
						max={max}
						min={min}
						onChange={handleSliderChange}
					/>
				</Grid>
				<Grid item>
					<MuiInput
						value={value}
						size="small"
						onChange={handleInputChange}
						onBlur={handleBlur}
						inputProps={{
							step,
							min: min,
							max: max,
							type: "number",
						}}
					/>
				</Grid>
			</Stack>
		</Box>
	);
}
