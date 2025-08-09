export interface IAPI {
  send: (channel: string, data: unknown) => void
  receive: (channel: string, func: (...args: unknown[]) => void) => void
  invoke: (channel: string, data: unknown) => Promise<unknown>
}

declare global {
  interface Window {
    readonly api: IAPI
  }
} 