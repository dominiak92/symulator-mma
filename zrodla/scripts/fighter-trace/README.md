# Przerysowanie zawodników

Z dwóch obrazów wzorcowych (`wzor-postac.png`, `wzor-glowy.png`, tło magenta) powstaje
`src/ui/fighterData.ts`: warstwy wektorowe (kontur, tony skóry, włosy, rękawice, taśma),
które `FighterArt.tsx` przemalowuje (skóra, włosy, narożnik) i składa z fryzurami i zarostem.

    pip install potracer scikit-learn scipy pillow
    python3 build_body.py && python3 build_heads.py && python3 gen_ts.py
