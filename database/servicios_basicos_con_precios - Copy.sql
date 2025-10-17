-- ============================================
-- SERVICIOS BÁSICOS CON PRECIOS SUGERIDOS
-- Versión simplificada para comenzar
-- ============================================

USE skincodeia;

-- Agregar columna de precio si no existe
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS precio DECIMAL(10,2) NULL AFTER descripcion;

-- ============================================
-- SERVICIOS DE TATUAJES (Precios en COP)
-- ============================================

-- Tatuajes por Tamaño
INSERT INTO servicios (nombre, descripcion, duracion_estimada, precio, activo) VALUES
('Tatuaje Mini (2-5cm)', 'Diseño muy pequeño, símbolos o letras, 30-60 min.', 80000, 1),
('Tatuaje Pequeño (5-10cm)', 'Diseño simple en muñeca, tobillo. 1-2 horas.', 150000, 1),
('Tatuaje Mediano (10-20cm)', 'Diseño con detalle en brazo o pierna. 2-4 horas.', 300000, 1),
('Tatuaje Grande (20-30cm)', 'Diseño complejo en espalda o pecho. 4-6 horas.', 500000, 1),
('Tatuaje Extra Grande (+30cm)', 'Manga completa o espalda completa. 6+ horas.', 800000, 1);

-- Estilos Populares
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Tatuaje Realista', 'Estilo fotográfico con sombreados. Retratos, animales.', 400000, 1),
('Tatuaje Tradicional', 'Old school con líneas gruesas y colores sólidos.', 250000, 1),
('Tatuaje Minimalista', 'Líneas finas y diseños simples. Moderno y discreto.', 120000, 1),
('Tatuaje Geométrico', 'Formas geométricas, mandalas. Precisión y simetría.', 280000, 1),
('Tatuaje Acuarela', 'Efecto de pintura con colores difuminados.', 350000, 1);

-- Servicios Especiales
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Cover-Up (Cobertura)', 'Cubrir tatuaje antiguo. Requiere evaluación previa.', 400000, 1),
('Retoque de Tatuaje', 'Restaurar colores y líneas de tatuaje existente.', 100000, 1),
('Diseño Personalizado', 'Sesión de diseño con bocetos y revisiones.', 50000, 1);

-- ============================================
-- SERVICIOS DE PIERCINGS (Precios en COP)
-- ============================================

-- Piercings Faciales
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Piercing Nariz (Nostril)', 'Lateral de nariz. Incluye joya de acero. 2-4 meses.', 40000, 1),
('Piercing Septum', 'Tabique nasal. Incluye herradura. 2-3 meses.', 50000, 1),
('Piercing Labret', 'Debajo del labio. Incluye labret. 2-3 meses.', 45000, 1),
('Piercing Monroe', 'Sobre labio superior. Incluye labret con piedra. 2-3 meses.', 45000, 1),
('Piercing Snake Bites', 'Dos piercings en labio inferior. Precio incluye ambos.', 80000, 1);

-- Piercings de Oreja
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Piercing Lóbulo', 'Tradicional en lóbulo. Incluye aros o topos. 1-2 meses.', 30000, 1),
('Piercing Helix', 'Cartílago superior. Incluye aro. 3-6 meses.', 40000, 1),
('Piercing Tragus', 'Cartílago frente al canal. Moderno. 3-6 meses.', 45000, 1),
('Piercing Conch', 'Cartílago central. Ideal para aros grandes. 3-6 meses.', 50000, 1),
('Piercing Daith', 'Pliegue interno. Estilo único. 3-6 meses.', 50000, 1),
('Piercing Industrial', 'Dos piercings con barra larga. 6-12 meses.', 70000, 1);

-- Piercings Corporales
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Piercing Lengua', 'Centro de lengua. Incluye barra titanio. 4-6 semanas.', 50000, 1),
('Piercing Ombligo', 'Superior o inferior. Incluye banana. 6-12 meses.', 50000, 1),
('Piercing Pezón', 'Horizontal. Incluye barra titanio. Precio por pezón.', 60000, 1),
('Piercing Dermal', 'Implante dérmico. Incluye top decorativo. 1-3 meses.', 80000, 1);

-- Servicios Adicionales
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Cambio de Joya', 'Cambio profesional. Joya no incluida.', 15000, 1),
('Retiro de Piercing', 'Retiro profesional con limpieza.', 10000, 1),
('Kit de Cuidados', 'Kit completo de limpieza para piercing nuevo.', 25000, 1);

-- ============================================
-- PAQUETES ESPECIALES
-- ============================================

INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES
('Paquete: 3 Piercings Lóbulo', 'Tres piercings en una oreja. Incluye joyas.', 75000, 1),
('Paquete: Tatuaje Mini + Piercing', 'Combo especial. Tatuaje mini + piercing a elección.', 110000, 1),
('Consulta Personalizada', 'Asesoría y diseño. Se descuenta del servicio final.', 30000, 1);

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 'SERVICIOS INSERTADOS CON PRECIOS' AS resultado;

SELECT 
    COUNT(*) as total_servicios,
    MIN(precio) as precio_minimo,
    MAX(precio) as precio_maximo,
    AVG(precio) as precio_promedio
FROM servicios
WHERE precio IS NOT NULL;

-- Ver servicios por categoría
SELECT 'TATUAJES' as categoria, COUNT(*) as cantidad, AVG(precio) as precio_promedio
FROM servicios 
WHERE nombre LIKE '%Tatuaje%'
UNION ALL
SELECT 'PIERCINGS' as categoria, COUNT(*) as cantidad, AVG(precio) as precio_promedio
FROM servicios 
WHERE nombre LIKE '%Piercing%'
UNION ALL
SELECT 'PAQUETES' as categoria, COUNT(*) as cantidad, AVG(precio) as precio_promedio
FROM servicios 
WHERE nombre LIKE '%Paquete%' OR nombre LIKE '%Consulta%';

-- Listar todos los servicios con precios
SELECT 
    id_servicio,
    nombre,
    CONCAT('$', FORMAT(precio, 0)) as precio_formateado,
    activo
FROM servicios
ORDER BY 
    CASE 
        WHEN nombre LIKE '%Tatuaje%' THEN 1
        WHEN nombre LIKE '%Piercing%' THEN 2
        ELSE 3
    END,
    precio;

-- ============================================
-- NOTAS SOBRE PRECIOS
-- ============================================

/*
PRECIOS SUGERIDOS EN PESOS COLOMBIANOS (COP):

TATUAJES:
- Mini (2-5cm): $80,000
- Pequeño (5-10cm): $150,000
- Mediano (10-20cm): $300,000
- Grande (20-30cm): $500,000
- Extra Grande (+30cm): $800,000

ESTILOS ESPECIALES:
- Realista: $400,000
- Tradicional: $250,000
- Minimalista: $120,000
- Geométrico: $280,000
- Acuarela: $350,000

PIERCINGS:
- Lóbulo: $30,000
- Faciales (Nariz, Labret, Monroe): $40,000 - $50,000
- Oreja (Helix, Tragus, Conch): $40,000 - $50,000
- Corporales (Lengua, Ombligo): $50,000
- Especiales (Industrial, Dermal): $70,000 - $80,000

SERVICIOS ADICIONALES:
- Cambio de joya: $15,000
- Retiro: $10,000
- Kit de cuidados: $25,000
- Consulta: $30,000

PAQUETES:
- 3 Piercings lóbulo: $75,000 (ahorro de $15,000)
- Tatuaje + Piercing: $110,000 (ahorro de $20,000)

NOTAS:
1. Estos precios son SUGERIDOS y deben ajustarse según:
   - Ubicación geográfica del estudio
   - Experiencia del artista
   - Complejidad del diseño
   - Tiempo estimado
   - Materiales utilizados

2. Los precios de tatuajes pueden variar según:
   - Cantidad de colores
   - Nivel de detalle
   - Ubicación en el cuerpo
   - Si requiere múltiples sesiones

3. Los precios de piercings INCLUYEN:
   - Joya inicial de acero quirúrgico o titanio
   - Procedimiento profesional
   - Instrucciones de cuidado
   - NO incluyen joyas premium (oro, diamantes, etc.)

4. Para actualizar precios masivamente:
   UPDATE servicios SET precio = precio * 1.1; -- Aumentar 10%
   UPDATE servicios SET precio = precio * 0.9; -- Disminuir 10%
*/
