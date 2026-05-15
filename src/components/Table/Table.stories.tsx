import type { Meta, StoryObj } from '@storybook/react'
import Badge from '../Badge'
import Table, { type Column } from './index'

type TicketRow = {
  cliente: string
  assunto: string
  status: 'Aberto' | 'Progresso' | 'Atendido'
  tecnico: string
}

const columns: Column<TicketRow>[] = [
  {
    key: 'cliente',
    label: 'Cliente'
  },
  {
    key: 'assunto',
    label: 'Assunto'
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: TicketRow['status']) => {
      const colorMap: Record<TicketRow['status'], string> = {
        Aberto: '#181c2e',
        Progresso: '#d97706',
        Atendido: '#00923a'
      }

      return <Badge label={value} color={colorMap[value]} />
    }
  },
  {
    key: 'tecnico',
    label: 'Tecnico responsavel'
  }
]

const sampleData: TicketRow[] = [
  {
    cliente: 'Empresa XPTO',
    assunto: 'Suporte',
    status: 'Aberto',
    tecnico: 'Nao atribuido'
  },
  {
    cliente: 'Loja Central',
    assunto: 'Financeiro',
    status: 'Progresso',
    tecnico: 'Marina Souza'
  },
  {
    cliente: 'Oficina Prime',
    assunto: 'Visita Tecnica',
    status: 'Atendido',
    tecnico: 'Carlos Lima'
  }
]

const TicketTable = (props: { columns: Column<TicketRow>[]; data: TicketRow[] }) => (
  <Table<TicketRow> {...props} />
)

const meta = {
  title: 'Components/Table',
  component: TicketTable,
  tags: ['autodocs'],
  args: {
    columns,
    data: sampleData
  },
  decorators: [
    (Story) => (
      <div style={{ width: '960px', maxWidth: '100%' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof TicketTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmptyState: Story = {
  args: {
    data: []
  }
}
