# 📊 Sistema de Visualización de Gráficos

## Funcionalidad Implementada

Tras ejecutar una consulta SQL con resultados, aparece un botón **"📊 Ver Gráficos"** que genera automáticamente visualizaciones inteligentes de los datos.

---

## 🎯 Características

### 1. **Generación Automática con IA**
- Google Gemini analiza los datos y sugiere los mejores gráficos
- Detecta tipos de datos (numéricos, categóricos, fechas)
- Selecciona automáticamente el tipo de gráfico más apropiado

### 2. **Tipos de Gráficos Soportados**
- **Barras (Bar)**: Comparaciones entre categorías
- **Circular (Pie/Doughnut)**: Proporciones y distribuciones
- **Líneas (Line)**: Tendencias temporales
- **Automático**: Si la IA falla, se generan gráficos basados en reglas

### 3. **Información Contextual**
Cada gráfico incluye:
- ✅ Título descriptivo
- ✅ Descripción breve
- ✅ Razón de por qué es útil
- ✅ Recomendaciones de análisis adicionales

---

## 🚀 Flujo de Uso

```
1. Usuario ejecuta consulta SQL
         ↓
2. Se muestran resultados en tabla
         ↓
3. Aparece botón "Ver Gráficos"
         ↓
4. Usuario hace clic
         ↓
5. IA analiza datos y genera configuraciones
         ↓
6. Se muestran hasta 3 gráficos relevantes
         ↓
7. Usuario puede cerrar panel y volver a tabla
```

---

## 📡 API Endpoint

### `POST /api/generateCharts`

**Request:**
```json
{
  "sql": "SELECT * FROM pacientes WHERE comunidad_autonoma = 'Andalucía'",
  "rows": [
    { "nombre": "Juan", "edad": 45, "comunidad_autonoma": "Andalucía" },
    ...
  ]
}
```

**Response:**
```json
{
  "charts": [
    {
      "type": "bar",
      "title": "Distribución por edad",
      "description": "Cantidad de pacientes por rango de edad",
      "dataColumn": "count",
      "labelColumn": "edad",
      "reason": "Muestra la distribución etaria de los pacientes",
      "chartData": {
        "labels": ["20-30", "31-40", "41-50", ...],
        "datasets": [...]
      }
    }
  ],
  "recommendations": [
    "Considera analizar la distribución por género",
    "Revisa las tendencias temporales de ingresos"
  ],
  "totalRows": 150,
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

---

## 🎨 Componente: ChartsPanel.astro

### Eventos Escuchados

- **`sql-result`**: Cuando se obtienen resultados de una consulta
  - Muestra el botón "Ver Gráficos"
  - Guarda los datos para procesamiento

- **`sql-run`**: Cuando se ejecuta una nueva consulta
  - Oculta el panel de gráficos anterior
  - Resetea el estado

### Elementos UI

```html
<!-- Botón activador -->
<button id="viewChartsBtn">📊 Ver Gráficos</button>

<!-- Panel de gráficos -->
<div id="chartsPanel">
  <!-- Grid de gráficos (hasta 3) -->
  <div class="charts-grid">
    <div class="chart-card">
      <canvas id="chart-0"></canvas>
    </div>
  </div>
  
  <!-- Recomendaciones -->
  <div class="recommendations">
    <ul>
      <li>💡 Recomendación 1</li>
    </ul>
  </div>
</div>
```

---

## 🧠 Lógica de Generación Automática

### Sin IA (Fallback)

Cuando la IA no está disponible o falla, se aplican estas reglas:

1. **Detectar columnas categóricas** (< 20 valores únicos)
2. **Detectar columnas numéricas**
3. **Generar gráficos según combinaciones:**
   - Categórica → Gráfico de barras (conteo)
   - 2 Categóricas → Barras + Doughnut
   - Categórica + Numérica → Barras comparativas

### Con IA

Gemini analiza:
- Naturaleza de los datos (médicos, geográficos, temporales)
- Relaciones entre columnas
- Valores atípicos
- Distribuciones estadísticas

Y sugiere visualizaciones específicas con justificación.

---

## 🎨 Colores Automáticos

Se generan paletas de colores automáticamente:
- 7 colores base con transparencia
- Rotación automática si hay más categorías
- Bordes con opacidad 1.0 para mejor definición

```javascript
const colors = [
  'rgba(54, 162, 235, 0.6)',   // Azul
  'rgba(255, 99, 132, 0.6)',   // Rojo
  'rgba(75, 192, 192, 0.6)',   // Verde agua
  'rgba(255, 206, 86, 0.6)',   // Amarillo
  'rgba(153, 102, 255, 0.6)',  // Púrpura
  'rgba(255, 159, 64, 0.6)',   // Naranja
  'rgba(201, 203, 207, 0.6)',  // Gris
];
```

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Pacientes por Comunidad Autónoma

**SQL:**
```sql
SELECT comunidad_autonoma, COUNT(*) as total 
FROM pacientes 
GROUP BY comunidad_autonoma
```

**Gráfico generado:**
- **Tipo**: Barras
- **Título**: "Distribución de Pacientes por Comunidad Autónoma"
- **Eje X**: Comunidades
- **Eje Y**: Número de pacientes

### Ejemplo 2: Distribución por Género

**SQL:**
```sql
SELECT genero, COUNT(*) as total 
FROM pacientes 
GROUP BY genero
```

**Gráfico generado:**
- **Tipo**: Doughnut (circular)
- **Título**: "Proporción por Género"
- **Muestra**: Porcentajes visuales

### Ejemplo 3: Edad Promedio por Región

**SQL:**
```sql
SELECT region, AVG(edad) as edad_promedio 
FROM pacientes 
GROUP BY region
```

**Gráfico generado:**
- **Tipo**: Barras
- **Título**: "Edad Promedio por Región"
- **Comparación**: Visual entre regiones

---

## 🔧 Tecnologías Utilizadas

- **Chart.js 4.x**: Librería de gráficos interactivos
- **Google Gemini 2.0**: IA para análisis y sugerencias
- **Astro Components**: Arquitectura modular
- **TypeScript**: Tipado estático

---

## 📱 Responsive Design

- **Desktop**: Grid de 2-3 columnas
- **Tablet**: Grid de 2 columnas  
- **Mobile**: Grid de 1 columna (stack vertical)
- **Altura de canvas**: Adaptativa (300px desktop, 250px mobile)

---

## 🎯 Mejoras Futuras

- [ ] Exportar gráficos como imágenes (PNG/SVG)
- [ ] Gráficos interactivos con drill-down
- [ ] Animaciones de entrada
- [ ] Comparación lado a lado
- [ ] Gráficos de dispersión (scatter)
- [ ] Mapas de calor (heatmaps)
- [ ] Gráficos 3D para datos complejos

---

## 🐛 Troubleshooting

### El botón no aparece
- Verifica que la consulta devuelva resultados (rows.length > 0)
- Revisa la consola del navegador por errores

### Los gráficos no se muestran
- Asegúrate de que Chart.js está instalado: `npm install chart.js`
- Verifica que `/api/generateCharts` responde correctamente

### Error en generación de gráficos
- El sistema tiene fallback automático sin IA
- Revisa que las columnas existan en los datos
- Verifica que `GEMINI_API_KEY` esté configurada

---

**Creado**: 16 de octubre de 2025  
**Equipo**: Linuxeros - Malackaton 2025
