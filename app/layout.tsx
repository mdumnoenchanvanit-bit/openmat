import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenMat — Know Before You Roll',
  description: 'Find and review BJJ gyms worldwide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
