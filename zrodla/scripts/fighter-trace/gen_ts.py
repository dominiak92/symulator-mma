import json
b=json.load(open('body.json')); h=json.load(open('heads.json'))
def arr(layers): return '[' + ','.join(json.dumps([l['r'],l['d']]) for l in layers) + ']'
out=["// Wygenerowane z rysunku wzorcowego (scripts: trace). Warstwy: [rola, ścieżka] w układzie 1024 px.",
"export type Layer = [string, string];",
f"export const BODY: Layer[] = {arr(b['body'])};",
"export const HAIR: Record<string, Layer[]> = {"]
out.append(f"  short: {arr(b['hairShort'])},")
for k in ['fade','slick','curly','mohawk','bun','buzz']:
    out.append(f"  {k}: {arr(h[k]['layers'])},")
out.append("};")
out.append(f"export const FACE_B: Layer[] = {arr(h['faceB']['layers'])};")
out.append("export const BEARD: Record<string, Layer[]> = {")
out.append(f"  full: {arr(h['beard']['layers'])},")
out.append(f"  goatee: {arr(h['goatee']['layers'])},")
out.append("};")
open('../../src/ui/fighterData.ts','w').write('\n'.join(out)+'\n')
