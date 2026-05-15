import type { Meta, StoryObj } from '@storybook/react'
import Button from './index'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Salvar'
  }
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary'
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline'
  }
}

export const Success: Story = {
  args: {
    variant: 'success'
  }
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Enviando...'
  }
}
