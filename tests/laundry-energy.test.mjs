import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import test from 'node:test'

const context = vm.createContext({ Intl })
for (const name of ['fixtures.js', 'energy.js']) {
  vm.runInContext(await readFile(new URL('../public/demos/praonica/' + name, import.meta.url), 'utf8'), context)
}
const { PraonicaDemoEnergy: energy, PraonicaDemoFixtures: fixtures } = context
const machines = fixtures.createDevices(1000, 'RUNNING', 'en')

test('eight fictional machines have independent monthly energy adding up to 188 kWh', () => {
  assert.equal(machines.filter(machine => machine.type === 'washer').length, 5)
  assert.equal(machines.filter(machine => machine.type === 'dryer').length, 3)
  assert.equal(new Set(machines.map(machine => machine.id)).size, 8)
  const result = energy.summarize(machines)
  assert.equal(result.month, '2026-10')
  assert.equal(result.entries[0].wh, 18400)
  assert.equal(result.entries[5].wh, 31600)
  assert.equal(result.totalWh, 188000)
  assert.equal(result.complete, true)
  assert.equal(energy.formatWh(result.totalWh, 'en-GB'), '188.0')
  assert.equal(energy.formatWh(result.totalWh, 'hr-HR'), '188,0')
  assert.equal(energy.summarize(machines.filter(machine => machine.type === 'washer')).totalWh, 93000)
  assert.equal(energy.summarize(machines.filter(machine => machine.type === 'dryer')).totalWh, 95000)
})

test('missing or invalid readings and duplicate machines cannot become a complete zero total', () => {
  const pair = [machines[0], machines[5]]
  for (const value of [undefined, -1, NaN, '31600']) {
    const result = energy.summarize(pair, { 'demo-washer-1': 18400, 'demo-dryer-1': value })
    assert.equal(result.complete, false)
    assert.equal(result.totalWh, null)
    assert.equal(result.entries[1].wh, null)
  }
  assert.equal(energy.summarize([machines[0], machines[0]]).totalWh, null)
  assert.equal(energy.summarize([]).totalWh, null)
  assert.equal(energy.formatWh(null, 'hr-HR'), '—')
  assert.equal(energy.summarize(pair, { 'demo-washer-1': 0, 'demo-dryer-1': 0 }).totalWh, 0)
})

test('only dryer 1 follows the control; a current outage does not erase a historical month', () => {
  for (const language of ['en', 'hr']) {
    for (const state of ['RUNNING', 'PAUSED', 'END_OF_CYCLE', 'OFFLINE']) {
      const devices = fixtures.createDevices(1000, state, language)
      assert.equal(devices.length, 8)
      assert.equal(devices[5].id, 'demo-dryer-1')
      assert.equal(devices[5].state, state === 'OFFLINE' ? null : state)
      assert.equal(devices[7].state, 'RUNNING')
      assert.equal(energy.summarize(devices).totalWh, 188000)
      assert.equal(devices[0].name, language === 'hr' ? 'Perilica 1' : 'Washer 1')
      assert.equal(devices[5].name, language === 'hr' ? 'Sušilica 1' : 'Dryer 1')
      assert.ok(devices[3].message.includes(language === 'hr' ? 'je potvrđeno' : 'has been confirmed'))
    }
  }
})
