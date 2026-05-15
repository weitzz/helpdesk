import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import FilterSearch from './index'

const meta = {
  title: 'Components/Filters/Search',
  component: FilterSearch,
  tags: ['autodocs'],
  args: {
    label: 'Busca rapida',
    searchTerm: '',
    placeholder: 'Buscar por cliente, assunto ou descricao',
    onSearch: () => undefined
  },
  render: (args) => {
    const [value, setValue] = useState(args.searchTerm)

    useEffect(() => {
      setValue(args.searchTerm)
    }, [args.searchTerm])

    return (
      <div style={{ width: '360px', maxWidth: '100%' }}>
        <FilterSearch {...args} searchTerm={value} onSearch={setValue} />
      </div>
    )
  }
} satisfies Meta<typeof FilterSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: {
    searchTerm: 'Acme'
  }
}
