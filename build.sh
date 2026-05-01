#!/usr/bin/env bash
# Build distributable ZIP for Chrome Web Store
set -euo pipefail

dist="dist"
name="holdup-extension-$(jq -r .version manifest.json).zip"
rm -rf "$dist"
mkdir -p "$dist"

# Include only runtime files
files=(
  manifest.json
  background.js
  content.js
  storage.js
  theme.js
  popup.html
  popup.js
  options.html
  options.js
  rules.json
  css/tailwind.css
  pages/interstitial/interstitial.html
  pages/interstitial/interstitial.js
  icons/icon16.png
  icons/icon48.png
  icons/icon128.png
)

for f in "${files[@]}"; do
  mkdir -p "$dist/$(dirname "$f")"
  cp "$f" "$dist/$f"
done

cd "$dist"
zip -r "../$name" ./*
cd ..

rm -rf "$dist"
echo "Built: $name"
unzip -l "$name"
