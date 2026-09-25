#!/bin/bash
echo "Waiting for images to finish downloading..."
while [ ! -f frontend/src/assets/images/professions/cenario_desenho.jpg ]; do
  sleep 10
done
sleep 5 # extra wait just to be sure it's fully written
git add frontend/src/app/features/games/professions/professions.component.ts
git add frontend/src/assets/images/professions/
git commit -m "feat(professions): replace all remaining emojis with high quality ai images"
git push origin main
echo "Done pushing!"
