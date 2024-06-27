'use server'
export const GetTeamsIcons = async (url: string) => {
  // const LINK = 'http://localhost:3333/RemoveBackground'
  const LINK = `${process.env.API_DOMAIN}/api/test`
  const request = await fetch(LINK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrl: url
    })
  })
  const data = await request.json()
  return data.element
}
