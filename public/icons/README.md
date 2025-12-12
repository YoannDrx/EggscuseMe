# PWA Icons

Les icônes PWA doivent être générées à partir du fichier source `/public/images/icon.png`.

## Icônes nécessaires

| Fichier | Taille | Usage |
|---------|--------|-------|
| `icon-192x192.png` | 192x192 | Android standard |
| `icon-512x512.png` | 512x512 | Android large |
| `icon-maskable-192.png` | 192x192 | Android maskable (avec padding 10%) |
| `icon-maskable-512.png` | 512x512 | Android maskable large |
| `apple-touch-icon.png` | 180x180 | iOS |
| `badge-72x72.png` | 72x72 | Notification badge |
| `shortcut-fridge.png` | 96x96 | Raccourci Frigo |
| `shortcut-timer.png` | 96x96 | Raccourci Timer |
| `shortcut-add.png` | 96x96 | Raccourci Ajouter |

## Génération avec ImageMagick

```bash
# Standard icons
convert ../images/icon.png -resize 192x192 icon-192x192.png
convert ../images/icon.png -resize 512x512 icon-512x512.png
convert ../images/icon.png -resize 180x180 apple-touch-icon.png
convert ../images/icon.png -resize 72x72 badge-72x72.png

# Maskable icons (avec padding 10%)
convert ../images/icon.png -resize 154x154 -gravity center -background "#D4A853" -extent 192x192 icon-maskable-192.png
convert ../images/icon.png -resize 410x410 -gravity center -background "#D4A853" -extent 512x512 icon-maskable-512.png

# Shortcut icons
convert ../images/icon.png -resize 96x96 shortcut-fridge.png
convert ../images/icon.png -resize 96x96 shortcut-timer.png
convert ../images/icon.png -resize 96x96 shortcut-add.png
```

## Outils en ligne

- https://maskable.app/ - Pour créer les icônes maskable
- https://realfavicongenerator.net/ - Générateur complet de favicons
- https://www.pwabuilder.com/imageGenerator - Générateur PWA
