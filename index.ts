import express, { Express, Request, Response} from "express"
import * as database from './config/database'
import 'dotenv/config'
import cors from "cors"
import mainV1Router from "./api/v1/routes"

const app: Express = express()
const port: number | string = process.env.PORT || 3000

database.connect()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

mainV1Router(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})