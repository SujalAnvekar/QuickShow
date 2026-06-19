import OpenAI from 'openai'

const openai=new OpenAI({
    apiKey:process.env.GEMINI_API_KEY
})

export default openai;