import express, { type Request, type Response } from "express"
import { linkRoute } from "./modules/links/link.route"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})


app.use('/api/link', linkRoute)

export default app