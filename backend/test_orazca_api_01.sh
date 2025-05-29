#!/bin/bash

set -e
API=http://localhost:5000/api

echo "🧪 Iniciando test completo de la API Orazca Spark..."

assert() {
  if [ "$1" != "$2" ]; then
    echo "❌ FALLO: $3 (esperado '$2', obtenido '$1')"
    exit 1
  else
    echo "✅ OK: $3"
  fi
}

# --- 1. Registro ---
echo "🔐 Registrando usuario..."
REGISTER_RESPONSE=$(curl -s -X POST $API/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"test123"}')

REGISTER_MSG=$(echo "$REGISTER_RESPONSE" | jq -r .message)
if [[ "$REGISTER_MSG" == "Usuario creado correctamente" ]]; then
  echo "✅ Registro exitoso: $REGISTER_MSG"
else
  echo "⚠️ Registro puede haber fallado o usuario ya existe: $REGISTER_RESPONSE"
fi

# --- 2. Login ---
echo "🔑 Iniciando sesión..."
LOGIN_RESPONSE=$(curl -s -X POST $API/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"test123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .token)
USERNAME=$(echo "$LOGIN_RESPONSE" | jq -r .username)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "✅ Login exitoso: usuario = $USERNAME"
else
  echo "❌ Error al iniciar sesión: $LOGIN_RESPONSE"
  exit 1
fi

# --- 2.1 Intento de registro duplicado ---
echo "📛 Probando registro duplicado..."
DUPLICATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"test123"}')

assert "$DUPLICATE_RESPONSE" "400" "Rechazo de registro duplicado"

# --- 3. Crear mazo ---
echo "🃏 Creando mazo..."
DECK_ID=$(curl -s -X POST $API/decks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Mazo Test",
    "description":"Test deck",
    "format":"Standard",
    "mainboard":[{"name":"Llanowar Elves","quantity":4}],
    "sideboard":[],
    "maybeboard":[]
  }' | jq -r ._id)
[ -n "$DECK_ID" ] || (echo "❌ No se creó mazo" && exit 1)
echo "🃏 Mazo ID: $DECK_ID"

# --- 4. Crear post ---
echo "✍️ Creando post..."
POST_ID=$(curl -s -X POST $API/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Post Test",
    "slug":"post-test",
    "contentMarkdown":"## Contenido de test",
    "tags":["test"]
  }' | jq -r ._id)
[ -n "$POST_ID" ] || (echo "❌ No se creó post" && exit 1)
echo "📘 Post ID: $POST_ID"

# --- 5. Comentar post ---
echo "💬 Comentando..."
COMMENT_ID=$(curl -s -X POST $API/posts/$POST_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Primer comentario"}' | jq -r '.comments[0]._id')
[ -n "$COMMENT_ID" ] || (echo "❌ No se creó comentario" && exit 1)
echo "💬 Comentario ID: $COMMENT_ID"

# --- 6. Editar comentario ---
echo "✏️ Editando comentario..."
EDIT_COMMENT=$(curl -s -o /dev/null -w "%{http_code}" -X PUT $API/posts/$POST_ID/comments/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Comentario editado"}')
assert "$EDIT_COMMENT" "200" "Edición de comentario"

# --- 7. Like ---
echo "👍 Like..."
LIKE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API/posts/$POST_ID/like \
  -H "Authorization: Bearer $TOKEN")
assert "$LIKE" "200" "Like aplicado"

# --- 8. Cambiar a dislike ---
echo "👎 Cambiando a dislike..."
DISLIKE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API/posts/$POST_ID/dislike \
  -H "Authorization: Bearer $TOKEN")
assert "$DISLIKE" "200" "Dislike aplicado"

# --- 9. Editar post ---
echo "📝 Editando post..."
EDIT_POST=$(curl -s -o /dev/null -w "%{http_code}" -X PUT $API/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Post Actualizado","contentMarkdown":"Nuevo contenido"}')
assert "$EDIT_POST" "200" "Post actualizado"

# --- 10. Editar mazo ---
echo "🔄 Editando mazo..."
EDIT_DECK=$(curl -s -o /dev/null -w "%{http_code}" -X PUT $API/decks/$DECK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mazo Actualizado","description":"Cambiado"}')
assert "$EDIT_DECK" "200" "Mazo actualizado"

# --- 11. Eliminar comentario ---
echo "🗑️ Eliminando comentario..."
DELETE_COMMENT=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API/posts/$POST_ID/comments/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN")
assert "$DELETE_COMMENT" "200" "Comentario eliminado"

# --- 12. Eliminar post ---
echo "🗑️ Eliminando post..."
DELETE_POST=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN")
assert "$DELETE_POST" "200" "Post eliminado"

# --- 13. Eliminar mazo ---
echo "🗑️ Eliminando mazo..."
DELETE_DECK=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API/decks/$DECK_ID \
  -H "Authorization: Bearer $TOKEN")
assert "$DELETE_DECK" "200" "Mazo eliminado"

# --- 14. Eliminar usuario ---
echo "❌ Eliminando usuario..."
DELETE_USER=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API/users/me \
  -H "Authorization: Bearer $TOKEN")
assert "$DELETE_USER" "200" "Usuario eliminado"

# --- 15. Verificar que todo fue borrado ---
echo "�� Verificando post eliminado..."
CHECK_POST=$(curl -s -o /dev/null -w "%{http_code}" $API/posts/$POST_ID)
assert "$CHECK_POST" "404" "Post realmente eliminado"

echo "🔍 Verificando mazo eliminado..."
CHECK_DECK=$(curl -s -o /dev/null -w "%{http_code}" $API/decks/$DECK_ID)
assert "$CHECK_DECK" "404" "Mazo realmente eliminado"

echo "🔍 Verificando comentario eliminado (en cascada al eliminar post)..."
# no test directo porque post no existe => comentarios tampoco

echo "✅ TODAS LAS FUNCIONES DE LA API PASARON LA PRUEBA"
