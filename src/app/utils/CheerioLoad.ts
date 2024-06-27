import * as cheerio from 'cheerio'

export const cheerioLoad = async (URL: string) => {
  console.log(URL)
  const RequestToScrape = await fetch(URL, { cache: 'no-store' })
  const RequestToText = await RequestToScrape.text()
  const $ = cheerio.load(RequestToText)
  return $
}
