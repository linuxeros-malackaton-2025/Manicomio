# Malackaton 2025 - Explorador de Datos con IA

## 🏆 Proyecto: Plataforma de Análisis de Datos Sanitarios

Interfaz para visualizar, estudiar e interactuar con datos mediante IA y análisis avanzado.

---

## 🎯 Requisitos del Proyecto

### ✅ 1. Expertos en Análisis de Datos e IA
- **IA Generativa**: Integración de Google Gemini 2.0 Flash
- **Conversión NL → SQL**: Consultas en lenguaje natural convertidas automáticamente
- **Análisis Inteligente**: Generación de insights, detección de anomalías y recomendaciones
- **Interpretación de Resultados**: Resúmenes narrativos automáticos

### ✅ 2. Preparación y Validación del Dataset
- **Validación de SQL**: Endpoint `/api/validateSQL` para prevenir consultas peligrosas
- **Detección de SQL Injection**: Patrones sospechosos bloqueados
- **Estadísticas Automáticas**: Conteo de registros, columnas y valores únicos
- **Manejo de NULL**: Visualización correcta de valores nulos

### ✅ 3. Exploración y Análisis Inicial
- **Consultas Interactivas**: Editor SQL editable en tiempo real
- **Visualización Tabular**: Resultados en tabla HTML interactiva
- **Análisis Avanzado**: Panel con insights, anomalías y recomendaciones
- **Estadísticas en Tiempo Real**: Métricas calculadas automáticamente

### ✅ 4. Razonamiento Analítico y Trazabilidad
- **Flujo Documentado**: 
  1. Input usuario → Conversión IA → Validación → Ejecución → Análisis → Presentación
- **Logs de Auditoría**: Registro en consola de todas las operaciones (timestamp, SQL, resultados)
- **Trazabilidad de Consultas**: Cada query registrada con metadatos
- **Historial**: (En desarrollo) Registro persistente de consultas

### ✅ 5. Cumplimiento Normativo y Protección de Datos
- **Variables de Entorno**: Credenciales y API keys protegidas
- **Validación de Comandos**: Prevención de DROP, TRUNCATE, ALTER
- **Logs de Auditoría**: Registro de acceso a datos
- **RGPD Ready**: Estructura preparada para anonimización (pendiente implementar)

### ✅ 6. Buenas Prácticas de Seguridad
- **Prevención SQL Injection**: Validación exhaustiva de patrones
- **Gestión de Conexiones**: Cierre automático con try-finally
- **Endpoints Separados**: `/fetchData` (SELECT) y `/executeSQL` (INSERT/UPDATE)
- **Validación de Inputs**: Content-Type y formato de datos

### ✅ 7. Comunicación Visual y Síntesis de Resultados
- **Tablas Interactivas**: Diseño responsivo con hover y scroll
- **Panel de Análisis**: Insights visuales con iconos y colores
- **Resúmenes Ejecutivos**: IA genera texto comprensible para no técnicos
- **Estadísticas Visuales**: Cards con métricas principales

---

## 🚀 Estructura del Proyecto

```
/
├── src/
│   ├── components/
│   │   ├── QueryInput.astro       # Input de lenguaje natural
│   │   ├── SqlEditor.astro        # Editor SQL editable
│   │   ├── DataTable.astro        # Tabla de resultados
│   │   ├── AnalysisPanel.astro    # Panel de análisis avanzado ⭐ NUEVO
│   │   ├── Header.astro
│   │   ├── ThemeToggle.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── api/
│   │       ├── generateQueryFromNL.ts    # NL → SQL
│   │       ├── interpretResults.ts       # Resumen narrativo
│   │       ├── queryDB.ts                # Consulta Oracle (legacy)
│   │       ├── fetchData.ts              # SELECT queries ⭐ NUEVO
│   │       ├── executeSQL.ts             # INSERT/UPDATE ⭐ NUEVO
│   │       ├── validateSQL.ts            # Validación seguridad ⭐ NUEVO
│   │       └── analyzeData.ts            # Análisis avanzado ⭐ NUEVO
│   └── styles/
│       └── global.css
├── ANALISIS_DATOS.md              # Documentación técnica ⭐ NUEVO
├── README.md
├── package.json
└── astro.config.mjs
```

---

## 📡 API Endpoints

### Conversión y Consultas
- `POST /api/generateQueryFromNL` - Convierte lenguaje natural a SQL
- `POST /api/queryDB` - Ejecuta SQL en Oracle (legacy)
- `POST /api/fetchData` - SELECT optimizado con formato objeto
- `POST /api/executeSQL` - INSERT/UPDATE/DELETE con autoCommit

### Análisis e Interpretación
- `POST /api/interpretResults` - Genera resumen narrativo de resultados
- `POST /api/analyzeData` - Análisis avanzado con insights y anomalías ⭐
- `POST /api/validateSQL` - Valida seguridad de consultas ⭐

---

## 🛠️ Tecnologías

- **Frontend**: Astro 5.14.5
- **Base de Datos**: Oracle Database (oracledb 6.9.0)
- **IA**: Google Gemini 2.0 Flash (@google/genai 1.25.0)
- **Runtime**: Node.js
- **Estilos**: CSS Variables con tema claro/oscuro

---

## 📋 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Oracle Database
ORACLE_USER=tu_usuario
ORACLE_PASSWORD=tu_contraseña
ORACLE_CONNECTION_STRING=tu_connection_string

# Google Gemini API
GEMINI_API_KEY=tu_api_key
```

---

## 📊 Características Principales

### 1. Conversión Natural a SQL
Escribe en lenguaje natural: **"Pacientes de Andalucía"**
→ Se convierte automáticamente: `SELECT * FROM pacientes WHERE comunidad_autonoma = 'Andalucía'`

### 2. Análisis Avanzado con IA
Tras cada consulta, se genera automáticamente:
- 📝 Resumen ejecutivo
- 💡 3-5 insights clave
- ⚠️ Anomalías detectadas
- 📌 Recomendaciones de análisis adicionales
- 📊 Estadísticas (registros, columnas, valores únicos)

### 3. Validación de Seguridad
Bloquea automáticamente:
- Comandos peligrosos (DROP, TRUNCATE, ALTER)
- DELETE/UPDATE sin WHERE
- Patrones de SQL injection
- Sintaxis inválida

### 4. Visualización Profesional
- Tablas interactivas con hover
- Espaciado optimizado entre columnas
- Scroll horizontal para muchos datos
- Contador de registros en tiempo real
- Panel de análisis con iconos y colores

---

## 🎯 Flujo de Trabajo

```
Usuario escribe en lenguaje natural
         ↓
Gemini convierte a SQL
         ↓
Validación de seguridad (opcional)
         ↓
Ejecución en Oracle DB
         ↓
Obtención de resultados
         ↓
Análisis avanzado con IA (paralelo)
         ↓
Presentación: Tabla + Panel de Insights
```

---

## 📈 Cumplimiento de Requisitos

| Requisito | Estado | Completado |
|-----------|--------|------------|
| Análisis de datos con IA | ✅ | 90% |
| Preparación y validación | ✅ | 80% |
| Exploración inicial | ✅ | 85% |
| Razonamiento y trazabilidad | ✅ | 70% |
| Cumplimiento normativo | ⚠️ | 60% |
| Seguridad y responsabilidad | ✅ | 75% |
| Comunicación visual | ✅ | 85% |

**Promedio General**: 78% ✅

---

## 🚧 Próximas Mejoras

### Fase 1 - Seguridad (Prioritario)
- [ ] Autenticación de usuarios
- [ ] Sistema de roles (admin, analista, viewer)
- [ ] Anonimización automática de datos sensibles
- [ ] HTTPS en producción
- [ ] Rate limiting

### Fase 2 - Visualización
- [ ] Gráficos con Chart.js o D3.js
- [ ] Exportación a CSV/Excel/PDF
- [ ] Dashboard con KPIs
- [ ] Mapas geográficos

### Fase 3 - Avanzado
- [ ] Historial persistente de consultas
- [ ] Comparativas temporales
- [ ] Alertas automáticas por email
- [ ] API REST documentada

---

## 👥 Equipo

**Linuxeros - Malackaton 2025**

---

## 📄 Documentación Adicional

- Ver `ANALISIS_DATOS.md` para documentación técnica completa
- Ver comentarios en código para detalles de implementación

---

**Última actualización**: 16 de octubre de 2025
