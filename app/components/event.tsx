export default function event ({ name, height }: { name: string, height: number }) {
  return (
    <li className='bg-blue-500 rounded-md py-4 px-6' style={{ height: `${height}em` }}>
      <button>
        {name}
      </button>
    </li>
  )
}
