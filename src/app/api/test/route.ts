import { NextApiResponse } from 'next'
import { removeBackground, Config } from '@imgly/background-removal-node'

const IsValidImage = async (imageUrl: string) => {
  const data = await fetch(imageUrl)
  const bufferinf = await data.arrayBuffer()
  if (bufferinf.byteLength < 100) {
    return false
  }
  return true
}

const ConvertImage = async (imageUrl: string) => {
  if (imageUrl.split('/')[2] === 'flagsapi.com') {
    const data = await fetch(imageUrl)
    const bufferinf = await data.arrayBuffer()
    const bufferData = Buffer.from(bufferinf)
    const bufferBase64 = bufferData.toString('base64')
    return bufferBase64
  }
  const conf: Config = {
    model: 'medium',
    output: {
      quality: 1,
      format: 'image/png'
    }
  }
  const response = await removeBackground(imageUrl, conf)
  const converToBuffer = await response.arrayBuffer()
  const bufferData = Buffer.from(converToBuffer)
  const bufferBase64 = bufferData.toString('base64')
  return bufferBase64
}

export const POST = async (req: Request, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = await req.json()
    const { imageUrl } = body

    console.log(imageUrl)

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' })
    }

    const isValid = await IsValidImage(imageUrl)

    if (isValid) {
      const element = await ConvertImage(imageUrl)
      return Response.json({ message: 'Background removed successfully', element })
    } else {
      const element = await ConvertImage(
        'https://www.seapointrugby.club/wp-content/themes/victory/includes/images/badge-placeholder.png'
      )
      return Response.json({ message: 'Background removed successfully', element })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.end(`Method ${req.method} Not Allowed`)
  }
}
