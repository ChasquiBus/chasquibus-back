# ChasquiBus - Backend

---

## 📱 Descripción

**ChasquiBus** es el backend de una plataforma integral para la gestión de rutas, boletos, buses, choferes y operaciones de cooperativas de transporte interprovincial. Este sistema está diseñado para integrarse con aplicaciones móviles y web, facilitando la administración y operación diaria de las cooperativas y mejorando la experiencia de los usuarios y choferes.

---

## ✨ Características Principales

- Gestión de usuarios, roles y autenticación JWT.
- Administración de cooperativas, buses, choferes y clientes.
- Control de rutas, paradas, frecuencias y tarifas.
- Generación y validación de boletos con QR.
- Gestión de ventas, pagos y métodos de pago.
- Módulo de descuentos y promociones.
- Configuración flexible de asientos (incluye buses de dos pisos).
- Endpoints para hojas de trabajo y programación de viajes.
- Integración con OCR (tesseract.js) y generación de reportes.
- API documentada con Swagger.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** (runtime)
- **NestJS** (framework principal)
- **TypeScript**
- **PostgreSQL** (base de datos)
- **Drizzle ORM** (acceso a datos y migraciones)
- **JWT** (autenticación)
- **Swagger** (documentación de API)
- **Tesseract.js** (OCR)
- **Supabase** (integración opcional)
- **Jest** (testing)
- **Prettier, ESLint** (formateo y calidad de código)

---

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 13
- (Opcional) Cuenta en Supabase para ciertas integraciones

---

## 🚀 Instalación y Configuración

```bash
# Clona el repositorio
git clone <repo-url>
cd chasquibus-back

# Instala dependencias
npm install

# Configura las variables de entorno (.env)
# Ejemplo:
# DATABASE_URL=postgres://user:password@localhost:5432/chasquibus
# JWT_SECRET=tu_secreto
# (Agrega otras variables según tu entorno)

# Ejecuta migraciones y seeds iniciales
npm run drizzle:migrate:push
npm run seed:superadmin
npm run seed:ciudades
```

---

## 📱 Estructura del Proyecto

```
chasquibus-back/
│
├── src/
│   ├── admin-cooperativas/
│   ├── boletos/
│   ├── buses/
│   ├── choferes/
│   ├── ciudades_provincias/
│   ├── clientes/
│   ├── configuracion-asientos/
│   ├── cooperativas/
│   ├── descuentos/
│   ├── drizzle/           # ORM, migraciones, seeds
│   ├── frecuencias/
│   ├── hoja-trabajo/
│   ├── metodos-pago/
│   ├── pagos/
│   ├── paradas/
│   ├── ruta-parada/
│   ├── rutas/
│   ├── tarifas-paradas/
│   ├── usuarios/
│   ├── ventas/
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

---

## 🎯 Funcionalidades Principales

- **Autenticación y roles:** Registro, login, recuperación de contraseña, control de acceso.
- **Gestión de cooperativas:** CRUD de cooperativas, admins, buses y choferes.
- **Rutas y frecuencias:** Definición de rutas, paradas, horarios y tarifas.
- **Boletos y ventas:** Compra, validación y control de boletos (con QR).
- **Pagos:** Integración de métodos de pago y control de estados.
- **Descuentos:** Aplicación de descuentos y promociones.
- **Hojas de trabajo:** Programación y seguimiento de viajes.
- **Reportes y estadísticas:** (Opcional, según módulos implementados).

---

## 🔧 Scripts Disponibles

- `npm run start` — Inicia el servidor en modo producción.
- `npm run start:dev` — Inicia en modo desarrollo con recarga automática.
- `npm run build` — Compila el proyecto.
- `npm run test` — Ejecuta los tests unitarios.
- `npm run test:e2e` — Ejecuta los tests end-to-end.
- `npm run drizzle:migrate:push` — Aplica migraciones de base de datos.
- `npm run seed:superadmin` — Crea el usuario superadmin.
- `npm run seed:ciudades` — Carga ciudades y provincias iniciales.

---

## 📱 Configuración de Dispositivos

- El backend expone endpoints REST y Swagger para integración con apps móviles y web.
- URL base por defecto: `http://localhost:3001/`
- Documentación interactiva: `http://localhost:3001/api`

---

## 🔐 Configuración de Permisos

- Acceso protegido por JWT.
- Roles: superadmin, admin, chofer, cliente, etc.
- Endpoints protegidos según rol y permisos.

---

## 🧪 Testing

- Tests unitarios y de integración con Jest.
- Cobertura de código:  
  ```bash
  npm run test:cov
  ```

---

## 📦 Build y Deploy

- Compilación:  
  ```bash
  npm run build
  ```
- Despliegue recomendado en servidores Node.js o plataformas como Heroku, AWS, etc.
- Verifica variables de entorno y base de datos antes de producción.

---

## 🐛 Solución de Problemas

- Revisa los logs del servidor para errores.
- Verifica la conexión a la base de datos y las variables de entorno.
- Usa la documentación Swagger para probar endpoints.
- Si tienes problemas con migraciones, revisa la configuración de Drizzle ORM.

---

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y asegúrate de pasar los tests.
4. Haz un Pull Request con una descripción clara.

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia de distribución pública.  
Contacta al equipo para más información.

---

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: NeoSoft
- **Diseño UI/UX**: NeoSoft
- **Backend**: Neosoft

---

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@chasquibus.com
- 📱 WhatsApp: +593 968622132
- 🌐 Website: https://neosoft-a8aeb.web.app/
