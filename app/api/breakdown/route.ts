import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { task, stepsCount = 3 } = await req.json();

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Zadejte prosím úkol.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Chytrý lokální generátor pro offline testování bez API klíče
    if (!apiKey) {
      const lower = task.toLowerCase();
      let smartSteps = [
        `1. Seber první 3 věci, které vidíš, a dej je na místo`,
        `2. Nastav si timer na 5 minut a dělej jen tuto jednu část`,
        `3. Zastav se, nadechni a oceň se za splněný kousek`
      ];

      if (lower.includes('stůl') || lower.includes('uklidit') || lower.includes('pokoj')) {
        smartSteps = [
          `1. Odnes všechny špinavé skleničky, hrnky a talíře do kuchyně`,
          `2. Vyhoď všechny papírky a obaly přímo do odpadkového koše`,
          `3. Shrň všechny tužky do kelímku a sešity srovnej na jednu hromádku`
        ];
      } else if (lower.includes('mail') || lower.includes('e-mail') || lower.includes('zpráv')) {
        smartSteps = [
          `1. Otevři schránku a smaž zprávy, které jsou jen letáky`,
          `2. Vyber 1 nejdůležitější e-mail a napiš k němu odpověď o 2 větách`,
          `3. Schránku zavři a odejdi od počítače na 3 minuty`
        ];
      } else if (lower.includes('učit') || lower.includes('úkol') || lower.includes('škola')) {
        smartSteps = [
          `1. Otevři sešit na správné stránce a polož vedle něj pero`,
          `2. Přečti si pouze zadání prvního cvičení`,
          `3. Napiš odpověď na první otázku`
        ];
      }

      if (stepsCount > 3) {
        smartSteps.push(`4. Zkontroluj výsledek jedním pohledem`);
        smartSteps.push(`5. Hotovo! Zavři věci a dej si odměnu`);
      }

      return NextResponse.json({ steps: smartSteps.slice(0, stepsCount) });
    }

    // Expertní prompt pro OpenAI GPT-4o-mini
    const prompt = `Jsi špičkový asistent pro neurodivergentní lidi a rodiče dětí s ADHD.
Tvým úkolem je vzít paralyzující úkol a rozložit ho přesně do ${stepsCount} ULTRA-KONKRÉTNÍCH FYZICKÝCH mikro-kroků.

STRIKTNÍ PRAVIDLA:
1. ŽÁDNÉ obecné meta-fráze jako "připrav se", "naplánuj si", "začni pracovat", "udělej úkol", "soustřeď se".
2. Každý krok musí být fyzicky hmatatelná mikro-akce (např. 'Odnes hrnek do dřezu', 'Otevři sešit na straně 10', 'Napiš první větu').
3. Pokud úkol zadává rodič o dítěti (např. 'dcera si musí uklidit stůl'), formuluj kroky jako hravé, jednoduché instrukce pro dítě.
4. Výstup musí být VÝHRADNĚ platný JSON formát: {"steps": ["1. ...", "2. ...", "3. ..."]}

Úkol: "${task}"`;

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

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const steps = parsed.steps || Object.values(parsed)[0];

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se rozpadnout úkol.' },
      { status: 500 }
    );
  }
}
