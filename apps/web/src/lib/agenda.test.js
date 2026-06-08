import { describe, it, expect } from 'vitest'
import { getEventStatus } from './agenda'

// Referência fixa para testes determinísticos: 08/06/2026 12:00 (-03:00).
const NOW = new Date('2026-06-08T12:00:00-03:00')

describe('getEventStatus', () => {
  it('evento no futuro -> proximo', () => {
    expect(getEventStatus({ dia: '15', mes: 'Dez', ano: '2026' }, NOW)).toBe('proximo')
  })

  it('evento no passado -> realizado', () => {
    expect(getEventStatus({ dia: '10', mes: 'Jan', ano: '2020' }, NOW)).toBe('realizado')
  })

  it('evento hoje vale até o fim do dia -> proximo', () => {
    expect(getEventStatus({ dia: '08', mes: 'Jun', ano: '2026' }, NOW)).toBe('proximo')
  })

  it('ontem -> realizado', () => {
    expect(getEventStatus({ dia: '07', mes: 'Jun', ano: '2026' }, NOW)).toBe('realizado')
  })

  it('sem dia/mes cai no status informado (ou proximo)', () => {
    expect(getEventStatus({ status: 'realizado' }, NOW)).toBe('realizado')
    expect(getEventStatus({}, NOW)).toBe('proximo')
  })

  it('mes inválido usa o status informado', () => {
    expect(getEventStatus({ dia: '1', mes: 'XYZ', ano: '2020', status: 'proximo' }, NOW)).toBe('proximo')
  })

  it('aceita mês por extenso e caixa variada', () => {
    expect(getEventStatus({ dia: '1', mes: 'janeiro', ano: '2020' }, NOW)).toBe('realizado')
  })

  it('sem ano assume o ano corrente', () => {
    expect(getEventStatus({ dia: '31', mes: 'Dez' }, NOW)).toBe('proximo')
  })
})
