import json
d=json.load(open('all.json'))
def arr(layers): return '[' + ','.join(json.dumps([l['r'],l['d']]) for l in layers) + ']'
out=["// Wygenerowane z ilustracji wzorcowych (scripts/fighter-trace). Warstwy: [rola, ścieżka] w układzie 1024 px.",
"export type Layer = [string, string];",
"export interface AgeArt { body: Layer[]; hair: Record<string, Layer[]>; beard: Record<string, Layer[]>; faceB: Layer[] }",
"export const ART: Record<'young' | 'adult' | 'vet', AgeArt> = {"]
for k in ['young','adult','vet']:
    s=d[k]
    out.append(f"  {k}: {{")
    out.append(f"    body: {arr(s['body'])},")
    out.append("    hair: {"+','.join(f"{h}: {arr(v)}" for h,v in s['hair'].items())+"},")
    out.append("    beard: {"+','.join(f"{h}: {arr(v)}" for h,v in s['beard'].items())+"},")
    out.append(f"    faceB: {arr(s['faceB'])},")
    out.append("  },")
out.append("};")
open('../../src/ui/fighterData.ts','w').write('\n'.join(out)+'\n')
