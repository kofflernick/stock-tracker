export interface LocalStorage {
  tickers?: string[]
  favTickers?: string[]
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
  const keys: LocalStorageKeys[] = ["tickers"]
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.tickers ?? [])
    })
  })
}

export function setStoredFavTickers(favTickers: string[]): Promise<void> {
  const vals: LocalStorage = {
    favTickers, // Store favorite tickers in local storage
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve()
    })
  })
}

export function getStoredFavTickers(): Promise<string[]> {
  const keys: LocalStorageKeys[] = ["favTickers"] // Specify the key for favorite tickers
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.favTickers ?? []) // Default to an empty array if no data found
    })
  })
}
