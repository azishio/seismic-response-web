/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@mui/x-charts"],
	webpack(config, { isServer, dev }) {
		config.output.webassemblyModuleFilename =
			isServer && !dev ? "../static/wasm/wasm.wasm" : "static/wasm/wasm.wasm";

		config.experiments = { ...config.experiments, syncWebAssembly: true };

		return config;
	},
};

export default nextConfig;
