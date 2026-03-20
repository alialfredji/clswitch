const ESC = '\u001b['

type Color = 'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'bold'

const COLOR_CODES: Record<Color, [string, string]> = {
  red: ['31m', '39m'],
  green: ['32m', '39m'],
  yellow: ['33m', '39m'],
  blue: ['34m', '39m'],
  gray: ['90m', '39m'],
  bold: ['1m', '22m']
}

function canColorize(): boolean {
  if (process.env.NO_COLOR !== undefined) {
    return false
  }
  return Boolean(process.stdout.isTTY)
}

function colorize(text: string, color: Color): string {
  if (!canColorize()) {
    return text
  }

  const [open, close] = COLOR_CODES[color]
  return `${ESC}${open}${text}${ESC}${close}`
}

export function info(message: string): void {
  console.log(colorize(message, 'blue'))
}

export function success(message: string): void {
  console.log(colorize(message, 'green'))
}

export function warn(message: string): void {
  console.warn(colorize(message, 'yellow'))
}

export function error(message: string): void {
  console.error(colorize(message, 'red'))
}

export function muted(message: string): void {
  console.log(colorize(message, 'gray'))
}

export function headline(message: string): void {
  console.log(colorize(message, 'bold'))
}
