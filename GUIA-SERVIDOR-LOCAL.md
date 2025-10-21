# 🚀 Guía para Iniciar Servidor Local con ngrok

## 📋 Requisitos previos
- Python instalado (ya lo tienes ✅)
- ngrok descargado en `C:\ngrok` (ya lo tienes ✅)
- Token de ngrok configurado (ya está configurado ✅)

---

## 🎯 Opción 1: Hacerlo manualmente (Paso a Paso)

### **Paso 1: Abrir Git Bash**
- Abre la terminal Git Bash
- Navega a la carpeta del proyecto:
```bash
cd /c/ia/telovendoriohacha/telovendo-nuevo
```

### **Paso 2: Iniciar el servidor Python**
Ejecuta este comando:
```bash
python -m http.server 8000
```

✅ **Resultado**: Tu sitio estará disponible en `http://localhost:8000`

⚠️ **IMPORTANTE**: Deja esta terminal abierta y corriendo

### **Paso 3: Abrir una SEGUNDA terminal Git Bash**
- Abre otra ventana de Git Bash (no cierres la anterior)

### **Paso 4: Iniciar ngrok**
En la segunda terminal, ejecuta:
```bash
/c/ngrok http 8000
```

✅ **Resultado**: ngrok te mostrará una URL pública como:
```
Forwarding    https://algo-random.ngrok-free.dev -> http://localhost:8000
```

### **Paso 5: Compartir la URL**
- Copia la URL que aparece en "Forwarding" (la que empieza con `https://`)
- Compártela con quien quieras
- Esa persona podrá ver tu sitio desde cualquier lugar

### **Paso 6: Detener los servidores (cuando termines)**

**Para detener ngrok** (en la segunda terminal):
- Presiona `Ctrl + C`

**Para detener Python** (en la primera terminal):
- Presiona `Ctrl + C`

---

## 🤖 Opción 2: Pedirle a Claude que lo haga

Si no quieres ejecutar los comandos manualmente, copia y pega este prompt:

```
Inicia el servidor local para mi proyecto:

1. Inicia el servidor Python en el puerto 8000 desde la carpeta /c/ia/telovendoriohacha/telovendo-nuevo
2. Inicia ngrok apuntando al puerto 8000 (la ruta de ngrok es /c/ngrok)
3. Dame la URL pública para compartir

Ejecuta ambos comandos en segundo plano y dame la URL final.
```

---

## 📝 Comandos de referencia rápida

### Iniciar servidor Python:
```bash
cd /c/ia/telovendoriohacha/telovendo-nuevo
python -m http.server 8000
```

### Iniciar ngrok (en otra terminal):
```bash
/c/ngrok http 8000
```

### Ver panel de control de ngrok:
```
http://localhost:4040
```

### Verificar que el servidor funciona localmente:
```
http://localhost:8000
```

---

## ❓ Solución de problemas

### Problema: "Port already in use" (Puerto ya en uso)
**Solución**: Otro proceso está usando el puerto 8000. Cambia el puerto:
```bash
python -m http.server 8001
/c/ngrok http 8001
```

### Problema: ngrok dice "authentication failed"
**Solución**: Configura de nuevo tu token:
```bash
/c/ngrok config add-authtoken TU_TOKEN_AQUI
```

### Problema: No puedo detener el servidor
**Solución**: Presiona `Ctrl + C` en la terminal donde está corriendo

### Problema: La URL de ngrok no funciona
**Solución**:
1. Verifica que el servidor Python esté corriendo
2. Verifica que ngrok esté corriendo
3. Asegúrate de copiar la URL completa con `https://`

---

## 💡 Consejos útiles

1. **URL cambia cada vez**: Cada vez que inicies ngrok, te dará una URL diferente (con cuenta gratuita)

2. **Mantén las terminales abiertas**: Mientras quieras que el sitio esté disponible, deja ambas terminales abiertas

3. **Panel de inspección**: Abre `http://localhost:4040` para ver todas las peticiones que llegan a tu sitio

4. **Primer acceso**: Los visitantes verán un aviso de ngrok, solo deben dar clic en "Visit Site"

5. **Cambios en tiempo real**: Si editas los archivos HTML/CSS/JS, los visitantes verán los cambios al recargar la página

---

## 🎓 Resumen visual

```
┌─────────────────────────────────────────────────┐
│  TU COMPUTADORA                                 │
│                                                 │
│  ┌──────────────────────┐                      │
│  │  Servidor Python     │                      │
│  │  localhost:8000      │                      │
│  └──────────┬───────────┘                      │
│             │                                   │
│  ┌──────────▼───────────┐                      │
│  │  ngrok               │                      │
│  │  Túnel público       │                      │
│  └──────────┬───────────┘                      │
└─────────────┼───────────────────────────────────┘
              │
              │ Internet
              │
     ┌────────▼─────────┐
     │  https://xxx.    │
     │  ngrok-free.dev  │
     └──────────────────┘
              │
    ┌─────────▼──────────┐
    │  Visitantes        │
    │  desde cualquier   │
    │  lugar del mundo   │
    └────────────────────┘
```

---

**Última actualización**: 2025-10-19
**Proyecto**: TE LO VENDO RIOHACHA - Catálogo Digital
