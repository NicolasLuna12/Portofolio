# 🔒 Seguridad de las Credenciales EmailJS

## ✅ Configuración Actual

Tu portafolio ahora usa un archivo de configuración separado para las credenciales de EmailJS:

- ✅ `config.js` - Contiene tus credenciales reales (NO se sube a Git)
- ✅ `config.example.js` - Plantilla de ejemplo (SÍ se sube a Git)
- ✅ `.gitignore` - Evita que config.js se suba accidentalmente

## 📝 Archivos Importantes

### `config.js` (NO subir a Git)
```javascript
const EMAIL_CONFIG = {
    publicKey: 'YZ28oGTfXzYe8Ylh7',
    serviceId: 'service_x9711zd',
    templateId: 'template_x5j3cnj'
};
```

### `config.example.js` (Sí subir a Git)
```javascript
const EMAIL_CONFIG = {
    publicKey: 'TU_PUBLIC_KEY_AQUI',
    serviceId: 'TU_SERVICE_ID_AQUI',
    templateId: 'TU_TEMPLATE_ID_AQUI'
};
```

## 🚀 Para Deploys (Netlify, Vercel, GitHub Pages)

Cuando subas tu portafolio a producción, tienes 2 opciones:

### Opción 1: Variables de Entorno (Recomendado para Netlify/Vercel)

1. En tu plataforma de hosting, ve a Settings → Environment Variables
2. Agrega estas variables:
   ```
   EMAIL_PUBLIC_KEY = YZ28oGTfXzYe8Ylh7
   EMAIL_SERVICE_ID = service_x9711zd
   EMAIL_TEMPLATE_ID = template_x5j3cnj
   ```

3. Modifica `config.js` para usar variables de entorno en producción

### Opción 2: Subir config.js manualmente (GitHub Pages)

Para GitHub Pages u hostings que no soportan variables de entorno:

1. Sube tu código SIN `config.js`
2. En el servidor, crea `config.js` manualmente con tus credenciales
3. O usa un deploy script que inyecte las credenciales

## ⚠️ IMPORTANTE

- **NUNCA** hagas `git add config.js`
- **NUNCA** subas tus credenciales a GitHub público
- Si accidentalmente subes `config.js`, regenera tus credenciales en EmailJS

## 🔍 Verificar antes de hacer commit

Antes de hacer push, verifica:

```bash
git status
```

Si ves `config.js` en la lista, NO hagas commit. Verifica que `.gitignore` esté configurado correctamente.

## 📧 Regenerar Credenciales

Si accidentalmente expusiste tus credenciales:

1. Ve a EmailJS Dashboard
2. Servicios → Edita tu servicio → Regenera las credenciales
3. Templates → Regenera el Template ID si es necesario
4. Account → General → Regenera tu Public Key
5. Actualiza `config.js` con las nuevas credenciales

---

**Nota:** Las credenciales de EmailJS no son tan sensibles como credenciales de bases de datos, pero es buena práctica mantenerlas privadas para evitar spam o uso no autorizado de tu cuenta.
