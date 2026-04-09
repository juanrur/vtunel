import { Template } from 'modules/templates/types'
export default function TemplateList ({ templates }: { templates: Template[] }) {
  return <ul className='space-y-4'>
    {templates.map((template) => (
      <li draggable onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', 'template:' + template.id)
      }} className='border rounded-lg p-3 flex justify-between items-center bg-secondary border-primary'
      key={template.id}>
      <div>
        <h2 className='font-medium'>{template.title}</h2>
        <div className='text-sm text-zinc-500'>
          <span>Duration: {template.duration} minutes</span>
        </div>
      </div>
    </li>
    ))}
  </ul>
}
