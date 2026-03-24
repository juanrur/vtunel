# Vtunel (Calendario Online)
Aplicación de calendario para organizar tus dias con diferentes vistas.

## Demo

[Ver demo](https://poker-seven-umber.vercel.app/)

![](previews/poker-preview.gif)

## Features
- Crear, borrar, actualizar y mostrar tus eventos
- Drag and Drog de los eventos desde el aside al calendario para actualizarlos y desde el calendario mismo
- Inicio de sesión
- Diferentes vistas (Week, Day, Month)
- Gestion de estado con Zustand

## Stack
- Next.js
- Supabase
- TypeScript
- Zustand

## Decisiones Técnicas

Se eligio este stack por la necesidad de reactividad en la aplicación y priorización de una arquitectura simple, reactiva y escalable.

Zustand se encarga de la gestión del estado global de forma ligera, mientras que Supabase permite la persistencia de eventos sin complejidad adicional. TypeScript aporta seguridad y previsibilidad en el desarrollo.

En conjunto, el stack facilita una iteración rápida manteniendo una estructura clara entre lógica, estado y datos, lo que asegura la mantenibilidad del proyecto a largo plazo.



## Aquitectura
![](previews/poker_architecture.webp)

## Instalación

```bash
git clone ...
npm install
npm run dev
```
## Roadmap
Consulta las próximas mejoras aquí:
[Roadmap](TODOS.md)

## Más información

Puedes leer la evolución del proyecto en mi portfolio:
[Artículo completo](https://juanruiz.dev/blog/poker/)

