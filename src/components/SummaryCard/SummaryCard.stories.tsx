import type { Meta, StoryObj } from '@storybook/react'
import Badge from '../Badge'
import SummaryCard from './index'

const meta = {
  title: 'Components/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  args: {
    title: 'Resumo do chamado',
    items: [
      { label: 'Cliente', value: 'Empresa XPTO' },
      { label: 'Assunto', value: 'Suporte' },
      { label: 'Status', value: <Badge label="Aberto" color="#181c2e" /> }
    ]
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SummaryCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AtendimentoConcluido: Story = {
  args: {
    title: 'Resumo do atendimento',
    items: [
      { label: 'Cliente', value: 'Loja Central' },
      { label: 'Tecnico', value: 'Marina Souza' },
      { label: 'Status', value: <Badge label="Atendido" color="#00923a" /> }
    ]
  }
}
