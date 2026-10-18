"""Buduje warstwy dla jednego wieku: ciało (łysa głowa), krótkie włosy z ciała, oraz
fryzury/zarost/drugą twarz z arkuszy, przeniesione (warp) na głowę ciała."""
import json, sys, numpy as np
from scipy import ndimage as nd
from classify import *
from tracer import clean
from tracer_rel import trace
N={n:i for i,n in enumerate(NAMES)}
HAIRC=[N['hair'],N['skinL'],N['glove'],N['gloveH']]

def runs(col):
    ys=np.where(col)[0]; out=[]
    if not len(ys): return out
    s=ys[0]; p=ys[0]
    for y in ys[1:]:
        if y!=p+1: out.append((s+p)/2); s=y
        p=y
    out.append((s+p)/2); return out

def measure(cls, fg, x0,x1,y0,y1, scale):
    """Zwraca (top, eye_y, eye_x, mouth, chin, skull_width) w px 1x."""
    k=scale
    sub=lambda m: m[y0*k:y1*k, x0*k:x1*k]
    F=sub(fg); C=sub(cls)
    top=np.argmax(F.any(1))/k+y0
    zone=np.zeros_like(F); zone[int((top-y0+40)*k):int((top-y0+260)*k)]=True
    wy,wx=np.where((C==N['white'])&zone)
    # oczy: dwie największe grupy bieli
    m=(C==N['white'])&zone
    lab,n=nd.label(m); sz=nd.sum(m,lab,range(1,n+1)); idx=list(np.argsort(sz)[-8:]+1)
    cand=[(nd.center_of_mass(lab==i), sz[i-1]) for i in idx]
    best=None
    for i in range(len(cand)):
        for j in range(i+1,len(cand)):
            (a1,s1),(a2,s2)=cand[i],cand[j]
            dy=abs(a1[0]-a2[0])/k; dx=abs(a1[1]-a2[1])/k
            if 30<dx<160 and dy<10 and min(s1,s2)/max(s1,s2)>0.4:
                sc=s1+s2-dy*20
                if best is None or sc>best[0]: best=(sc,[a1,a2])
    cs=best[1]
    ey=np.mean([c[0] for c in cs])/k+y0; ex=np.mean([c[1] for c in cs])/k+x0
    span=ey-top
    body = (x1-x0)>250
    mouth = ey + (0.606 if body else 0.56)*span
    chin = ey + (0.898 if body else 1.06)*span
    w=0
    for y in range(int(top), int(top+0.62*span)):
        xs=np.where(F[int((y-y0)*k)])[0]
        if len(xs): w=max(w,(xs.max()-xs.min())/k)
    if not body:
        top=ey-107; mouth=ey+60; chin=ey+113.5; w=144
    return dict(top=top,ey=ey,ex=ex,mouth=mouth,chin=chin,w=w)

def body_layers(path):
    a=load(path); cls,fg=classify(a)
    H,W=cls.shape; yy,xx=np.mgrid[0:H,0:W]
    fg=fg&(yy<2*1000)
    cls[~fg]=-1
    # łysa głowa: pomiar na ciele (zakres głowy)
    M=measure(cls,fg,330,700,40,520,2)
    top,ey,ex=M['top'],M['ey'],M['ex']
    head=(yy<2*(ey+60))&(xx>2*(ex-150))&(xx<2*(ex+150))
    hair=((cls==N['glove'])|(cls==N['gloveH']))&head&(yy<2*(ey+20))
    hair=clean(hair,minarea=400,smooth=2)
    hairZ=nd.binary_dilation(hair,iterations=10)
    hairH=((cls==N['skinL'])|(cls==N['gloveH']))&hairZ&(yy<2*(ey-18))
    bg=~fg; nearBg=nd.binary_dilation(bg,iterations=14)
    outM=cls==N['out']
    browband=(yy>2*(ey-36))&(yy<2*(ey-11))&(np.abs(xx-2*ex)>2*6)&(np.abs(xx-2*ex)<2*95)
    brow=outM&browband
    cls2=cls.copy()
    cls2[hair|hairH]=N['skin']
    inner=outM&hairZ&~nearBg&(yy<2*(ey-35))
    cls2[inner]=N['skin']
    L=[]
    def add(role,mask,minarea=30,smooth=1):
        m=clean(mask,minarea,smooth)
        if m.sum(): L.append({'r':role,'d':trace(m,k=0.5,prec=0)})
    add('skin',fg,500,2)
    for r in ['skinS','skinH','skinL','glove','gloveH','strap','strapS','strapH','white']:
        add(r,cls2==N[r])
    add('brow',brow,20,0)
    add('out',(cls2==N['out'])&~brow,20,1)
    HL=[]
    def addh(role,mask,minarea=30,smooth=1):
        m=clean(mask,minarea,smooth)
        if m.sum(): HL.append({'r':role,'d':trace(m,k=0.5,prec=0)})
    addh('hair',hair|hairH|(nd.binary_dilation(hair,iterations=8)&outM&(yy<2*(ey+20))),100,2)
    addh('hairH',hairH,30,1)
    addh('out',outM&nd.binary_dilation(hair,iterations=6)&~brow&(yy<2*(ey+20)),20,1)
    return L,HL,M

def sheet_cells(path):
    a=load(path); cls,fg=classify(a)
    f1=nd.binary_opening(fg[::2,::2],iterations=1); lab,n=nd.label(f1)
    sl=[s for s,z in zip(nd.find_objects(lab),nd.sum(f1,lab,range(1,n+1))) if z>2000]
    boxes=sorted([(s[1].start,s[1].stop,s[0].start,s[0].stop) for s in sl], key=lambda b:(round(b[2]/250),b[0]))
    return cls,fg,boxes

def overlay(cls,box,M_s,M_b,kind,TH=2*620,TW=2*1024):
    x0,x1,y0,y1=box
    SX=M_b['w']/M_s['w']
    rel_s=np.array([-600, M_s['top']-M_s['ey'], 0, M_s['mouth']-M_s['ey'], M_s['chin']-M_s['ey'], 600.])
    by=np.array([M_b['top']-(600+M_s['top']-M_s['ey'])*(M_b['ey']-M_b['top'])/(M_s['ey']-M_s['top']), M_b['top'], M_b['ey'], M_b['mouth'], M_b['chin'], M_b['chin']+(600-(M_s['chin']-M_s['ey']))*1.05])
    Y,X=np.mgrid[0:TH,0:TW]
    xs=M_s['ex']+(X/2-M_b['ex'])/SX
    ys=M_s['ey']+np.interp(Y/2,by,rel_s)
    c=nd.map_coordinates(cls,[ys*2,xs*2],order=0,mode='constant',cval=-1)
    c[~((xs>=x0)&(xs<x1)&(ys>=y0)&(ys<y1))]=-1
    f=c>=0
    hairc=np.isin(c,HAIRC)
    eyb, exb = M_b['ey'], M_b['ex']
    if kind=='beard':
        m=hairc&(Y>2*(M_b['mouth']-(M_b['mouth']-eyb)*0.28))
        m=clean(m,minarea=150,smooth=1)
    elif kind=='face':
        m=None
    else:
        m=hairc&(Y<2*(eyb-7))&~((Y>2*(eyb-56))&(np.abs(X-2*exb)<2*80))
        m=clean(m,minarea=2500,smooth=1)
    L=[]
    if kind=='face':
        R=f&(Y<2*(M_b['chin']+11)); R=clean(R,2000,2)
        def add(role,mask,minarea=40,smooth=1):
            mm=clean(mask&R,minarea,smooth)
            if mm.sum(): L.append({'r':role,'d':trace(mm,k=0.5,prec=0)})
        add('skin',R,500,2)
        for r in ['skinS','skinH','skinL','white']: add(r,c==N[r])
        add('brow',np.isin(c,[N['hair'],N['glove']]),30)
        add('out',c==N['out'],30)
        return L
    if m.sum()==0: return L
    R=nd.binary_fill_holes(nd.binary_dilation(m,iterations=8))&f
    R=clean(R,minarea=400,smooth=2)
    near=nd.binary_dilation(m,iterations=6)
    def add(role,mask,minarea=40,smooth=1):
        mm=clean(mask&R,minarea,smooth)
        if mm.sum(): L.append({'r':role,'d':trace(mm,k=0.5,prec=0)})
    add('hair',R,200,2)
    if kind=='beard':
        for r in ['skin','skinS','skinH']: add(r,c==N[r],80)
    add('hairH',np.isin(c,[N['skinL'],N['gloveH']]),40)
    add('white',c==N['white'],30)
    add('out',(c==N['out'])&(near|nd.binary_fill_holes(m)),40)
    return L
