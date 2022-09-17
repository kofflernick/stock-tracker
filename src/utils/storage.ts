export interface LocalStorage {
  tickers?: string[]
}

export type LocalStorageKeys = keyof LocalStorage

export function setStoredTickers(tickers: string[]): Promise<void> {
  const vals: LocalStorage = {
    tickers,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve()
    })
  })
}

export function getStoredTickers(): Promise<string[]> {
  const keys: LocalStorageKeys[] = ['tickers']
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.tickers ?? [])
    })
  })
}
