export interface TwelveDataData {
  meta: {
    symbol: string
  }
  values: {
    close: string
    datetime: string
    high: string
    low: string
    open: string
    volume: string
  }[]
}

export async function fetchTwelveDataData(
  ticker: string = ""
): Promise<TwelveDataData> {
  let params: any = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: {
      ticker: JSON.stringify(ticker),
    },
  }

  const RES = await fetch(
    "https://tranquil-castle-98436.herokuapp.com/twelve-data?ticker=" + ticker,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )

  const data: TwelveDataData | any = await RES.json()
  return data.data
}
