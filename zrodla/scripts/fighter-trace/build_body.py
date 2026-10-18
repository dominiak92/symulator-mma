import json, numpy as np
from scipy import ndimage as nd
from classify import *
from tracer import *
a=load('wzor-postac.png'); cls,fg=classify(a)
N={n:i for i,n in enumerate(NAMES)}
H,W=cls.shape
yy,xx=np.mgrid[0:H,0:W]
# hair region (2x coords): dark gray in head zone
head=(yy<2*330)&(xx>2*360)&(xx<2*665)
hair=(cls==N['glove'])&head
hair=clean(hair,minarea=200,smooth=2)
hairZ=nd.binary_dilation(hair,iterations=10)
hairH=(cls==N['skinL'])&hairZ&(yy<2*250)
bg=~fg
nearBg=nd.binary_dilation(bg,iterations=14)
outM=(cls==N['out'])
brow=outM&(yy>2*234)&(yy<2*258)&(((xx>2*423)&(xx<2*498))|((xx>2*526)&(xx<2*601)))
# bald: hair->skin ; inner outlines in hair zone removed
cls2=cls.copy()
cls2[hair|hairH]=N['skin']
inner=outM&hairZ&~nearBg&(yy<2*236)
cls2[inner]=N['skin']
layers=[]
def add(role,mask,minarea=30,smooth=1,alphamax=1.0):
    m=clean(mask,minarea,smooth)
    if m.sum()==0: return
    layers.append({'r':role,'d':trace(m,k=0.5,prec=0,alphamax=alphamax)})
add('skin',fg,500,2)
for r in ['skinS','skinH','skinL','glove','gloveH','strap','strapS','strapH','white']:
    add(r,cls2==N[r])
add('brow',brow,20,0)
add('out',(cls2==N['out'])&~brow,20,1)
hairLayers=[]
def addh(role,mask,minarea=30,smooth=1):
    m=clean(mask,minarea,smooth)
    if m.sum(): hairLayers.append({'r':role,'d':trace(m,k=0.5,prec=0)})
addh('hair',hair|hairH|(nd.binary_dilation(hair,iterations=8)&outM&(yy<2*300)),100,2)
addh('hairH',hairH,30,1)
addh('out',outM&nd.binary_dilation(hair,iterations=6)&~brow&(yy<2*300),20,1)
json.dump({'body':layers,'hairShort':hairLayers},open('body.json','w'))
print({l['r']:len(l['d']) for l in layers}, sum(len(l['d']) for l in layers), sum(len(l['d']) for l in hairLayers))
