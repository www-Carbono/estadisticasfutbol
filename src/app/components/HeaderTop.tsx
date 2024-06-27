import Image from 'next/image'
export const HeaderTop = () => {
  return (
    <div className='bg-zinc-800 rounded-lg '>
      <Image
        src='/portada.jpeg'
        alt='Football Banner'
        className='rounded-lg object-fill'
        width={480}
        height={380}
      />
    </div>
  )
}
