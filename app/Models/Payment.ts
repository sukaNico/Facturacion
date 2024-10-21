//app/Models/Payment.ts

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon' // Importar DateTime

export default class Payment extends BaseModel {
  public static table = 'payments' // Nombre de la tabla

  @column({ isPrimary: true })
  public id: number

  @column()
  public refPayco: number

  @column()
  public factura: string

  @column()
  public descripcion: string

  @column()
  public valor: number

  @column()
  public iva: number

  @column()
  public valorneto: number

  @column()
  public moneda: string

  @column()
  public banco: string

  @column()
  public estado: string

  @column()
  public respuesta: string

  @column()
  public autorizacion: string

  @column()
  public recibo: number

  @column.dateTime()
  public fecha: DateTime;
  
  @column()
  public franquicia: string

  @column()
  public ip: string

  @column()
  public enpruebas: number

  @column()
  public tipoDoc: string

  @column()
  public documento: string

  @column()
  public nombres: string

  @column()
  public apellidos: string

  @column()
  public email: string

  @column()
  public ciudad: string

  @column()
  public direccion: string

  @column()
  public indPais: string


}
