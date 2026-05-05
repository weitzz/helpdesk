import {
  buildQueryFilterByRole,
  canPerformAction,
  filterCallsByRole,
  getRoleColor,
  getRoleLabel,
  getStatusColor
} from './rbacHelpers'
import type { ServiceCall } from '../types'

const calls: ServiceCall[] = [
  {
    id: '1',
    client: 'Empresa A',
    clientId: 'cliente-1',
    subject: 'Suporte',
    status: 'Aberto',
    created: new Date('2024-01-10'),
    attendedAt: null,
    descriptions: 'Primeiro chamado',
    userId: 'tecnico-1'
  },
  {
    id: '2',
    client: 'Empresa B',
    clientId: 'cliente-2',
    subject: 'Financeiro',
    status: 'Progresso',
    created: new Date('2024-01-11'),
    attendedAt: null,
    descriptions: 'Segundo chamado',
    userId: 'tecnico-2'
  }
]

describe('rbacHelpers', () => {
  describe('filterCallsByRole', () => {
    it('retorna todos os chamados para admin', () => {
      expect(filterCallsByRole(calls, 'admin', 'qualquer-uid')).toEqual(calls)
    })

    it('retorna apenas chamados atribuidos ao tecnico', () => {
      expect(filterCallsByRole(calls, 'tecnico', 'tecnico-1')).toEqual([calls[0]])
    })

    it('retorna apenas chamados do cliente', () => {
      expect(filterCallsByRole(calls, 'cliente', 'cliente-2')).toEqual([calls[1]])
    })
  })

  describe('canPerformAction', () => {
    it('permite qualquer acao para admin', () => {
      expect(canPerformAction('delete', 'admin')).toBe(true)
      expect(canPerformAction('edit', 'admin', calls[0], 'admin-1')).toBe(true)
    })

    it('permite view e edit apenas para o tecnico responsavel', () => {
      expect(canPerformAction('view', 'tecnico', calls[0], 'tecnico-1')).toBe(true)
      expect(canPerformAction('edit', 'tecnico', calls[0], 'tecnico-1')).toBe(true)
      expect(canPerformAction('edit', 'tecnico', calls[0], 'tecnico-2')).toBe(false)
      expect(canPerformAction('create', 'tecnico', calls[0], 'tecnico-1')).toBe(false)
    })

    it('permite create para cliente e view apenas do proprio chamado', () => {
      expect(canPerformAction('create', 'cliente')).toBe(true)
      expect(canPerformAction('view', 'cliente', calls[0], 'cliente-1')).toBe(true)
      expect(canPerformAction('view', 'cliente', calls[0], 'cliente-2')).toBe(false)
      expect(canPerformAction('edit', 'cliente', calls[0], 'cliente-1')).toBe(false)
    })
  })

  describe('helpers de exibicao', () => {
    it('retorna labels e cores esperadas para role e status', () => {
      expect(getRoleLabel('admin')).toBe('Administrador')
      expect(getRoleColor('tecnico')).toBe('#4ECDC4')
      expect(getStatusColor('Atendido')).toBe('#5c5cfc')
    })
  })

  describe('buildQueryFilterByRole', () => {
    it('nao aplica filtro para admin', () => {
      expect(buildQueryFilterByRole('admin', 'admin-1')).toBeNull()
    })

    it('aplica filtro por tecnico e cliente', () => {
      expect(buildQueryFilterByRole('tecnico', 'tecnico-1')).toEqual({
        field: 'userId',
        operator: '==',
        value: 'tecnico-1'
      })

      expect(buildQueryFilterByRole('cliente', 'cliente-1')).toEqual({
        field: 'clientId',
        operator: '==',
        value: 'cliente-1'
      })
    })
  })
})
