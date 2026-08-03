# Tienda Shopify Dropshipping — Estructura Inicial

Este repositorio contiene el **tema de Shopify** (Online Store 2.0) que sirve de punto de partida
para una tienda de dropshipping: rápido, editable 100% desde el editor de temas de Shopify (sin
tocar código para cambiar textos, imágenes o colores) y pensado para conversión (confianza,
urgencia, prueba social).

## Estructura de carpetas

```
├── assets/          CSS y JavaScript del tema
├── config/          Ajustes globales del tema (colores, tipografías, layout)
├── layout/          Plantilla base HTML (theme.liquid) y pantalla de contraseña
├── locales/         Traducciones (es por defecto, en como idioma adicional)
├── sections/         Bloques reutilizables y editables (header, footer, hero, FAQ, etc.)
├── snippets/        Fragmentos de código reutilizados por secciones/plantillas
└── templates/       Plantillas JSON que componen cada tipo de página (home, producto, carrito...)
```

### Secciones incluidas

| Sección | Uso |
|---|---|
| `header.liquid` | Menú, buscador, carrito, barra de aviso (envío gratis / urgencia) |
| `footer.liquid` | Enlaces, newsletter, redes sociales, métodos de pago |
| `hero-banner.liquid` | Banner principal de la home con CTA |
| `featured-collection.liquid` | Grid de productos destacados |
| `trust-badges.liquid` | Iconos de confianza (envío, pago seguro, devoluciones) |
| `testimonials.liquid` | Opiniones de clientes (prueba social) |
| `faq.liquid` | Preguntas frecuentes en acordeón |
| `newsletter.liquid` | Captación de email con descuento |
| `rich-text.liquid` | Bloque de texto libre editable |
| `main-product.liquid` | Página de producto: galería, precio, variantes, contador de urgencia, botón añadir al carrito |
| `main-collection-product-grid.liquid` | Listado de una colección con filtros básicos |
| `main-cart.liquid` | Página de carrito |
| `main-page.liquid` | Páginas de texto (políticas legales, sobre nosotros, contacto) |
| `main-search.liquid` / `main-404.liquid` / `main-list-collections.liquid` | Búsqueda, error 404 y listado de colecciones |
| `cart-drawer.liquid` | Carrito lateral (panel deslizante) |

Todas las secciones exponen sus textos e imágenes como **ajustes editables** desde
`Personalizar tema` en el admin de Shopify — no hace falta tocar Liquid para el uso diario.

## Requisitos

- Cuenta de Shopify (prueba gratuita o de pago)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) instalada (`npm install -g @shopify/cli @shopify/theme`)
- Node.js 18+

## Primeros pasos

1. Instala la Shopify CLI y conéctate a tu tienda:
   ```bash
   shopify auth login
   ```
2. Vincula este tema a tu tienda para ver los cambios en vivo mientras editas:
   ```bash
   shopify theme dev --store=tu-tienda.myshopify.com
   ```
3. Cuando estés listo, sube el tema (como borrador, sin publicarlo todavía):
   ```bash
   shopify theme push --unpublished --store=tu-tienda.myshopify.com
   ```
4. Entra en **Tienda online → Temas → Personalizar** para:
   - Cambiar colores, tipografías y logo en `Ajustes del tema`.
   - Editar los textos del banner principal, testimonios, FAQ, etc.
   - Añadir tus productos reales (o conectar una app de proveedores como **DSers**, **Zendrop**
     o **Spocket**) y asignarlos a la colección destacada de la home.
5. Crea las páginas legales (Política de privacidad, Términos, Envíos, Devoluciones) desde
   **Ajustes → Políticas** — Shopify genera el texto base automáticamente — y enlázalas en el
   footer.
6. Configura un dominio, la pasarela de pago (Shopify Payments / PayPal) y los impuestos antes de
   publicar la tienda.

## Notas de dropshipping

- La barra de aviso del header y el contador de la página de producto están pensados para mensajes
  de envío gratis / oferta por tiempo limitado — ajusta el texto y la fecha límite desde el editor.
- `trust-badges` y `testimonials` refuerzan la confianza, algo crítico cuando el cliente no conoce
  la marca todavía.
- Revisa los tiempos de envío reales de tu proveedor y comunícalos con claridad en la página de
  producto y en la política de envíos para reducir devoluciones y contracargos.
