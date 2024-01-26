import { readFile } from 'fs/promises'

const fontsToLoad = {
  firaCode300: readFile(new URL('../assets/fira-code-latin-300-normal.woff', import.meta.url)),
  firaCode500: readFile(new URL('../assets/fira-code-latin-500-normal.woff', import.meta.url)),
  firaCode700: readFile(new URL('../assets/fira-code-latin-700-normal.woff', import.meta.url))
}

const fontFilesPromises = await Promise.all(Object.entries(fontsToLoad).map(async ([key, file]) => {
  return [key, Buffer.from(await file).toString('base64')]
}))

const fontFiles = Object.fromEntries(fontFilesPromises)

export default fontFiles
