import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	Inter,
	Roboto,
	Poppins,
	JetBrains_Mono,
	IBM_Plex_Mono,
	Playfair_Display,
	Source_Sans_3,
	Space_Grotesk,
	Outfit,
	DM_Sans,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeWrapper } from "@/components/ThemeWrapper";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Blog component fonts
const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const roboto = Roboto({
	variable: "--font-roboto",
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-ibm-plex-mono",
	weight: ["400", "500"],
	subsets: ["latin"],
	display: "swap",
});

const playfairDisplay = Playfair_Display({
	variable: "--font-playfair-display",
	subsets: ["latin"],
	display: "swap",
});

const sourceSans = Source_Sans_3({
	variable: "--font-source-sans",
	subsets: ["latin"],
	display: "swap",
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
	display: "swap",
});

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	display: "swap",
});

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
	display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dustin.site";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: "Dustin McCaffree",
	description: "Software engineer, builder, and storyteller",
	openGraph: {
		title: "Dustin McCaffree",
		description: "Software engineer, builder, and storyteller",
		url: baseUrl,
		siteName: "Dustin McCaffree",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary",
		site: "@dustinmccaffree",
		creator: "@dustinmccaffree",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${poppins.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} ${playfairDisplay.variable} ${sourceSans.variable} ${spaceGrotesk.variable} ${outfit.variable} ${dmSans.variable} antialiased`}
			>
				<ThemeProvider>
					<ThemeWrapper>{children}</ThemeWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
