# Codebase stats: 

## Lines checken
```
 find . \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.next/*" \
  -print | xargs wc -l | tail -n 1
```