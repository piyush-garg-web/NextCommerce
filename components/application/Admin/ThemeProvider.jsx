'use client'
import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemeProvider = ({children,...props}) => {
 return <NextThemesProvider {...props} enableSystem={false} defaultTheme="light">{children}</NextThemesProvider>
}

export default ThemeProvider
