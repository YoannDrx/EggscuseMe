# EggscuseMe

## Recherche de Code

Ce projet utilise **grepai** pour la recherche sémantique de code.

### Commandes

```bash
# Recherche sémantique
~/.local/bin/grepai search "ta question en langage naturel"

# Tracer les appels
~/.local/bin/grepai trace callers "nomFonction"
~/.local/bin/grepai trace callees "nomFonction"

# Status de l'index
~/.local/bin/grepai status
```

### Exemples de recherches

```bash
~/.local/bin/grepai search "Comment fonctionne le système de jeu ?"
~/.local/bin/grepai search "Où sont définies les règles du gameplay ?"
~/.local/bin/grepai search "Comment est géré le scoring ?"
```
