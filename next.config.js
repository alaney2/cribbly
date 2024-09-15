/** @type {import('next').NextConfig} */

const nextConfig = {
	// async rewrites() {
	//   return [
	//     {
	//       source: '/api/:path*',
	//       destination: 'https://api.example.com/:path*',
	//     },
	//   ]
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
			// {
			//   source: '/register',
			//   destination: '/get-started',
			//   permanent: true,
			// },
			// {
			//   source: '/sign-up',
			//   destination: '/get-started',
			//   permanent: true,
			// },
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
