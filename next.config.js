const nextConfig = {
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/api/:path*",
	// 			destination: "https://cribbly.io/:path*",
	// 		},
	// 	];
	// },
	async redirects() {
		return [
			{
				source: "/login",
				destination: "/sign-in",
				permanent: true,
			},
			{
				source: "/signin",
				destination: "/sign-in",
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

module.exports = nextConfig;
