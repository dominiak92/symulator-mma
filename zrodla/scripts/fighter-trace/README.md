# Przerysowanie zawodników

Trzy pary obrazów wzorcowych (postać + arkusz głów, tło magenta): dorosły, młody, weteran.
Z nich powstaje `src/ui/fighterData.ts`: dla każdego wieku ciało z łysą głową, fryzury i zarost
przeniesione na tę głowę oraz druga twarz. `FighterArt.tsx` przemalowuje warstwy (skóra, włosy,
narożnik) i wybiera wersję wg wieku (do 21 lat młody, od 33 weteran).

    pip install potracer scikit-learn scipy pillow
    python3 build_all.py && python3 gen_all_ts.py
