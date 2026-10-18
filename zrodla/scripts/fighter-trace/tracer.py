import numpy as np, potrace
from scipy import ndimage as nd
def clean(mask, minarea=30, smooth=1):
    m=mask.copy()
    if smooth:
        m=nd.binary_closing(m,iterations=smooth)
        m=nd.binary_opening(m,iterations=smooth)
    lab,n=nd.label(m)
    if n:
        sz=nd.sum(m,lab,range(1,n+1))
        keep=np.zeros(n+1,bool); keep[1:]=sz>=minarea
        m=keep[lab]
    # fill tiny holes
    holes=nd.binary_fill_holes(m)&~m
    lab,n=nd.label(holes)
    if n:
        sz=nd.sum(holes,lab,range(1,n+1))
        small=np.zeros(n+1,bool); small[1:]=sz<minarea
        m=m|small[lab]
    return m
def trace(mask, k=0.5, ox=0, oy=0, alphamax=1.0, turd=8, prec=1):
    bm=potrace.Bitmap(~mask.astype(bool))
    pl=bm.trace(turdsize=turd, alphamax=alphamax, opticurve=True, opttolerance=0.3)
    f=lambda p: f"{round(p.x*k+ox,prec):g} {round(p.y*k+oy,prec):g}"
    out=[]
    for c in pl:
        s=[f"M{f(c.start_point)}"]
        for seg in c.segments:
            if seg.is_corner: s.append(f"L{f(seg.c)}L{f(seg.end_point)}")
            else: s.append(f"C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}")
        s.append("Z"); out.append(''.join(s))
    return ''.join(out)
