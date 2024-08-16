import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/Provider/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Spellbook cards",
	description: "Create spellbooks and add your own spells",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={inter.className}
				style={{
					backgroundColor: "#0a0a0f",
					backgroundImage:
						'url("https://w0.peakpx.com/wallpaper/859/885/HD-wallpaper-the-book-of-magic-wicca-book-magic-spell.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
