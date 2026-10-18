import json
from build_set import *
SETS={'adult':('wzor-postac.png','wzor-glowy.png',['buzzS','bald','fade','slick','curly','mohawk','bun','beard','goatee']),
      'young':('wzor-postac-mlody.png','wzor-glowy-mlody.png',['buzz','bald','fade','slick','curly','mohawk','bun','messy','spiky']),
      'vet':('wzor-postac-weteran.png','wzor-glowy-weteran.png',['buzz','bald','fade','slick','curly','mohawk','bun','beard','goatee'])}
sheets={}
for k,(bp,hp,names) in SETS.items():
    cls,fg,boxes=sheet_cells(hp)
    ms=[measure(cls,fg,*b,2) for b in boxes]
    import numpy as _np
    for col in range(3):
        idx=[i for i,b in enumerate(boxes) if int(b[0]//400)==col]
        med=float(_np.median([ms[i]['ex'] for i in idx]))
        for i in idx: ms[i]['ex']=med
    sheets[k]=(cls,boxes,ms,names)
    print(k,'sheet',[ (n,round(m['ey']),round(m['mouth']),round(m['chin']),round(m['w'])) for n,m in zip(names,ms)])
STYLES=['fade','slick','curly','mohawk','bun','buzz','messy','spiky']
out={}
for k,(bp,hp,names) in SETS.items():
    B,HS,Mb=body_layers(bp)
    print(k,'body',{x:round(v) for x,v in Mb.items()})
    d={'body':B,'hair':{'short':HS},'beard':{}}
    pref=[k]+[o for o in SETS if o!=k]
    for st in STYLES:
        for src in pref:
            cls,boxes,ms,nm=sheets[src]
            nm2=[('buzz' if (n=='beard' and src=='adult') else n) for n in nm]
            if st in nm and not (src=='adult' and st=='buzz'):
                i=nm.index(st)
            elif st=='buzz' and src=='adult':
                i=nm.index('beard')
            else: continue
            d['hair'][st]=overlay(cls,boxes[i],ms[i],Mb,'hair'); break
    if k!='young':
        cls,boxes,ms,nm=sheets[k]
        for bd in ['beard','goatee']:
            i=nm.index(bd); d['beard']['full' if bd=='beard' else 'goatee']=overlay(cls,boxes[i],ms[i],Mb,'beard')
    cls,boxes,ms,nm=sheets[k]; i=nm.index('bald')
    d['faceB']=overlay(cls,boxes[i],ms[i],Mb,'face')
    out[k]=d
    print(k,'size',sum(len(l['d']) for l in B)+sum(len(l['d']) for v in d['hair'].values() for l in v)+sum(len(l['d']) for v in d['beard'].values() for l in v)+sum(len(l['d']) for l in d['faceB']))
json.dump(out,open('all.json','w'))
