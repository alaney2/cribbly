export function Spinner({ width = "20px", height = "20px" }) {
	return (
		<svg
			className="animate-spin text-center"
			fill="#fff"
			width={width}
			height={height}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Loading...</title>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				<g>
					<path d="M2.39,8.13a5.47,5.47,0,0,1,.18-1.39l.16-.66L1.42,5.74l-.17.66a7,7,0,0,0,.08,3.73l.19.65,1.3-.39-.19-.65A5.46,5.46,0,0,1,2.39,8.13Zm2.18,4.39L4,12.12l-.83,1.07.55.42a6.76,6.76,0,0,0,3.48,1.32l.67.07L8,13.64l-.67-.06A5.56,5.56,0,0,1,4.57,12.52ZM14.4,5.37A7.05,7.05,0,0,0,5.16,1.63h0A6.92,6.92,0,0,0,2.77,3.28L4,4.48A5.32,5.32,0,1,1,10,13l.68,1.6A7.06,7.06,0,0,0,14.4,5.37Z"></path>
				</g>
			</g>
		</svg>
	);
}
