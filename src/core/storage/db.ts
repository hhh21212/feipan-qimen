import { openDB, type IDBPDatabase } from 'idb'
import type { QimenRecord } from '../../types/record'

const DB_NAME = 'feipan-qimen'
const STORE = 'records'

let dbp: Promise<IDBPDatabase> | null = null

function db(): Promise<IDBPDatabase> {
  if (!dbp) {
    dbp = openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE)) {
          const store = database.createObjectStore(STORE, { keyPath: 'id' })
          store.createIndex('createdAt', 'createdAt')
          store.createIndex('starred', 'starred')
        }
      },
    })
  }
  return dbp
}

export async function saveRecord(rec: QimenRecord): Promise<void> {
  await (await db()).put(STORE, rec)
}

export async function listRecords(): Promise<QimenRecord[]> {
  const all = await (await db()).getAll(STORE)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function getRecord(id: string): Promise<QimenRecord | undefined> {
  return (await db()).get(STORE, id)
}

export async function deleteRecord(id: string): Promise<void> {
  await (await db()).delete(STORE, id)
}

export async function clearRecords(): Promise<void> {
  await (await db()).clear(STORE)
}

export async function exportRecords(): Promise<string> {
  const all = await listRecords()
  return JSON.stringify({ version: 1, records: all }, null, 2)
}

export async function importRecords(json: string): Promise<number> {
  const data = JSON.parse(json)
  const records: QimenRecord[] = Array.isArray(data?.records) ? data.records : []
  const d = await db()
  const tx = d.transaction(STORE, 'readwrite')
  for (const r of records) await tx.store.put(r)
  await tx.done
  return records.length
}
