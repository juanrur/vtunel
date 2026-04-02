import { Template } from 'modules/templates/domain/types'

export default function TemplateList ({ templates }: { templates: Template[] }) {
  return <ul className='space-y-4'>
    {templates.map((template) => (
      <li key={template.id} className='p-4 border rounded'>
        <h3 className='text-lg font-semibold'>{template.name}</h3>
      </li>
    ))}
  </ul>
}
