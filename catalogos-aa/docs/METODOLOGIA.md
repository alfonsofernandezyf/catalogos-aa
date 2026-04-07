# Catálogos-AA: Registro Nacional de Alergia Alimentaria

## Descripción
Herramienta web para gestionar catálogos de referencia en el diagnóstico y tratamiento de alergias alimentarias en México.

## Fuentes de Datos

### 1. Catálogo de Medicamentos ATC
**Fuente:** Clasificación ATC (Anatomical Therapeutic Chemical) de la OMS

El sistema ATC clasifica los medicamentos en 5 niveles jerárquicos:
- **1er nivel (letra):** Grupo anatómico principal
- **2do nivel (2 dígitos):** Grupo farmacológico terapéutico
- **3er nivel (letra):** Subgrupo químico
- **4to nivel (2 dígitos):** Subgrupo químico
- **5to nivel (2 dígitos):** Sustancia química individual

**Categorías incluidas:**
- R06: Antihistamínicos sistémicos
- R03: Respiratorios (asma, EPOC)
- R01: Nasales
- H02: Corticosteroides sistémicos
- D07/D11: Dermatológicos
- L04: Inmunosupresores y biológicas
- A02: Antiulcerosos
- J01: Antibióticos
- C, M, N: Cardiovasculares, AINES, neurológicos

### 2. Manifestaciones Clínicas
**Fuentes:**
- WAO (World Allergy Organization) 2024
- EAACI (European Academy of Allergy and Clinical Immunology) 2024
- NIAID (National Institute of Allergy and Infectious Diseases)
- NOM-233-SSA1-2003

**Clasificación:**
- **Por mecanismo:** IgE-mediada, No-IgE, Mixta, FPIES
- **Por sistema afectado:** Piel, Respiratorio, Gastrointestinal, Cardiovascular, Neurológico
- **Por severidad (WAO 2024):** Grade 1-4

### 3. Alérgenos Alimentarios
**Fuentes:**
- Codex Alimentarius (FAO/OMS)
- FDA Big 9 (2023)
- NOM-051-SCFI/SSA1-2010 (México)
- EAACI Guidelines 2024

**Grupos incluidos:**
- Lácteos y derivados
- Huevo y derivados
- Leguminosas
- Frutos secos y semillas
- Pescados
- Mariscos (crustáceos y moluscos)
- Cereales con gluten
- Semillas y otros
- Aditivos

**Ajustado para México:**
- Incluye pescados常见 en México (mojarra, huachinango, róbalo)
- Mariscos comunes en dieta mexicana (pulpo, calamar)
- Prevalencia local considerada

## Estructura del Proyecto

```
catalogos-aa/
├── src/
│   ├── data/
│   │   ├── medications.js      # Catálogo ATC (72 registros)
│   │   ├── clinicalManifestations.js  # Manifestaciones (42 registros)
│   │   └── foodAllergens.js   # Alérgenos (72 registros)
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos
├── index.html
├── package.json
└── vite.config.js
```

## Campos por Catálogo

### Medicamentos ATC
| Campo | Descripción |
|-------|-------------|
| atc_code | Código ATC nivel 5 (ej: R06AE07) |
| name | Nombre de la sustancia (INN) |
| route | Vía de administración |
| indication | Indicación terapéutica |

### Manifestaciones Clínicas
| Campo | Descripción |
|-------|-------------|
| code | Código interno (MAN-001) |
| name | Nombre de la manifestación |
| category | Sistema/órgano afectado |
| mechanism | Mecanismo inmunológico |
| severity | Severidad típica (Grade WAO) |
| description | Descripción clínica |

### Alérgenos Alimentarios
| Campo | Descripción |
|-------|-------------|
| code | Código interno (ALG-001) |
| name | Nombre común del alimento |
| scientificName | Nombre científico (opcional) |
| group | Grupo alimentario |
| synonyms | Nombres alternativos |
| severity | Nivel de riesgo (Muy Alta/Alta/Moderada/Baja) |
| crossReactivity | Reacciones cruzadas conocidas |
| description | Detalles técnicos |

## Funcionalidades

1. **Navegación por catálogos:** Tabs para cambiar entre catálogos
2. **Filtros dinámicos:** Según el catálogo activo
3. **Búsqueda por nombre:** Filtrado en tiempo real
4. **Selección múltiple:** Checkbox para seleccionar registros
5. **Favoritos:** Marcar elementos importantes
6. **Exportación:** JSON y CSV con vista previa
7. **Importación:** Cargar archivos para combinar selecciones
8. **Diseño responsive:** Funciona en móvil, tablet y escritorio

## Integración Futura

La arquitectura permite agregar fácilmente nuevos catálogos:

1. Crear archivo de datos en `src/data/`
2. Agregar configuración en `catalogs` y `catalogFields` en App.jsx
3. Los filtros y tabla se generan dinámicamente

### Posibles catálogos futuros:
- Pruebas diagnósticas (prick test, IgE específica)
- Protocolos de tratamiento
- Escalas de severidad validadas
- Alimentos разрешены/пrohibidos para dietas específicas
