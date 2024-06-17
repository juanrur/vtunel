interface Props {
  name: string
  height: number
}

export default function event ({ name, height } : Props) {
  return (
    <li className="bg-blue-500 rounded-md py-4 px-6" style={{ height: `${height}em` }}>
      <button>
        {name}
      </button>
    </li>
  )
}
