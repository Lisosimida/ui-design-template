import '@/styles/globals.css'
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'Launchbase - Product Launch & Event Template',
  description: 'A config-driven Next.js template for product launch pages and event landing pages. Swap the config, not the code.',
  robots: 'index, follow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
