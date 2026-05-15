import type { Meta, StoryObj } from '@storybook/react'
import Input from './index'

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Digite seu e-mail'
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Digite sua senha'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'usuario@empresa.com'
  }
}
