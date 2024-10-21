import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ePayco from 'epayco-sdk-node'
import { DateTime } from 'luxon'
import Payment from 'App/Models/Payment'


// Configuración de ePayco
const apiKey = "492cae83f3e37cb372ba40eceaf573a0"
const privateKey = "4bded72f7845230ab56f8a6ba3c708e1"
const language = "ES"
const test = true

const epayco = new ePayco({
  apiKey: apiKey,
  privateKey: privateKey,
  lang: language,
  test: test,
})

export default class PaymentController {
  // Función para crear el token de la tarjeta
  private async createToken(cardInfo: any) {
    try {
      const token = await epayco.token.create({
        "card[number]": cardInfo.card_number,
        "card[exp_year]": cardInfo.exp_year,
        "card[exp_month]": cardInfo.exp_month,
        "card[cvc]": cardInfo.cvc,
        "hasCvv": true,
      })
      return token
    } catch (error) {
      return { error: error.message }
    }
  }

  // Función para crear un cliente
  private async createCustomer(tokenCard: string, customerInfo: any) {
    try {

      
      const customer = await epayco.customers.create({
        name: customerInfo.name,
        last_name: customerInfo.last_name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        default: true,
        token_card: tokenCard,
      })
      return customer
    } catch (error) {
      return { error: error.message }
    }
  }

  // Función para procesar el pago
  private async processPayment(paymentInfo: any, customerId: string, tokenCard: string) {
    try {

      const response = await epayco.charge.create({
        token_card: tokenCard,
        customer_id: customerId,
        doc_type: "CC",
        doc_number: paymentInfo.doc_number,
        name: paymentInfo.name,
        last_name: paymentInfo.last_name,
        email: paymentInfo.email,
        city: paymentInfo.city,
        address: paymentInfo.address,
        phone: paymentInfo.phone,
        cell_phone: paymentInfo.cell_phone,
        bill: paymentInfo.bill,
        description: "Pago de servicios",
        value: paymentInfo.value,
        tax: "0",
        tax_base: paymentInfo.value,
        currency: "COP",
      })

      return response
    } catch (error) {
      return { error: error.message }
    }
  }

  // Método principal que maneja el proceso de pago
  public async handleProcessPayment({ request, response }: HttpContextContract) {
    const data = request.only([
      'card_number',
      'exp_year',
      'exp_month',
      'cvc',
      'name',
      'last_name',
      'email',
      'phone',
      'doc_number',
      'city',
      'address',
      'cell_phone',
      'bill',
      'value',
    ])

    // Crear token
    const tokenResponse = await this.createToken(data)
    console.log("Token response:", tokenResponse)

    if ('error' in tokenResponse) {
      return response.status(500).json(tokenResponse)
    }

    const tokenCard = tokenResponse.id
    if (!tokenCard) {
      return response.status(500).json({ error: "No se pudo generar el token de la tarjeta" })
    }

    // Crear cliente
    const customerResponse = await this.createCustomer(tokenCard, data)
    console.log("Customer response:", customerResponse)

    if ('error' in customerResponse) {
      return response.status(500).json(customerResponse)
    }

    const customerId = customerResponse.data?.customerId
    if (!customerId) {
      return response.status(500).json({ error: "No se pudo crear el cliente" })
    }

    // Procesar pago
    const paymentResponse = await this.processPayment(data, customerId, tokenCard)
    console.log("Payment response:", paymentResponse)

    if ('error' in paymentResponse) {
      return response.status(500).json(paymentResponse)
    }

    console.log(paymentResponse.data);
    
    const paymentData = paymentResponse.data;

    try {
      // Crear un nuevo registro de pago
      const paymentRecord = new Payment()
  paymentRecord.refPayco = paymentData.ref_payco
  paymentRecord.factura = paymentData.factura
  paymentRecord.descripcion = paymentData.descripcion
  paymentRecord.valor = paymentData.valor
  paymentRecord.iva = paymentData.iva
  paymentRecord.valorneto = paymentData.valorneto
  paymentRecord.moneda = paymentData.moneda
  paymentRecord.banco = paymentData.banco
  paymentRecord.estado = paymentData.estado
  paymentRecord.respuesta = paymentData.respuesta
  paymentRecord.autorizacion = paymentData.autorizacion
  paymentRecord.recibo = paymentData.recibo
  
  // Convertir la fecha con Luxon
  const parsedDate = DateTime.fromFormat(paymentData.fecha, 'yyyy-MM-dd HH:mm:ss', { zone: 'utc' })

  // Verifica si la conversión fue exitosa
  if (!parsedDate.isValid) {
    throw new Error('La fecha es inválida');
  }
  
  paymentRecord.fecha = parsedDate

  paymentRecord.franquicia = paymentData.franquicia
  paymentRecord.ip = paymentData.ip
  paymentRecord.enpruebas = paymentData.enpruebas
  paymentRecord.tipoDoc = paymentData.tipo_doc
  paymentRecord.documento = paymentData.documento
  paymentRecord.nombres = paymentData.nombres
  paymentRecord.apellidos = paymentData.apellidos
  paymentRecord.email = paymentData.email
  paymentRecord.ciudad = paymentData.ciudad
  paymentRecord.direccion = paymentData.direccion
  paymentRecord.indPais = paymentData.ind_pais

  // Guardar el registro en la base de datos
  await paymentRecord.save()

      return response.status(200).json(paymentResponse) // Respuesta final
    } catch (error) {
      return response.status(500).json({ error: "Error al guardar el pago: " + error.message })
    }
  
  }


}
