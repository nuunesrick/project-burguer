const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const pedidos = []

const checkUserId = (request, response, next) => {
    const { id } = request.params


    const index = pedidos.findIndex(pedido => pedido.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Pedido Não encontrado" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

const requestcheck = (request, response, next) =>{
    const method = request.method
    const url = request.url

    console.log(`[${method}] - ${url}`)
    next()
}


app.get("/pedidos",requestcheck, (request, response) => {

    return response.json({ pedidos })
})

app.post("/pedidos", requestcheck, (request, response) => {
    const { order, client, price, status } = request.body



    const pedido = { id: uuid.v4(), order, client, price, status: "Em preparação" }

    pedidos.push(pedido)
    return response.status(201).json({ pedido })
})

app.put("/pedidos/:id", checkUserId, requestcheck, (request, response) => {
    const { order, client, price, status } = request.body
    const index = request.userIndex
    const id = request.userId

    const alteracaoPedido = { id, order, client, price, status }

    pedidos[index] = alteracaoPedido

    return response.json({ alteracaoPedido })
})

app.delete("/pedidos/:id", checkUserId, requestcheck, (request, response) => {
    const index = request.userIndex


    pedidos.splice(index, 1)

    return response.status(201).json({ message: "Pedido Entregue" })
})

app.patch("/pedidos/:id", requestcheck, (request, response) => {

    const { id } = request.params
    const { status } = request.body

    const index = pedidos.findIndex(pedido => pedido.id === id)
    if (index !== -1) {
        pedidos[index].status = status || "Pronto"
        response.json(pedidos[index])
    } else {
        response.status(404).json({ message: "Pedido não encontrado!" })
    }


})

















app.listen(3000, () => {
    console.log(`🚀 Serve Started on port ${port}`)

})