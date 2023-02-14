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

// export async function fetchTwelveDataData(
//   ticker: string = ""
// ): Promise<TwelveDataData> {
//   let params: any = {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },

//     body: {
//       ticker: JSON.stringify(ticker),
//     },
//   }

//   const RES = await fetch(
//     "http://localhost:8000/twelve-data?ticker=" + ticker,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     }
//   )

//   // console.log(RES)

//   const data: TwelveDataData | any = await RES.json()
//   return data.data
// }

export async function fetchTwelveDataData(
  ticker: string = ""
): Promise<TwelveDataData> {
  let data: TwelveDataData | any
  try {
    const response = await fetch(
      "https://tranquil-castle-98436.herokuapp.com/twelve-data?ticker=" + ticker
    )
    data = await response.json()
  } catch (error) {
    console.error(error)
    try {
      const response = await fetch(
        "http://localhost:8000/twelve-data?ticker=" + ticker
      )
      data = await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  return data.data
}

// export async function fetchTwelveDataData(
//   ticker: string = ""
// ): Promise<TwelveDataData> {
//   const serverUrl = process.env.SERVER_URL
//   const response = await fetch(serverUrl + "/twelve-data?ticker=" + ticker)
//   const data: TwelveDataData | any = await response.json()
//   return data.data
// }
