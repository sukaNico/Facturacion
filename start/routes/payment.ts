
import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
    Route.post("/payment", "PaymentController.handleProcessPayment");
})

