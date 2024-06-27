'use client'
import { useEffect, useState } from 'react'
import { GetTeamsIcons } from '../utils/GetTeamsIcons'
import Image from 'next/image'

const RemoveBackground = () => {
  const [image, setImage] = useState()
  useEffect(() => {
    const fetch = async () => {
      const prueba = await GetTeamsIcons('https://cdn.ssref.net/req/202406171/tlogo/fb/1b286de7.png')
      console.log(prueba)
      return prueba
    }
    fetch().then((data) => {
      console.log(data)
      setImage(data)
    })
  }, [])

  return (
    <div>
      {image && (
        <Image
          src={`data:image/png;base64,${image}`}
          width={128}
          height={128}
          alt='image'
        ></Image>
      )}
    </div>
  )
}

export default RemoveBackground
