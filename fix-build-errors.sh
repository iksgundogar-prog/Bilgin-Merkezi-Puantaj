#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# VERCEL BUILD HATALARINI OTOMATIK DÜZELT
# ═══════════════════════════════════════════════════════════════════

echo "🔧 Vercel build hatalarını düzeltiyorum..."
echo ""

# Repo kök dizinine git
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "📁 Çalışma dizini: $(pwd)"
echo ""

# ═══════════════════════════════════════════════════════════════════
# 1. TÜM .ts VE .tsx UZANTILARINI İMPORT'LARDAN KALDIR
# ═══════════════════════════════════════════════════════════════════

echo "✂️  Import uzantılarını kaldırıyorum..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's/from "\([^"]*\)\.tsx\?"/from "\1"/g' {} \;
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s/from '\([^']*\)\.tsx\?'/from '\1'/g" {} \;
else
  # Linux
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from "\([^"]*\)\.tsx\?"/from "\1"/g' {} \;
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/from '\([^']*\)\.tsx\?'/from '\1'/g" {} \;
fi

echo "   ✅ Import uzantıları kaldırıldı"
echo ""

# ═══════════════════════════════════════════════════════════════════
# 2. App.tsx DÜZELTMELERİ
# ═══════════════════════════════════════════════════════════════════

echo "🔨 App.tsx dosyasını düzeltiyorum..."

if [ -f "src/App.tsx" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # User.name → User.fullName
    sed -i '' 's/user\.name/user.fullName/g' src/App.tsx
    sed -i '' 's/currentUser\.name/currentUser.fullName/g' src/App.tsx
    
    # role === "admin" → role === Role.ADMIN
    sed -i '' 's/role === "admin"/role === Role.ADMIN/g' src/App.tsx
    sed -i '' 's/role === "ADMIN"/role === Role.ADMIN/g' src/App.tsx
    
    # AuditLog.timestamp → AuditLog.time
    sed -i '' 's/timestamp:/time:/g' src/App.tsx
  else
    # Linux
    sed -i 's/user\.name/user.fullName/g' src/App.tsx
    sed -i 's/currentUser\.name/currentUser.fullName/g' src/App.tsx
    sed -i 's/role === "admin"/role === Role.ADMIN/g' src/App.tsx
    sed -i 's/role === "ADMIN"/role === Role.ADMIN/g' src/App.tsx
    sed -i 's/timestamp:/time:/g' src/App.tsx
  fi
  echo "   ✅ App.tsx düzeltildi"
else
  echo "   ⚠️  App.tsx bulunamadı"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# 3. DUPLICATE ID ASSIGNMENTS DÜZELTMELERİ
# ═══════════════════════════════════════════════════════════════════

echo "🔧 Duplicate id hatalarını düzeltiyorum..."

# KullancPage.tsx
if [ -f "src/components/KullancPage.tsx" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/{ id: newId, \.\.\.formData, id: Date\.now() }/{ id: newId, ...formData }/g' src/components/KullancPage.tsx
  else
    sed -i 's/{ id: newId, \.\.\.formData, id: Date\.now() }/{ id: newId, ...formData }/g' src/components/KullancPage.tsx
  fi
  echo "   ✅ KullancPage.tsx düzeltildi"
fi

# LokasyonPage.tsx
if [ -f "src/components/LokasyonPage.tsx" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/{ id: newId, \.\.\.formData, id: Date\.now() }/{ id: newId, ...formData }/g' src/components/LokasyonPage.tsx
  else
    sed -i 's/{ id: newId, \.\.\.formData, id: Date\.now() }/{ id: newId, ...formData }/g' src/components/LokasyonPage.tsx
  fi
  echo "   ✅ LokasyonPage.tsx düzeltildi"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# 4. types/index.ts KONTROL
# ═══════════════════════════════════════════════════════════════════

echo "📋 types/index.ts kontrol ediliyor..."

if [ -f "src/types/index.ts" ]; then
  # AuditLog interface'inde time var mı kontrol et
  if grep -q "time: string" src/types/index.ts; then
    echo "   ✅ AuditLog.time tanımlı"
  else
    echo "   ⚠️  AuditLog.time eksik - manuel kontrol gerekli"
  fi
  
  # User interface'inde fullName var mı kontrol et
  if grep -q "fullName: string" src/types/index.ts; then
    echo "   ✅ User.fullName tanımlı"
  else
    echo "   ⚠️  User.fullName eksik - manuel kontrol gerekli"
  fi
  
  # Role enum var mı kontrol et
  if grep -q "enum Role" src/types/index.ts; then
    echo "   ✅ Role enum tanımlı"
  else
    echo "   ⚠️  Role enum eksik - manuel kontrol gerekli"
  fi
else
  echo "   ⚠️  types/index.ts bulunamadı"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✨ Düzeltmeler tamamlandı!"
echo ""
echo "📝 Sonraki adımlar:"
echo "   1. git status ile değişiklikleri kontrol et"
echo "   2. git add ."
echo "   3. git commit -m 'fix: Vercel build hatalarını düzelt'"
echo "   4. git push"
echo ""
echo "🚀 Vercel otomatik yeniden deploy edecek!"
echo "═══════════════════════════════════════════════════════════════════"
