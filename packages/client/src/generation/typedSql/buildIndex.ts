import { SqlQueryOutput } from '@prisma/generator-helper'

import * as ts from '../ts-builders'
import { Writer } from '../ts-builders/Writer'

export function buildIndexTs(queries: SqlQueryOutput[]) {
  const file = ts.file()
  for (const query of queries) {
    file.add(ts.moduleExportFrom('*', `./${query.name}`))
  }
  return ts.stringify(file)
}

export function buildIndexCjs(queries: SqlQueryOutput[]) {
  const writer = new Writer(0, undefined)
  writer.writeLine('"use strict"')
  for (const { name } of queries) {
    writer.writeLine(`exports.${name} = require("./${name}.js").${name}`)
  }
  return writer.toString()
}

export function buildIndexEsm(queries: SqlQueryOutput[]) {
  const writer = new Writer(0, undefined)
  for (const { name } of queries) {
    writer.writeLine(`export * from "./${name}.mjs"`)
  }
  return writer.toString()
}
