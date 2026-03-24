# Vtunel (Calendario Online)
Aplicación de calendario para organizar tus días con diferentes vistas. Gestión de eventos con una barra lateral para poder visualizarlos todos.

## Demo

[Ver demo](https://vtunel.vercel.app/)

![](https://juanruiz.dev/vtunel-preview.webp)

## Features
- Crear, borrar, actualizar y mostrar tus eventos
- Drag and Drop de los eventos desde el aside al calendario para actualizarlos y desde el calendario mismo
- Inicio de sesión
- Diferentes vistas (Week, Day, Month)
- Gestión de estado con Zustand

## Stack
- Next.js
- Supabase
- TypeScript
- Zustand

## Decisiones Técnicas

Se eligió este stack por la necesidad de reactividad en la aplicación y priorización de una arquitectura simple, reactiva y escalable.

Zustand se encarga de la gestión del estado global de forma ligera, mientras que Supabase permite la persistencia de eventos sin complejidad adicional. TypeScript aporta seguridad y previsibilidad en el desarrollo.

En conjunto, el stack facilita una iteración rápida manteniendo una estructura clara entre lógica, estado y datos, lo que asegura la mantenibilidad del proyecto a largo plazo.



## Arquitectura
Zustand actúa de intermediario entre la base de datos y el frontend, implementando también optimistic UI. Cuando creamos un evento este llama a la función crear de la store de Zustand y 
cambia el estado del cliente y hace el insert a la base de datos, por lo que vemos nuestros cambios reflejados instantáneamente.

## Instalación

```bash
git clone ...
npm install
npm run dev
```
## Roadmap
Consulta las próximas mejoras aquí:
[Roadmap](TODOS.md)

