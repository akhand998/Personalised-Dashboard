import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import ReduxProviders from '../store/Providers'
import DarkModeSync from '../components/DarkModeSync'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personalised Dashboard',
  description: 'Your personalized news and movies dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ReduxProviders>
            <DarkModeSync />
            {children}
          </ReduxProviders>
        </Providers>
      </body>
    </html>
  )
}
