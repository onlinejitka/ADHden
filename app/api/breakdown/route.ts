import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { task, stepsCount = 3 } = await req.json();

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Zadejte prosím úkol.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Pokud ještě nemáte nastaven API klíč ve Vercelu, vrátí inteligentní fallback
    if (!apiKey) {
      return NextResponse.json({
        steps: [
          `1. Připrav prostor a otevři potřebné věci pro: ${task.slice(0, 30)}...`,
          `2. Věnuj se úkolu po dobu 5 minut bez řešení dokonalosti`,
          `3. Ukliď pracovní plochu a oceň se za splnění`
        ]
      });
    }

    const prompt = `Jsi asistent pro lidi s ADHD a exekutivní dysfunkcí.
Tvým úkolem je vzít těžký nebo paralyzující úkol a rozpadnout ho přesně do ${stepsCount} mikrokroků.
Pravidla:
1. Každý krok musí být extrémně jednoduchý a fyzicky snadno zahájitelný (low friction).
2. Žádná moralizování, pocity viny ani zbytečný text.
3. Vrať VÝHRADNĚ JSON pole řetězců ve formátu: ["1. krok...", "2. krok...", "3. krok..."]

Úkol k rozpadu: "${task}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const steps = Array.isArray(parsed) ? parsed : (parsed.steps || Object.values(parsed));

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se rozpadnout úkol. Zkuste to znovu.' },
      { status: 500 }
    );
  }
}
