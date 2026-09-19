# Source assets

`envelope-opening-master.mp4` — the original 5.17s envelope clip (1440x1568, with audio).
Kept here rather than in `public/` so it is not shipped to visitors.

The site no longer ships a derived clip — the envelope now plays
`public/assets/luxury_envelope_opening_1.mp4`, and the cut below was removed in the
production asset sweep. The recipe is kept because it still regenerates from the
master if the earlier treatment is ever wanted back.

`public/assets/envelope-open.mp4` was derived from it: cropped to the envelope, the
1.55s pre-break glow sped up 2.2x, cut at the moment the card is fully revealed,
audio dropped. Regenerate with:

    ffmpeg -y -i assets-source/envelope-opening-master.mp4 -filter_complex \
      "[0:v]crop=1220:1330:110:0[k];[k]split=2[k1][k2];\
       [k1]trim=start=0:end=1.55,setpts=(PTS-STARTPTS)/2.2[a];\
       [k2]trim=start=1.55:end=4.30,setpts=(PTS-STARTPTS)[b];\
       [a][b]concat=n=2:v=1:a=0[c];\
       [c]scale=1024:-2:flags=lanczos,fps=30,format=yuv420p[v]" \
      -map "[v]" -an -c:v libx264 -profile:v main -level 4.0 -crf 27 -preset slow \
      -movflags +faststart public/assets/envelope-open.mp4

    ffmpeg -y -i public/assets/envelope-open.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 4 public/assets/envelope-sealed.jpg
    ffmpeg -y -sseof -0.08 -i public/assets/envelope-open.mp4 -frames:v 1 -q:v 4 public/assets/envelope-revealed.jpg
