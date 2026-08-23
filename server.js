import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/garage-advice', async (req, res) => {
  try {
    const { year, make, model, goal, budget } = req.body

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',
      input: `
You are an automotive build advisor for PWBI AI Garage.

Create a practical modification plan for this vehicle:

Year: ${year}
Make: ${make}
Model: ${model}
Build goal: ${goal}
Budget: $${budget}

Prioritize safety, reliability, realistic budget allocation, and sensible upgrade order.

Give:
1. A short advisor summary.
2. Five recommended upgrades in priority order.
3. A suggested dollar allocation for each upgrade.
4. One warning about modifications that should wait until later.
Do not use Markdown tables.
Use simple headings and numbered lists.
Keep each recommended upgrade easy to scan.

Keep the response concise and easy for a car enthusiast to understand.
      `,
    })

    res.json({
      advice: response.output_text,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Unable to generate AI Garage advice.',
    })
  }
})

app.listen(port, () => {
  console.log(`AI Garage API running on http://localhost:${port}`)
})