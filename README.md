# Digital Atelier Solutions (Web Pública)

Este repositorio contiene **exclusivamente** la web pública y las landing pages de Digital Atelier Solutions. Se ha separado del monorepo original para garantizar ligereza, velocidad y cero errores de build en Cloudflare Pages.

## Estado
- ✅ Build verificado (Next.js 16 + Tailwind).
- ✅ Dependencias críticas (Dashboard/Admin) eliminadas o simuladas.
- ✅ Listo para producción.

## Cómo desplegar (Para Víctor)

Como este es un repositorio nuevo en local, necesitas conectarlo a GitHub:

1.  **Crea un nuevo repositorio** en GitHub llamado `digital-atelier-web` (vacío).
2.  **Conéctalo y sube los cambios:**
    ```bash
    cd digital_atelier_web
    git remote add origin https://github.com/VRIBES-ETH/digital-atelier-web.git
    git branch -M main
    git push -u origin main
    ```
3.  **Despliega en Cloudflare Pages:**
    - Ve a Cloudflare Dashboard > Pages.
    - Crea proyecto "Connect to Git".
    - Selecciona el repo `digital-atelier-web`.
    - Preset: **Next.js**.
    - Deploy! 🚀

## Estructura
- `/src/app`: Rutas públicas (`/`, `/blockchain`, `/aviso-legal`, etc).
- `/src/components`: Componentes UI necesarios.
- `/public`: Assets estáticos.
