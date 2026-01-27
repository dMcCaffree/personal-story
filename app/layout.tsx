import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<ThemeWrapper>{children}</ThemeWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
