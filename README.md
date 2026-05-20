# DayCard — PWA

Tu tarjeta del día. Clima, noticias, tipo de cambio y más — en una sola pantalla.

## Archivos

```
daycard/
├── index.html        → App principal
├── subscribe.html    → Página de pago Pro
├── sw.js             → Service Worker (offline + cache)
├── manifest.json     → Convierte en PWA instalable
├── icons/            → Crea iconos de 192x192 y 512x512 px
│   ├── icon-192.png
│   └── icon-512.png
└── api/
    └── stripe/
        ├── checkout.js   → (del backend ValorFiscal, reutilizar)
        └── webhook.js
```

## Setup en 10 minutos

### 1. API Keys gratuitas

**OpenWeatherMap** (clima):
1. Regístrate en https://openweathermap.org/api
2. Ve a API Keys → copia tu key
3. Pégala en index.html donde dice `YOUR_OPENWEATHERMAP_KEY`

**ExchangeRate-API** (tipo de cambio):
1. Regístrate en https://exchangerate-api.com
2. Copia tu key gratuita
3. Pégala en index.html donde dice `YOUR_EXCHANGERATE_KEY`

### 2. Iconos

Crea una carpeta `icons/` y agrega:
- `icon-192.png` → 192×192 px con el logo de DayCard
- `icon-512.png` → 512×512 px con el logo de DayCard

Puedes generarlos gratis en https://favicon.io

### 3. Deploy en Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Listo. Vercel te da una URL tipo `daycard.vercel.app`.

### 4. Dominio personalizado (opcional)

En Vercel Dashboard → Settings → Domains → agrega `getdaycard.com` o el que elijas.

## Stripe (pagos Pro)

Reutiliza los archivos `api/stripe/` del proyecto ValorFiscal.
Solo cambia los PRICE IDs en .env:

```
STRIPE_PRICE_ID_MONTHLY=price_xxx   → $0.99/mes
STRIPE_PRICE_ID_YEARLY=price_xxx    → $9.99/año
```

## Costo total de operación

| Servicio | Límite gratis | Costo al crecer |
|---|---|---|
| Vercel | 100GB bandwidth/mes | Gratis para este volumen |
| OpenWeatherMap | 1,000 calls/día | $40/mes con 100k usuarios |
| ExchangeRate-API | 1,500 calls/mes | $10/mes ilimitado |
| RSS BBC/Infobae | Sin límite | $0 siempre |
| ipapi.co | 1,000 calls/día | $15/mes ilimitado |
| Stripe | — | 2.9% + $0.30 por tx |

**Costo hasta ~1,000 usuarios activos: $0/mes**
