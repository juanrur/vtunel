import Routines from '@ui/routines/components/routines'

export default function RoutinesPage () {
  return (
    <section className='h-full flex flex-col max-w-3xl mx-auto w-full'>
      <h1 className='text-2xl font-bold px-4 pt-4'>Routines</h1>
      <Routines />
    </section>
  )
}
