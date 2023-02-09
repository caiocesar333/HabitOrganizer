import { FastifyInstance } from "fastify"
import WebPush from "web-push"
import { z } from "zod"


const publicKey = "BCpLjQP06TAIwNMbYWBOJ7oqOALMJFcNob2xTOE3Ad0XbvKhQnaYWnrFHyZieF5oW-IHjqDZaFNPibyashLSRYs"
const privateKey = "38ebpatYuompSF88XKqdgccOB7UIhl7Ds8p7xa8Cu8E"

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationsRoutes(app: FastifyInstance) {
    app.get('/push/public_key', () => {
        return { publicKey, }
    })


    app.post('/push/register', (request, reply) => {
        console.log('request.body', request.body)

        return reply.status(201).send()
    })

    app.post('/push/send', async (request, reply) => {

        const sendPushBody = z.object({
            subscription: z.object({
                endpoint: z.string(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string()
                })
            })
        })

        const {subscription} = sendPushBody.parse(request.body)

       setTimeout(()=>{

       })

        return reply.status(201).send()
    })
}