import numpy as np, potrace
def trace(mask, k=0.5, ox=0, oy=0, alphamax=1.0, turd=8, prec=0):
    bm=potrace.Bitmap(~mask.astype(bool))
    pl=bm.trace(turdsize=turd, alphamax=alphamax, opticurve=True, opttolerance=0.3)
    out=[]
    def r(v): return int(round(v))
    for c in pl:
        px,py=r(c.start_point.x*k+ox), r(c.start_point.y*k+oy)
        s=[f"M{px} {py}"]
        for seg in c.segments:
            if seg.is_corner:
                ax,ay=r(seg.c.x*k+ox),r(seg.c.y*k+oy); bx,by=r(seg.end_point.x*k+ox),r(seg.end_point.y*k+oy)
                s.append(f"l{ax-px} {ay-py} {bx-ax} {by-ay}"); px,py=bx,by
            else:
                a=(r(seg.c1.x*k+ox),r(seg.c1.y*k+oy)); b=(r(seg.c2.x*k+ox),r(seg.c2.y*k+oy)); e=(r(seg.end_point.x*k+ox),r(seg.end_point.y*k+oy))
                s.append(f"c{a[0]-px} {a[1]-py} {b[0]-px} {b[1]-py} {e[0]-px} {e[1]-py}"); px,py=e
        s.append("z"); out.append(''.join(s))
    d=''.join(out)
    return d.replace(' -','-')
