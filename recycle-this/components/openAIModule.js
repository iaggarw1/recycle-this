import OpenAI from "openai";


async function openaiCall(message) {
  console.log("yeeteth");
  const openai = new OpenAI({apiKey:'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'});
  
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: "Who won the world series in 2020?" },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });

return completion;
}

export default openaiCall;