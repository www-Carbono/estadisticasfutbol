import { cheerioLoad } from '../GetCalendar/route'

export const GET = async () => {
  const LINK = process.env.TEAMS_LINK ?? ''
  const $ = await cheerioLoad(LINK)

  await GetTeams($)
  return Response.json({ test: LINK })
}

const GetTeams = async ($: cheerio.Root) => {
  const elements = $('#countries > tbody > tr').toArray()
  for (const element of elements) {
    const NEWLINK = $(element).find('th > strong > a').attr('href')
    await new Promise((r) => setTimeout(r, 2200))
    console.log(NEWLINK)
  }
  //    const $ = await cheerioLoad(LINK)
}
