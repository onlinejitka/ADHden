import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let task = "";
  let stepsCount = 3;

  try {
    const body = await req.json();
    task = body.task || "";
    stepsCount = body.stepsCount || 3;

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Zadejte prosím úkol.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    // Pokud je klíč zadán, zkusíme OpenAI
    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const prompt = `Jsi laskavý specialista na ADHD pro aplikaci Denní Knihovna.
Rozlož následující úkol přesně na ${stepsCount} ultra-konkrétní fyzické mikrokroky (žádné obecné řeči jako "naplánuj si" nebo "soustřeď se").
Úkol: "${task}"

Vrať POUZE JSON ve tvaru:
{"steps": ["1. konkrétní fyzický krok", "2. konkrétní fyzický krok", "3. konkrétní fyzický krok"]}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.6,
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
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn("OpenAI API odpovědělo chybou (např. kredit):", errData);
        }
      } catch (aiErr) {
        console.warn("Chyba při volání OpenAI, použije se záložní logika:", aiErr);
      }
    }

    // Inteligentní záložní generátor, který VŽDY zafunguje
    const lower = task.toLowerCase();
    let generatedSteps: string[] = [];

    if (lower.includes('kuchyň') || lower.includes('nádobí') || lower.includes('vaření')) {
      generatedSteps = [
        "1. Naskládej všechny špinavé hrnky a talíře do dřezu nebo myčky",
        "2. Vyhoď obaly a zkažené jídlo do koše a setři linku hadříkem",
        "3. Ukliď z linky 3 věci na své stálé místo a oceň se za hotovo"
      ];
    } else if (lower.includes('stůl') || lower.includes('pokoj') || lower.includes('uklid')) {
      generatedSteps = [
        "1. Seber všechny skleničky a hrnky a odnes je pryč",
        "2. Vyhoď všechny zjevné odpadky a papírky do koše",
        "3. Srovnej tužky a sešity na jednu čistou hromádku"
      ];
    } else if (lower.includes('mail') || lower.includes('zpráv') || lower.includes('psát')) {
      generatedSteps = [
        "1. Otevři schránku a smaž zbytečné reklamní e-maily",
        "2. Vyber 1 nejdůležitější zprávu a napiš k ní stručnou odpověď",
        "3. Zavři e-mail a dopřej si 3 minuty odpočinek"
      ];
    } else if (lower.includes('učit') || lower.includes('úkol') || lower.includes('škola')) {
      generatedSteps = [
        "1. Otevři sešit na správné stránce a polož si k ruce pero",
        "2. Přečti si pouze zadání prvního cvičení",
        "3. Napiš odpověď na první otázku a dej si malou pauzu"
      ];
    } else {
      generatedSteps = [
        `1. Připrav si prostor a věci potřebné pro: ${task.slice(0, 35)}...`,
        "2. Nastav si timer na 5 minut a věnuj se pouze první malé části",
        "3. Zastav se, zhluboka se nadechni a odškrtni první úspěch"
      ];
    }

    if (stepsCount > 3) {
      generatedSteps.push("4. Zkontroluj jedním pohledem, co se podařilo");
      generatedSteps.push("5. Hotovo! Zavři úkol a odměň se");
    }

    return NextResponse.json({ steps: generatedSteps.slice(0, stepsCount) });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Nastala chyba při zpracování úkolu.' },
      { status: 500 }
    );
  }
}
