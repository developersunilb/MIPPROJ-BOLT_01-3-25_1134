import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "../../components/theme-provider";
import { Navigation } from "../../components/navigation";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MockMaster - Professional Interview Practice',
  description: 'Practice interviews with industry experts and get personalized feedback to improve your skills.',
};

/**
 * RootLayout component that sets up the main HTML structure of the application.
 * It includes theme management and navigation components.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 *
 * @returns {JSX.Element} The root layout of the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* ThemeProvider manages the theme settings for the application */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navigation component for the application's main navigation */}
          <Navigation />
          {/* Render child components passed to the layout */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
