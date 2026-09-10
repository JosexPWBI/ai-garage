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
    const {
      year,
      make,
      model,
      goal,
      budget,
      horsepowerGoal,
    } = req.body

    if (!year || !make || !model || !goal || !budget) {
      return res.status(400).json({
        error: 'Missing required vehicle or build information.',
      })
    }

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',

      input: `
You are the Project We Built It AI Garage automotive build advisor.

Create a practical modification plan for this vehicle.

Vehicle:
Year: ${year}
Make: ${make}
Model: ${model}

Build goal: ${goal}
Build budget: $${budget}
Horsepower goal: ${
        horsepowerGoal
          ? `${horsepowerGoal} HP`
          : 'No specific horsepower goal'
      }

IMPORTANT HORSEPOWER INSTRUCTIONS:

If a horsepower goal is provided, you MUST explicitly evaluate that horsepower target.

State the requested horsepower number in the Advisor Summary.

Explain whether that horsepower target is realistic for this exact vehicle, build goal, and budget.

If the target is realistic:
- Explain the major upgrades needed to reach it safely.
- Include supporting modifications such as fueling, cooling, tuning, drivetrain, brakes, suspension, and reliability upgrades when appropriate.

If the target is NOT realistic:
- Clearly say that the requested horsepower is not realistic within the current budget or build goal.
- Explain why.
- Give a more realistic horsepower range for the vehicle and budget.
- Do not recommend unsafe shortcuts just to reach the requested number.

Prioritize:
1. Safety
2. Reliability
3. Realistic horsepower expectations
4. Sensible modification order
5. Staying within the user's budget
6. Supporting modifications before aggressive power increases

Return the response using this structure:

### PWBI AI Garage Advisor

**Advisor Summary**

Give a concise summary of the build.

If a horsepower goal was provided, explicitly mention the requested horsepower and whether it is realistic.

**Recommended Upgrades**

Give exactly five recommended upgrades in priority order.

For each upgrade include:
- Upgrade name
- Suggested dollar allocation
- Why it matters
- How it supports the user's build goal
- How it contributes to the horsepower goal when applicable

Make sure the suggested allocations stay reasonably within the total build budget.

**Horsepower Assessment**

If a horsepower goal was provided:
- State the requested horsepower.
- State whether it is realistic.
- Give an estimated realistic horsepower range for this build and budget.
- Explain what would be required to go beyond that range.

If no horsepower goal was provided, briefly explain that horsepower was not specified.

**Modification to Wait On**

Identify modifications that should wait until safety, maintenance, reliability, and supporting systems are addressed.

Be practical and realistic. Do not promise exact horsepower numbers when results depend on engine condition, tuning, fuel, drivetrain, or dyno measurements.
      `,
    })

    res.json({
      advice: response.output_text,
    })
  } catch (error) {
    console.error('AI Garage error:', error)

    res.status(500).json({
      error: 'Unable to generate AI Garage advice.',
    })
  }
})

app.listen(port, () => {
  console.log(`AI Garage API running on http://localhost:${port}`)
})
