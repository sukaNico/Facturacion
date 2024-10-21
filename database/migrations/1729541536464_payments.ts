import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Payments extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('ref_payco').notNullable()
      table.string('factura').notNullable()
      table.string('descripcion').notNullable()
      table.integer('valor').notNullable()
      table.integer('iva').notNullable()
      table.integer('valorneto').notNullable()
      table.string('moneda').notNullable()
      table.string('banco').notNullable()
      table.string('estado').notNullable()
      table.string('respuesta').notNullable()
      table.string('autorizacion').notNullable()
      table.integer('recibo').notNullable()
      table.timestamp('fecha').notNullable()
      table.string('franquicia').notNullable()
      table.string('ip').notNullable()
      table.integer('enpruebas').notNullable()
      table.string('tipo_doc').notNullable()
      table.string('documento').notNullable()
      table.string('nombres').notNullable()
      table.string('apellidos').notNullable()
      table.string('email').notNullable()
      table.string('ciudad').notNullable()
      table.string('direccion').notNullable()
      table.string('ind_pais').notNullable()
      table.timestamp('created_at').defaultTo(this.now()) // Cambiado aquí
      table.timestamp('updated_at').defaultTo(this.now()).nullable() 
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
