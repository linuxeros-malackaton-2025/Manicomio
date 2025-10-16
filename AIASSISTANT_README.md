# 🤖 Asistente de IA - Documentación

## 📋 Descripción General

Se ha implementado un asistente virtual con IA flotante en la esquina inferior derecha de la aplicación. Funciona como un chatbot contextual que ayuda a los usuarios a utilizar el sistema.

---

## 🎯 Características

### 1. **Botón Flotante**
- 🤖 Icono animado con efecto flotante
- Ubicación: Esquina inferior derecha
- Color: Gradiente púrpura (#667eea → #764ba2)
- Animación de hover con escala
- Notificación opcional (badge rojo)

### 2. **Panel de Chat Interactivo**
- **Dimensiones**: 380x500px (responsive)
- **Animación**: Slide-up al abrir
- **Header**: Gradiente con avatar y botón cerrar
- **Área de mensajes**: Scroll automático
- **Input**: Textarea con auto-resize
- **Botón enviar**: Diseño circular con icono

### 3. **Funcionalidades del Chat**
✅ Conversación fluida con IA  
✅ Indicador de escritura (typing dots)  
✅ Historial de conversación  
✅ Enter para enviar (Shift+Enter para nueva línea)  
✅ Scroll automático al último mensaje  
✅ Respuestas contextuales  

---

## 🧠 Capacidades del Asistente

### Puede Ayudar Con:

#### 📊 **Consultas SQL**
- Cómo escribir consultas en lenguaje natural
- Ejemplos de consultas comunes
- Explicación de sintaxis SQL
- Corrección de errores

#### 📈 **Visualización de Datos**
- Cómo generar gráficos
- Tipos de gráficos disponibles
- Interpretación de visualizaciones
- Mejores prácticas

#### 🧠 **Análisis Avanzado**
- Qué son los insights
- Cómo interpretar análisis
- Detección de anomalías
- Recomendaciones

#### 🏥 **Datos Médicos**
- Explicación de conceptos médicos
- Códigos CIE y GRD-APR
- Niveles de severidad
- Interpretación de resultados

#### 💡 **Ayuda General**
- Navegación del sistema
- Solución de problemas
- Buenas prácticas
- Tips y trucos

---

## 📡 Arquitectura Técnica

### Frontend: `AIAssistant.astro`

**Elementos HTML:**
```html
<div class="ai-assistant">
  <button id="aiToggleBtn">🤖</button>
  <div id="aiChatPanel">
    <div class="ai-chat-header">...</div>
    <div id="aiChatMessages">...</div>
    <div class="ai-chat-input-container">
      <textarea id="aiChatInput"></textarea>
      <button id="aiSendBtn">➤</button>
    </div>
  </div>
</div>
```

**JavaScript:**
- Manejo de estado (abierto/cerrado)
- Envío de mensajes
- Renderizado de respuestas
- Animaciones y scroll

### Backend: `/api/aiAssistant.ts`

**Request:**
```json
{
  "message": "¿Cómo hago una consulta SQL?"
}
```

**Response:**
```json
{
  "response": "Para hacer consultas, simplemente escribe...",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

**Modelo IA:** Google Gemini 2.0 Flash

---

## 🎨 Diseño Visual

### Colores
```css
/* Botón y header */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Mensajes del usuario */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Mensajes del bot */
background: var(--bg);
color: var(--text);
```

### Animaciones

**Flotación del botón:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

**Aparición del panel:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Typing indicator:**
```css
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}
```

---

## 💬 Ejemplos de Conversación

### Ejemplo 1: Ayuda con SQL

**Usuario:** "¿Cómo hago una consulta para ver pacientes de Madrid?"

**Asistente:**
```
Para consultar pacientes de Madrid, simplemente escribe en lenguaje 
natural en el campo de texto principal:

📝 "Pacientes de Madrid"

El sistema convertirá automáticamente tu consulta a SQL:
SELECT p.*, ca.nombre 
FROM paciente p 
JOIN comunidad_autonoma ca ON p.comunidad_autonoma_id = ca.id 
WHERE ca.nombre = 'Madrid'

¡Muy fácil! 😊
```

### Ejemplo 2: Ayuda con Gráficos

**Usuario:** "¿Cómo veo gráficos de los resultados?"

**Asistente:**
```
Después de ejecutar una consulta y ver los resultados en tabla, 
aparecerá un botón "📊 Ver Gráficos" debajo de la tabla.

Haz clic en él y el sistema generará automáticamente visualizaciones 
relevantes como:
• Gráficos de barras
• Gráficos circulares
• Gráficos de líneas

¡La IA elige los mejores gráficos para tus datos! 📈
```

### Ejemplo 3: Explicación de Conceptos

**Usuario:** "¿Qué es el nivel de severidad?"

**Asistente:**
```
El nivel de severidad es una escala médica del 1 al 4 que indica 
la gravedad del estado del paciente:

1️⃣ Severidad Baja - Casos leves
2️⃣ Severidad Moderada - Requiere atención
3️⃣ Severidad Alta - Condición seria
4️⃣ Severidad Muy Alta - Condición crítica

Para consultar pacientes con alta severidad puedes usar:
"Pacientes con nivel de severidad 4"
```

---

## 🚀 Casos de Uso

### 1. **Nuevo Usuario**
El asistente guía al usuario sobre cómo utilizar el sistema desde cero.

### 2. **Usuario Confundido**
Ayuda a resolver problemas o dudas específicas en tiempo real.

### 3. **Usuario Avanzado**
Proporciona tips avanzados y optimizaciones de consultas.

### 4. **Exploración de Datos**
Sugiere análisis interesantes basados en los datos disponibles.

---

## 🔧 Configuración

### Variables de Entorno
```env
GEMINI_API_KEY=tu_api_key_de_google_gemini
```

### Personalización

**Cambiar colores:**
```css
/* En AIAssistant.astro */
.ai-toggle-btn {
  background: linear-gradient(135deg, #tu-color-1, #tu-color-2);
}
```

**Cambiar posición:**
```css
.ai-assistant {
  bottom: 20px;  /* Distancia del borde inferior */
  right: 20px;   /* Distancia del borde derecho */
}
```

**Cambiar tamaño del panel:**
```css
.ai-chat-panel {
  width: 380px;   /* Ancho */
  height: 500px;  /* Alto */
}
```

---

## 📱 Responsive Design

### Desktop (> 480px)
- Panel: 380x500px
- Posición: Bottom right corner

### Mobile (≤ 480px)
- Panel: 100% ancho - 40px
- Altura: 100vh - 120px
- Se adapta a pantalla completa

---

## 🛡️ Manejo de Errores

### Sin Conexión a IA
El sistema tiene respuestas de fallback predefinidas para:
- Preguntas sobre SQL
- Preguntas sobre gráficos
- Preguntas sobre análisis
- Preguntas sobre datos
- Preguntas genéricas

### Error de Red
```
"No pude conectarme al servidor. Verifica tu conexión."
```

### Error del Servidor
```
"Lo siento, hubo un error al procesar tu pregunta. 
Por favor intenta de nuevo."
```

---

## 🎯 Mejores Prácticas

### Para Usuarios
1. Haz preguntas específicas
2. Proporciona contexto cuando sea necesario
3. Usa el botón de ayuda cuando tengas dudas

### Para Desarrolladores
1. Mantén el prompt del sistema actualizado
2. Añade más respuestas de fallback según casos de uso
3. Monitorea las conversaciones para mejorar respuestas
4. Considera añadir analytics de uso

---

## 🔮 Mejoras Futuras

### Fase 1
- [ ] Historial persistente de conversaciones
- [ ] Sugerencias proactivas basadas en contexto
- [ ] Accesos directos a funcionalidades

### Fase 2
- [ ] Modo de voz (speech-to-text)
- [ ] Exportar conversaciones
- [ ] Integración con tutoriales interactivos

### Fase 3
- [ ] Aprendizaje de preferencias del usuario
- [ ] Sugerencias de análisis personalizadas
- [ ] Modo colaborativo (compartir chats)

---

## 📊 Métricas de Uso

Considera trackear:
- Número de conversaciones iniciadas
- Preguntas más frecuentes
- Tiempo promedio de conversación
- Satisfacción del usuario (thumbs up/down)
- Tasa de resolución de dudas

---

## 🤝 Integración con el Sistema

El asistente está integrado en:
- **BaseLayout.astro** - Disponible en todas las páginas
- **Posición fija** - Siempre visible
- **Context-aware** - Conoce las funcionalidades del sistema

---

## 🎓 Ejemplos de Preguntas Comunes

```
1. "¿Cómo busco pacientes de una comunidad específica?"
2. "¿Qué significan los niveles de severidad?"
3. "¿Cómo genero gráficos de los resultados?"
4. "¿Puedo exportar los datos?"
5. "¿Qué es un análisis avanzado?"
6. "¿Cómo filtro por edad?"
7. "¿Qué consultas puedo hacer?"
8. "¿Cómo interpreto los insights?"
9. "¿Qué es GRD-APR?"
10. "¿Cómo ordeno los resultados?"
```

---

**Última actualización**: 16 de octubre de 2025  
**Archivos creados**:
- `src/components/AIAssistant.astro`
- `src/pages/api/aiAssistant.ts`
