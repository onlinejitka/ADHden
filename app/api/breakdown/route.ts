import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let task = "";
  let stepsCount = 3;

  try {
    const body = await req.json();
    task = body.task || "";
    stepsCount = body.stepsCount || 3;

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Please enter a task.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const prompt = `You are a compassionate ADHD specialist for the ADHDen app.
Break down the following overwhelming task into exactly ${stepsCount} ULTRA-CONCRETE, PHYSICAL micro-steps.
STRICT RULES:
1. NO vague meta-instructions like "plan ahead", "get ready", or "focus".
2. Every step must be a simple, tangible physical movement (e.g. 'Put 3 mugs in the sink', 'Open document to page 1', 'Type first sentence').
3. Keep tone low-pressure, encouraging, and zero-shame.
4. Return ONLY valid JSON format: {"steps": ["1. ...", "2. ...", "3. ..."]}

Task: "${task}"`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            response_format: { type: 'json_object' }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          const steps = parsed.steps || Object.values(parsed)[0];
          if (Array.isArray(steps) && steps.length > 0) {
            return NextResponse.json({ steps });
          }
        }
      } catch (aiErr) {
        console.warn("AI error, using fallback:", aiErr);
      }
    }

    // Smart English Fallbacks
    const lower = task.toLowerCase();
    let generatedSteps: string[] = [];

    if (lower.includes('kitchen') || lower.includes('dish') || lower.includes('cook')) {
      generatedSteps = [
        "1. Move all cups, mugs, and plates directly into the sink or dishwasher",
        "2. Throw away visible food wrappers and wipe counter with a wet towel",
        "3. Put 3 spices or stray items back in the pantry, then take a deep breath"
      ];
    } else if (lower.includes('desk') || lower.includes('room') || lower.includes('clean')) {
      generatedSteps = [
        "1. Grab any stray glasses or bottles and take them out of the room",
        "2. Gather loose papers and stack them into one neat pile",
        "3. Put all pens into a cup and enjoy your clear workspace"
      ];
    } else if (lower.includes('mail') || lower.includes('inbox') || lower.includes('message')) {
      generatedSteps = [
        "1. Open your inbox and delete/archive 3 obvious promo newsletters",
        "2. Pick ONE priority message and reply with just two short sentences",
        "3. Close the tab and take a mindful 2-minute stretch"
      ];
    } else {
      generatedSteps = [
        `1. Set up the exact tools needed for: ${task.slice(0, 30)}...`,
        "2. Start a 5-minute timer and do only the first small piece without judgment",
        "3. Pause, take a slow exhale, and celebrate taking the first step"
      ];
    }

    if (stepsCount > 3) {
      generatedSteps.push("4. Take a quick step back and glance at what is done");
      generatedSteps.push("5. Done! Step away and claim your reward");
    }

    return NextResponse.json({ steps: generatedSteps.slice(0, stepsCount) });
  } catch (error: any) {
    return NextResponse.json({ error: 'Could not process task.' }, { status: 500 });
  }
}
