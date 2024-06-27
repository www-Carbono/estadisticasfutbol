import Image from 'next/image'
export const Blog = () => {
  return (
    <div className='w-1/4 bg-zinc-800 p-4 space-y-4 rounded-md'>
      <h2 className='text-xl font-bold'>Blog</h2>
      <div className='space-y-4'>
        <div className='flex space-x-4'>
          <Image
            src='/portada.jpeg'
            alt='Blog Image'
            className='w-24 h-24 rounded-lg'
            width={100}
            height={100}
          />
          <div>
            <h3 className='font-bold'>Results And Scores From The Premier League...!!</h3>
            <p className='text-zinc-400 text-sm'>5 Hours Ago</p>
          </div>
        </div>
        <div className='flex space-x-4'>
          <Image
            src='/portada.jpeg'
            alt='Blog Image'
            className='w-24 h-24 rounded-lg'
            width={100}
            height={100}
          />
          <div>
            <h3 className='font-bold'>Here Are The Top 100 Players And Managers</h3>
            <p className='text-zinc-400 text-sm'>11 Oct 2023, 06:00 AM</p>
          </div>
        </div>
        <div className='flex space-x-4'>
          <Image
            src='/portada.jpeg'
            alt='Blog Image'
            className='w-24 h-24 rounded-lg'
            width={100}
            height={100}
          />
          <div>
            <h3 className='font-bold'>Results And Scores From The Premier League...!!</h3>
            <p className='text-zinc-400 text-sm'>10 Oct 2023, 09:00 PM</p>
          </div>
        </div>
        <div className='flex space-x-4'>
          <Image
            src='/portada.jpeg'
            alt='Blog Image'
            className='w-24 h-24 rounded-lg'
            width={100}
            height={100}
          />
          <div>
            <h3 className='font-bold'>Join Or Start A Competition Now!</h3>
            <p className='text-zinc-400 text-sm'>10 Oct 2023, 02:40 PM</p>
          </div>
        </div>
        <div className='flex space-x-4'>
          <Image
            src='/portada.jpeg'
            alt='Blog Image'
            className='w-24 h-24 rounded-lg'
            width={100}
            height={100}
          />
          <div>
            <h3 className='font-bold'>Results And Scores From The Premier League...!!</h3>
            <p className='text-zinc-400 text-sm'>09 Oct 2023, 08:12 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
