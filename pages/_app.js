import '@/styles/globals.css'
import Layout from '../components/Layout'
import { Silkscreen, Anton, Kalam, Plus_Jakarta_Sans } from 'next/font/google'

const display = Silkscreen({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-display' })
const heading = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-heading' })
const hand = Kalam({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-hand' })
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })

export default function App({ Component, pageProps }) {
  return (
    <div className={`${display.variable} ${heading.variable} ${hand.variable} ${sans.variable}`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};
