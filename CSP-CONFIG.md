# Configuración de Content Security Policy para el servidor de producción

## Para Nginx (nginx.conf)
```nginx
# Añadir en el bloque server
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-hashes';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https: wss: ws:;
  manifest-src 'self';
  worker-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

## Para Apache (.htaccess)
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-hashes'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss: ws:; manifest-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
```

## Para Express.js
```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-hashes'"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "https:", "wss:", "ws:"],
    manifestSrc: ["'self'"],
    workerSrc: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}));
```

## Para Docker con Nginx
```dockerfile
# En tu Dockerfile de nginx
COPY nginx.conf /etc/nginx/nginx.conf
```

## Alternativa: Meta tag CSP (menos seguro)
Si no puedes configurar headers del servidor, puedes usar meta tag en index.html:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-hashes'; img-src 'self' data: https:;">
```

## Verificación
Para verificar que funciona correctamente:
1. Abre DevTools
2. Ve a la pestaña Security
3. Verifica que no hay errores de CSP
4. O usa herramientas online como: https://csp-evaluator.withgoogle.com/
