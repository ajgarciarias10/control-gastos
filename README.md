# 📱 Control de Gastos — PWA Local & Privada

Una aplicación web progresiva (PWA) rápida, ligera y con look nativo diseñada para registrar tus gastos diarios desde el móvil o el ordenador de forma **100% local y privada**.

No requiere cuentas, registros ni conexión a servidores externos: todos tus datos se almacenan de manera segura en tu propio navegador.

---

## 🌟 Características

### 1. Gastos del Mes (Ciclo Habitual)
- **Navegación mensual**: Consulta y gestiona tus gastos mes a mes (`Septiembre 2026`, anteriores y siguientes) con acceso rápido al mes en curso ("Hoy").
- **Métricas inmediatas**: Total mensual acumulado, número de movimientos y media de gasto diario.
- **Categorías del día a día**:
  - 🛒 **Supermercado / Comida**
  - 🏋️‍♂️ **Deporte / Gimnasio** (cuota mensual de gym, pádel, clases...)
  - 🏠 **Vivienda / Alquiler**
  - 💡 **Facturas / Suministros** (luz, agua, internet, móvil)
  - 🍽️ **Restaurantes / Ocio**
  - 🚗 **Transporte / Gasolina**
  - 💊 **Farmacia / Salud**
  - 📦 **Otros recurrentes**
- **Agrupación diaria**: Gastos organizados automáticamente por días (*Hoy*, *Ayer*, *12 de Septiembre*...).

### 2. ⚡ Gastos Superfluos / No Mensuales
- **Sección independiente**: Diseñada específicamente para compras que no corresponden a un mes concreto (botes de proteína de 2kg, creatina, ropa deportiva o de calle, tecnología, viajes).
- **Presupuesto limpio**: Estas compras no alteran ni distorsionan tu gasto corriente mensual.
- **Cálculo de impacto**: Muestra el total anual acumulado en compras superfluas y una amortización mensual estimada a 12 meses.
- **Temática Deporte y Suplementación**: Incluye chips rápidos para suplementos como Proteína Whey, Creatina y material de entrenamiento.

### 3. Balance & Estadísticas
- Distribución porcentual entre **Gastos Habituales** y **Gastos Superfluos**.
- Gráfico de barras por categorías.
- Historial comparativo de evolución de los últimos 6 meses.

### 4. Experiencia Nativa (PWA)
- **Mobile-First**: Barra de navegación inferior táctil, botón flotante (+), modal deslizable desde abajo (*bottom sheet*), vibración háptica al pulsar y teclado decimal numérico (`inputmode="decimal"`).
- **Instalable**: Puedes añadirla a la pantalla de inicio de tu teléfono y usarla a pantalla completa como una aplicación nativa, incluso sin conexión a Internet (*Offline*).

### 5. 🔒 Privacidad y Copias de Seguridad
- **100% Local**: No envía información a ninguna nube ni a terceros.
- **Exportar / Importar**: Genera copias de seguridad en formato JSON con un clic para guardar tus datos o transferirlos entre dispositivos.

---

## 🚀 Cómo ejecutar la aplicación en local

### Opción 1: Con servidor local de Python (Recomendado para PWA)
Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
cd gastos_app
python3 -m http.server 8080
```

- En tu ordenador: entra a [http://localhost:8080](http://localhost:8080)
- En tu móvil (conectado a la misma red Wi-Fi): entra a `http://<IP_DE_TU_PC>:8080` (ej: `http://192.168.1.70:8080`)

### Opción 2: Directo desde el navegador
Haz doble clic sobre el archivo `index.html` o ábrelo directamente en Google Chrome, Firefox, Brave o Safari.

---

## 📲 Cómo instalarla como App en el Móvil

### En Android (Chrome / Brave / Edge)
1. Abre la web en tu navegador móvil.
2. Pulsa en los tres puntos del menú del navegador.
3. Toca en **"Añadir a la pantalla de inicio"** o **"Instalar aplicación"**.
4. Se creará el icono de **Gastos** en tu pantalla de aplicaciones y se abrirá sin las barras del navegador.

### En iPhone (Safari)
1. Abre la web en Safari.
2. Toca el botón **Compartir** (icono cuadrado con flecha hacia arriba).
3. Selecciona **"Añadir a la pantalla de inicio"**.

---

## 🛠️ Tecnologías

- **HTML5 Semántico**: Estructura accesible y ligera.
- **CSS3 Moderno**: Variables nativas, Dark Theme, animaciones fluidas a 60fps y Safe Area insets para dispositivos con notch.
- **JavaScript Vanilla (ES6+)**: Cero dependencias y cero frameworks pesados.
- **Web App Manifest & Service Worker**: Soporte completo para instalación PWA y funcionamiento offline.
