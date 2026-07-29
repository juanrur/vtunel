import Header from '@ui/schedule/components/header'
import Days from '@ui/schedule/components/days'

export default function SchedulePage () {
  return (
    <section className='h-full flex flex-col min-h-0'>
      <Header />
      <Days />
    </section>
  )
}
