import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import FilterOptions from './index'

const meta = {
  title: 'Components/Filters/Options',
  component: FilterOptions,
  tags: ['autodocs'],
  args: {
    label: 'Empresa',
    options: ['Acme', 'Beta Ltda', 'Gamma Tech'],
    selectedValue: 'todos',
    defaultOptionLabel: 'Todas as empresas',
    onChange: () => undefined
  },
  render: (args) => {
    const [value, setValue] = useState(args.selectedValue)

    useEffect(() => {
      setValue(args.selectedValue)
    }, [args.selectedValue])

    return (
      <div style={{ width: '280px', maxWidth: '100%' }}>
        <FilterOptions {...args} selectedValue={value} onChange={setValue} />
      </div>
    )
  }
} satisfies Meta<typeof FilterOptions>

export default meta

type Story = StoryObj<typeof meta>

export const Companies: Story = {}

export const Status: Story = {
  args: {
    label: 'Status',
    options: ['Aberto', 'Progresso', 'Atendido'],
    defaultOptionLabel: 'Todos os status'
  }
}
