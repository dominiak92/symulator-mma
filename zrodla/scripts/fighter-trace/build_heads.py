import json, numpy as np
from scipy import ndimage as nd
from classify import *
from tracer import *
a=load('wzor-glowy.png'); cls,fg=classify(a)
N={n:i for i,n in enumerate(NAMES)}
CELLS={'fade':(920,1120,15,290),'slick':(80,280,310,595),'curly':(500,700,295,595),'mohawk':(920,1120,285,595),
 'bun':(80,280,590,882),'buzz':(500,700,610,882),'beard':(500,700,610,882),'goatee':(920,1120,610,882)}
SX=1.66
BEX=509.1
REL_S=np.array([-400,-107,0,60,113.5,400.])
BODY_Y=np.array([77-293*1.79,77,268.8,385,441,441+286.5*1.05])
# target canvas in body 2x space
TH,TW=2*620,2*1024
Y,X=np.mgrid[0:TH,0:TW]
def warp(ex,ey):
    xs=(ex+(X/2-BEX)/SX)*2
    rel=np.interp(Y/2,BODY_Y,REL_S)
    ys=(ey+rel)*2
    c=nd.map_coordinates(cls,[ys,xs],order=0,mode='constant',cval=-1)
    return c
out={}
for name,(x0,x1,y0,y1) in CELLS.items():
    yy,xx=np.mgrid[0:cls.shape[0],0:cls.shape[1]]
    box=(xx>=2*x0)&(xx<2*x1)&(yy>=2*y0)&(yy<2*y1)
    wy,wx=np.where((cls==N['white'])&box)
    ey,ex=wy.mean()/2,wx.mean()/2
    c=warp(ex,ey)
    # restrict to source box
    xs=(ex+(X/2-BEX)/SX); ys=ey+np.interp(Y/2,BODY_Y,REL_S)
    inbox=(xs>=x0)&(xs<x1)&(ys>=y0)&(ys<y1)
    c[~inbox]=-1
    f=c>=0
    hairc=(c==N['hair'])|(c==N['skinL'])
    if name in ('beard','goatee'):
        m=hairc&(Y>2*352)
    else:
        m=hairc&(Y<2*262)&~((Y>2*212)&(X>2*(BEX-80))&(X<2*(BEX+80)))
    m=clean(m,minarea=150 if name in ('beard','goatee') else 2500,smooth=1)
    R=nd.binary_fill_holes(nd.binary_dilation(m,iterations=8))&f
    R=clean(R,minarea=400,smooth=2)
    near=nd.binary_dilation(m,iterations=6)
    layers=[]
    def add(role,mask,minarea=40,smooth=1):
        mm=clean(mask&R,minarea,smooth)
        if mm.sum(): layers.append({'r':role,'d':trace(mm,k=0.5,prec=0)})
    add('hair',R,200,2)
    if name in ('beard','goatee'):
        for r in ['skin','skinS','skinH']: add(r,c==N[r],80)
    add('hairH',(c==N['skinL']),40)
    add('white',c==N['white'],30)
    add('out',(c==N['out'])&(near|nd.binary_fill_holes(m)),40)
    out[name]={'layers':layers}
    print(name, round(ex,1), round(ey,1), sum(len(l['d']) for l in layers))
json.dump(out,open('heads.json','w'))

# druga twarz: cała łysa głowa z arkusza
x0,x1,y0,y1=(500,700,15,290)
yy,xx=np.mgrid[0:cls.shape[0],0:cls.shape[1]]
box=(xx>=2*x0)&(xx<2*x1)&(yy>=2*y0)&(yy<2*y1)
wy,wx=np.where((cls==N['white'])&box)
ey,ex=wy.mean()/2,wx.mean()/2
c=warp(ex,ey)
xs=(ex+(X/2-BEX)/SX); ys=ey+np.interp(Y/2,BODY_Y,REL_S)
c[~((xs>=x0)&(xs<x1)&(ys>=y0)&(ys<y1))]=-1
f=(c>=0)&(Y<2*452)
f=clean(f,minarea=2000,smooth=2)
layers=[]
def add2(role,mask,minarea=40,smooth=1):
    mm=clean(mask&f,minarea,smooth)
    if mm.sum(): layers.append({'r':role,'d':trace(mm,k=0.5,prec=0)})
add2('skin',f,500,2)
for r in ['skinS','skinH','skinL','white']: add2(r,c==N[r])
add2('brow',(c==N['hair']),30)
add2('out',c==N['out'],30)
out['faceB']={'layers':layers}
print('faceB',sum(len(l['d']) for l in layers))
json.dump(out,open('heads.json','w'))
