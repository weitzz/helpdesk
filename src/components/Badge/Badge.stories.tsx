import type { Meta, StoryObj } from '@storybook/react'
import Badge from './index'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    label: 'Aberto',
    color: '#55ac55'
  }
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Aberto',
    color: '#55ac55'
  }
}

export const Success: Story = {
  args: {
    label: 'Atendido',
    color: '#5c5cfc'
  }
}

export const Warning: Story = {
  args: {
    label: 'Progresso',
    color: '#d97706'
  }
}
