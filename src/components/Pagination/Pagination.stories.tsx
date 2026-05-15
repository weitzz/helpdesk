import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import Pagination from './index'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 2,
    totalPages: 5,
    onPageChange: () => undefined
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage)

    useEffect(() => {
      setPage(args.currentPage)
    }, [args.currentPage])

    return <Pagination {...args} currentPage={page} onPageChange={setPage} />
  },
  decorators: [
    (Story) => (
      <div style={{ width: '520px', maxWidth: '100%' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const MiddlePage: Story = {}

export const FirstPage: Story = {
  args: {
    currentPage: 1
  }
}

export const LastPage: Story = {
  args: {
    currentPage: 5
  }
}
