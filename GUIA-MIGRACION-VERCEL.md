# 🚀 Guía de Migración de Netlify a Vercel

## 📋 Información del Proyecto

- **Sitio actual:** https://telovendoriohacha.com (PAUSADO en Netlify)
- **Repositorio:** https://github.com/Terminator123123/telovendoriohacha
- **Motivo de migración:** Límites del plan gratuito de Netlify alcanzados
- **Fecha:** 21 de Octubre 2025

---

## ⚠️ Problema Actual

Netlify pausó el sitio con el siguiente mensaje:

```
Site not available
This site was paused as it reached its usage limits.
```

**Límites alcanzados:**
- Ancho de banda: 100 GB/mes (plan gratuito)
- Build minutes: 300 minutos/mes (plan gratuito)

---

## ✅ Solución: Migrar a Vercel (GRATIS)

### **¿Por qué Vercel?**

| Característica | Netlify (Gratis) | Vercel (Gratis) |
|----------------|------------------|-----------------|
| Ancho de banda | 100 GB/mes | 100 GB/mes |
| Build minutes | 300 min/mes | **6000 min/mes** ⭐ |
| Despliegues | Limitado | Ilimitados ⭐ |
| SSL automático | ✅ | ✅ |
| Dominio personalizado | ✅ | ✅ |
| Costo | $0 | $0 |

**Ventaja:** Vercel tiene **20 veces más build minutes** que Netlify en el plan gratuito.

---

## 📖 Pasos de Migración

### **PASO 1: Crear Cuenta en Vercel** (3 minutos)

1. **Abre tu navegador** y ve a: **https://vercel.com**

2. **Haz click en "Sign Up"** (Registrarse)

3. **Selecciona "Continue with GitHub"**
   - Esto conectará tu cuenta de GitHub automáticamente
   - Es el método más fácil y recomendado

4. **Autoriza a Vercel**
   - GitHub te pedirá permiso para que Vercel acceda a tus repositorios
   - Click en **"Authorize Vercel"**

5. **Completa el perfil** (opcional)
   - Nombre: TE LO VENDO RIOHACHA
   - Uso: Personal o Business

6. **¡Listo!** Ya tienes cuenta en Vercel

---

### **PASO 2: Importar tu Repositorio de GitHub** (2 minutos)

1. **En el dashboard de Vercel**, click en **"Add New..."** (botón arriba a la derecha)

2. Selecciona **"Project"**

3. **Busca tu repositorio:**
   - En el buscador escribe: **"telovendoriohacha"**
   - Aparecerá: **Terminator123123/telovendoriohacha**

4. **Click en "Import"** (Importar)

---

### **PASO 3: Configurar el Proyecto** (1 minuto)

Vercel te mostrará una pantalla de configuración:

#### **Framework Preset:**
```
Other
```
(O déjalo en "Other" si detectó automáticamente HTML estático)

#### **Root Directory:**
```
./
```
(Dejar por defecto)

#### **Build and Output Settings:**

- **Build Command:** (Dejar vacío)
  ```
  (vacío)
  ```

- **Output Directory:** (Dejar por defecto)
  ```
  .
  ```

- **Install Command:** (Dejar vacío)
  ```
  (vacío)
  ```

**IMPORTANTE:** No cambies nada más. Vercel detectará automáticamente que es un sitio estático HTML.

#### **Environment Variables:**

No necesitas agregar ninguna variable de entorno. Todo está configurado en los archivos JavaScript.

**Click en "Deploy"** (Desplegar)

---

### **PASO 4: Esperar el Despliegue** (30 segundos)

Vercel comenzará a desplegar tu sitio:

```
Building...
████████████████████████ 100%
Deployment completed successfully ✓
```

Verás:
- ✅ **URL temporal de Vercel:** `https://telovendoriohacha-xxxx.vercel.app`
- ✅ Tu sitio ya está funcionando en esa URL

**Prueba la URL temporal** para confirmar que todo funciona.

---

### **PASO 5: Agregar tu Dominio Personalizado** (2 minutos)

1. **En el dashboard del proyecto**, ve a **"Settings"** (Configuración)

2. Click en **"Domains"** en el menú lateral

3. **Agregar dominio:**
   - Escribe: **telovendoriohacha.com**
   - Click en **"Add"**

4. **Agregar www también** (opcional pero recomendado):
   - Escribe: **www.telovendoriohacha.com**
   - Click en **"Add"**

5. Vercel te mostrará **instrucciones DNS**

---

### **PASO 6: Configurar DNS en Hostinger** (5 minutos)

Tienes **2 opciones** para configurar DNS:

---

#### **OPCIÓN A: Usar Nameservers de Vercel** ⭐ (MÁS FÁCIL)

**Ventajas:**
- ✅ Configuración más simple
- ✅ Vercel gestiona todo automáticamente
- ✅ SSL se activa automáticamente

**Pasos:**

1. **En Vercel**, ve a **Domains** y verás algo como:

   ```
   Use Vercel DNS for telovendoriohacha.com

   Update your domain's nameservers to:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. **Copia los nameservers** de Vercel

3. **Ve a Hostinger:**
   - Abre: **https://hpanel.hostinger.com**
   - Inicia sesión
   - Ve a **"Dominios"**
   - Click en **"telovendoriohacha.com"**

4. **Busca "Nameservers"** o **"Servidores de nombres"**

5. **Click en "Cambiar nameservers"**

6. **Selecciona "Usar nameservers personalizados"**

7. **Ingresa los nameservers de Vercel:**
   ```
   Nameserver 1: ns1.vercel-dns.com
   Nameserver 2: ns2.vercel-dns.com
   ```

8. **Guarda los cambios**

9. **Espera 5-30 minutos** para que los DNS se propaguen

---

#### **OPCIÓN B: Usar DNS de Hostinger** (MÁS CONTROL)

**Ventajas:**
- ✅ Mantienes control del DNS en Hostinger
- ✅ Puedes agregar otros registros (email, etc.)

**Pasos:**

1. **En Vercel**, te mostrará registros DNS como:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. **Ve a Hostinger:**
   - **hpanel.hostinger.com** → **Dominios** → **telovendoriohacha.com**
   - Ve a **"DNS / Zona DNS"**

3. **Elimina los registros antiguos de Netlify:**
   - Busca registros A que apunten a Netlify
   - Elimínalos

4. **Agrega los registros de Vercel:**

   **Registro A:**
   ```
   Tipo: A
   Nombre: @
   Apunta a: 76.76.21.21 (copiar de Vercel)
   TTL: 3600
   ```

   **Registro CNAME:**
   ```
   Tipo: CNAME
   Nombre: www
   Apunta a: cname.vercel-dns.com (copiar de Vercel)
   TTL: 3600
   ```

5. **Guarda los cambios**

6. **Espera 5-30 minutos**

---

### **PASO 7: Actualizar Google Search Console** (2 minutos)

1. **Ve a:** https://search.google.com/search-console

2. **Selecciona tu propiedad:** telovendoriohacha.com

3. **Ve a "Configuración"** → **"Verificación"**

4. **Verifica que el registro TXT de Google sigue activo:**
   - Si usaste nameservers de Vercel, necesitarás **agregar el registro TXT en Vercel**
   - Ve a Vercel → Domains → DNS Records
   - Agrega el registro TXT de Google que tenías antes

5. **Re-verificar si es necesario**

---

### **PASO 8: Verificar SSL/HTTPS** (Automático)

**Vercel activa SSL automáticamente:**

1. Espera 5-10 minutos después de configurar DNS

2. Vercel generará certificado SSL gratuito de Let's Encrypt

3. En **Vercel → Domains** verás:
   ```
   ✓ SSL Certificate
   Valid until: [fecha]
   ```

4. **Verifica tu sitio:**
   - Abre: https://telovendoriohacha.com
   - Verás el **candado verde** 🔒
   - El sitio debe cargar correctamente

---

## ✅ Verificación Final

### **Checklist de Verificación:**

- [ ] Sitio carga en: https://telovendoriohacha.com
- [ ] SSL activo (candado verde 🔒)
- [ ] Productos se cargan desde Google Sheets
- [ ] Carrito funciona correctamente
- [ ] Botón WhatsApp funciona (+57 300 7148250)
- [ ] Modal de productos abre correctamente
- [ ] Checkout funciona
- [ ] Redirección www → sin www funciona
- [ ] Sitio responsive en móvil

### **Pruebas Recomendadas:**

1. **Navegar el catálogo** → Verificar imágenes y precios
2. **Agregar producto al carrito** → Confirmar persistencia
3. **Hacer un pedido de prueba** → Verificar mensaje WhatsApp
4. **Probar en móvil** → Confirmar diseño responsive
5. **Verificar velocidad** → Debe cargar rápido

---

## 🔄 Configurar Despliegue Automático

**¡Buenas noticias!** Vercel ya configuró despliegue automático cuando importaste desde GitHub.

### **Cómo Funciona:**

1. **Haces cambios** en archivos locales
2. **Subes a GitHub:**
   ```bash
   git add .
   git commit -m "Descripción"
   git push origin main
   ```
3. **Vercel detecta el push automáticamente**
4. **Despliega en 30-60 segundos**
5. **Sitio actualizado** en https://telovendoriohacha.com

### **Ver Estado de Despliegues:**

- Ve a **Vercel Dashboard** → Tu proyecto
- Click en **"Deployments"**
- Verás historial completo de despliegues

---

## 📊 Monitoreo y Analytics

### **Dashboard de Vercel:**

1. **Ve a tu proyecto en Vercel**
2. Verás métricas automáticas:
   - 📊 Visitantes
   - ⚡ Velocidad de carga
   - 🌍 Distribución geográfica
   - 📈 Uso de ancho de banda

### **Límites del Plan Gratuito:**

| Recurso | Límite Mensual |
|---------|----------------|
| Ancho de banda | 100 GB |
| Build executions | 6000 minutos |
| Despliegues | Ilimitados |
| Serverless Function Executions | 100 GB-Hrs |

**No te preocupes:** Con un sitio estático como el tuyo, es **muy difícil** alcanzar estos límites.

---

## 🆘 Solución de Problemas

### **Problema 1: "Domain not found" o "DNS error"**

**Causa:** DNS no ha propagado todavía

**Solución:**
1. Espera 30-60 minutos más
2. Verifica nameservers en Hostinger
3. Usa https://dnschecker.org para verificar propagación

---

### **Problema 2: "Certificate error" o "Not secure"**

**Causa:** SSL no se ha generado aún

**Solución:**
1. Espera 10-15 minutos
2. Ve a Vercel → Domains → "Renew Certificate"
3. Si persiste, contacta soporte de Vercel

---

### **Problema 3: Productos no cargan**

**Causa:** Google Sheets no es accesible o URL incorrecta

**Solución:**
1. Verifica URL en `script.js` línea 4
2. Confirma que Google Sheets es público
3. Abre consola del navegador (F12) para ver errores

---

### **Problema 4: Cambios no se reflejan**

**Causa:** Caché del navegador o despliegue pendiente

**Solución:**
1. Limpia caché: Ctrl + Shift + R
2. Verifica en Vercel → Deployments que el último despliegue fue exitoso
3. Espera 1-2 minutos

---

## 📞 Soporte

### **Vercel:**
- **Documentación:** https://vercel.com/docs
- **Comunidad:** https://github.com/vercel/vercel/discussions
- **Email:** support@vercel.com

### **Proyecto:**
- **Repositorio GitHub:** https://github.com/Terminator123123/telovendoriohacha
- **Issues:** https://github.com/Terminator123123/telovendoriohacha/issues

---

## ✨ Ventajas Post-Migración

Después de migrar a Vercel, disfrutarás de:

✅ **Sitio 100% funcional** sin pausas por límites
✅ **6000 build minutes/mes** (vs 300 en Netlify)
✅ **Despliegues más rápidos** (30-60 segundos)
✅ **Analytics integrados** gratis
✅ **Edge Network global** para velocidad
✅ **Costo:** $0 USD para siempre

---

## 🎯 Próximos Pasos Post-Migración

Una vez completada la migración:

1. **Actualizar README.md** con nueva información de Vercel
2. **Notificar a Google Search Console** (si cambiaste nameservers)
3. **Verificar analytics** en Google Search Console
4. **Probar todas las funcionalidades**
5. **Hacer backup** del repositorio

---

## 📝 Notas Importantes

- ✅ **No perderás datos:** Todo está en GitHub
- ✅ **Mismo dominio:** telovendoriohacha.com seguirá igual
- ✅ **Mismo repositorio:** No necesitas mover nada de GitHub
- ✅ **Reversible:** Puedes volver a Netlify si quieres
- ✅ **Sin downtime:** Configura todo antes de cambiar DNS

---

## 🕐 Tiempo Total Estimado

| Paso | Tiempo |
|------|--------|
| Crear cuenta Vercel | 3 minutos |
| Importar proyecto | 2 minutos |
| Configurar deployment | 1 minuto |
| Despliegue inicial | 1 minuto |
| Configurar dominio | 2 minutos |
| Actualizar DNS | 5 minutos |
| Propagación DNS | 5-30 minutos |
| **TOTAL** | **15-45 minutos** |

---

## ✅ Checklist Final de Migración

Usa este checklist para asegurarte de completar todo:

### **Antes de Migrar:**
- [ ] Tengo acceso a mi cuenta de GitHub
- [ ] Tengo acceso a Hostinger (hpanel)
- [ ] Tengo acceso a Google Search Console
- [ ] Hice backup del sitio actual

### **Durante la Migración:**
- [ ] Creé cuenta en Vercel
- [ ] Importé repositorio de GitHub
- [ ] Configuré proyecto correctamente
- [ ] Despliegue inicial exitoso
- [ ] Agregué dominio personalizado
- [ ] Actualicé nameservers en Hostinger

### **Después de la Migración:**
- [ ] Sitio carga en https://telovendoriohacha.com
- [ ] SSL activo (candado verde)
- [ ] Todas las funcionalidades funcionan
- [ ] Google Search Console actualizado
- [ ] Analytics funcionando
- [ ] README.md actualizado

---

**🎉 ¡Éxito! Tu sitio ahora está en Vercel con límites más generosos y sin costo.**

---

**Fecha de creación:** 21 de Octubre 2025
**Última actualización:** 21 de Octubre 2025
**Versión:** 1.0
