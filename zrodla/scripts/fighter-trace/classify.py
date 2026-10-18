import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROLES = {
  # role: list of reference colors
  'skin':   [(241,176,140),(233,166,131),(239,176,148),(208,150,122)],
  'skinS':  [(189,117,91),(182,127,100),(169,109,86)],
  'skinH':  [(252,211,186)],
  'skinL':  [(107,48,38),(129,88,72),(130,83,64)],
  'hair':   [(76,45,28),(101,62,45)],
  'glove':  [(59,55,54),(41,38,37)],
  'gloveH': [(117,115,114)],
  'strap':  [(218,46,42)],
  'strapS': [(171,32,35)],
  'strapH': [(246,97,91)],
  'white':  [(251,244,238)],
  'out':    [(57,22,12),(50,14,6),(63,24,12)],
}
NAMES=list(ROLES)
def load(path, box=None, scale=2):
    im=Image.open(path).convert('RGB')
    if box: im=im.crop(box)
    im=im.resize((im.width*scale, im.height*scale), Image.LANCZOS)
    a=np.asarray(im).astype(float)
    return a
def classify(a, roles=None):
    roles = roles or NAMES
    r,g,b=a[...,0],a[...,1],a[...,2]
    mag=np.minimum(r,b)-g
    fg=mag<70
    fg=nd.binary_fill_holes(nd.binary_opening(fg,iterations=2))
    refs=[];idx=[]
    for i,n in enumerate(NAMES):
        if n not in roles: continue
        for c in ROLES[n]: refs.append(c); idx.append(i)
    refs=np.array(refs,float); idx=np.array(idx)
    d=((a[...,None,:]-refs[None,None])**2).sum(-1)
    cls=idx[d.argmin(-1)]
    cls[~fg]=-1
    return cls, fg
PAL={'skin':(241,176,140),'skinS':(189,117,91),'skinH':(252,211,186),'skinL':(120,62,48),'hair':(70,40,25),'glove':(50,47,46),'gloveH':(117,115,114),'strap':(218,46,42),'strapS':(171,32,35),'strapH':(246,97,91),'white':(251,244,238),'out':(40,15,6)}
def viz(cls, path):
    out=np.zeros(cls.shape+(3,),np.uint8); out[:]=(255,0,255)
    for i,n in enumerate(NAMES): out[cls==i]=PAL[n]
    Image.fromarray(out).save(path)
