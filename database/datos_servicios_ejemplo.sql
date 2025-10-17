-- ============================================
-- DATOS DE EJEMPLO PARA TABLA SERVICIOS
-- SkinCodeIA - Sistema de Gestión de Tatuajes y Piercings
-- ============================================

USE skincodeia;

-- Limpiar tabla de servicios (opcional)
-- DELETE FROM servicios;
-- ALTER TABLE servicios AUTO_INCREMENT = 1;

-- ============================================
-- SERVICIOS DE TATUAJES
-- ============================================

-- Tatuajes por Tamaño
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Tatuaje Mini', 'Tatuaje muy pequeño (2-5 cm). Ideal para símbolos, letras o diseños minimalistas. Tiempo estimado: 30-60 minutos.', 1),
('Tatuaje Pequeño', 'Tatuaje pequeño (5-10 cm). Perfecto para diseños simples en muñeca, tobillo o detrás de la oreja. Tiempo estimado: 1-2 horas.', 1),
('Tatuaje Mediano', 'Tatuaje mediano (10-20 cm). Ideal para brazo, pierna o espalda alta. Diseños con más detalle. Tiempo estimado: 2-4 horas.', 1),
('Tatuaje Grande', 'Tatuaje grande (20-30 cm). Para espalda, pecho, muslo. Diseños complejos con múltiples elementos. Tiempo estimado: 4-6 horas.', 1),
('Tatuaje Extra Grande', 'Tatuaje extra grande (más de 30 cm). Espalda completa, manga completa, pierna completa. Puede requerir múltiples sesiones. Tiempo estimado: 6+ horas.', 1);

-- Tatuajes por Estilo
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Tatuaje Realista', 'Estilo realista con sombreados y detalles fotográficos. Ideal para retratos, animales o paisajes. Requiere artista especializado.', 1),
('Tatuaje Tradicional', 'Estilo old school con líneas gruesas y colores sólidos. Clásico y atemporal. Diseños como anclas, rosas, calaveras.', 1),
('Tatuaje Minimalista', 'Diseños simples con líneas finas y limpias. Estilo moderno y discreto. Perfecto para primeros tatuajes.', 1),
('Tatuaje Geométrico', 'Diseños basados en formas geométricas, mandalas y patrones. Precisión y simetría. Estilo contemporáneo.', 1),
('Tatuaje Acuarela', 'Estilo de acuarela con colores difuminados y efecto de pintura. Diseños artísticos y coloridos sin líneas definidas.', 1),
('Tatuaje Blackwork', 'Tatuajes completamente en negro con rellenos sólidos. Diseños tribales, ornamentales o abstractos. Alto contraste.', 1),
('Tatuaje Dotwork', 'Técnica de puntillismo con miles de puntos. Diseños detallados con sombreados únicos. Requiere paciencia y precisión.', 1),
('Tatuaje Neo-Tradicional', 'Evolución del tradicional con más colores y detalles. Líneas gruesas pero con sombreados modernos.', 1),
('Tatuaje Japonés', 'Estilo irezumi con dragones, carpas koi, flores de cerezo. Diseños grandes y coloridos con significado cultural.', 1),
('Tatuaje Tribal', 'Diseños tribales con patrones étnicos. Líneas gruesas en negro. Inspirado en culturas polinesias, maorís o celtas.', 1);

-- Tatuajes por Ubicación
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Tatuaje en Brazo', 'Tatuaje en brazo completo, antebrazo o bíceps. Zona visible y popular. Dolor moderado.', 1),
('Tatuaje en Pierna', 'Tatuaje en muslo, pantorrilla o tobillo. Amplio espacio para diseños grandes. Dolor variable según zona.', 1),
('Tatuaje en Espalda', 'Tatuaje en espalda alta, baja o completa. Ideal para diseños grandes y detallados. Dolor moderado.', 1),
('Tatuaje en Pecho', 'Tatuaje en pecho o costillas. Zona sensible con dolor alto. Diseños impactantes y personales.', 1),
('Tatuaje en Cuello', 'Tatuaje en cuello o nuca. Zona visible y atrevida. Dolor alto. Requiere compromiso.', 1),
('Tatuaje en Mano', 'Tatuaje en mano, dedos o muñeca. Zona muy visible. Puede desvanecerse más rápido. Dolor moderado-alto.', 1),
('Tatuaje en Pie', 'Tatuaje en pie, tobillo o empeine. Zona delicada con dolor alto. Requiere cuidados especiales.', 1);

-- Tatuajes Especiales
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Tatuaje de Cobertura (Cover-Up)', 'Cubrir un tatuaje antiguo con un nuevo diseño. Requiere evaluación previa y diseño personalizado. Puede requerir varias sesiones.', 1),
('Retoque de Tatuaje', 'Retoque de tatuaje existente para restaurar colores, líneas o detalles. Ideal para tatuajes antiguos o desvanecidos.', 1),
('Tatuaje de Letras/Texto', 'Tatuaje de frases, nombres, fechas o palabras. Diferentes tipografías disponibles. Tamaño y ubicación variables.', 1),
('Tatuaje de Retrato', 'Retrato realista de persona o mascota. Requiere foto de alta calidad y artista especializado. Alta complejidad.', 1),
('Tatuaje de Pareja/Matching', 'Tatuajes coordinados para parejas o amigos. Diseños complementarios o idénticos. Precio por persona.', 1),
('Tatuaje Temporal (Henna)', 'Tatuaje temporal con henna natural. Dura 1-3 semanas. Ideal para probar diseños o eventos especiales.', 1),
('Diseño Personalizado', 'Sesión de diseño personalizado con el artista. Incluye bocetos y revisiones hasta aprobar el diseño final.', 1);

-- ============================================
-- SERVICIOS DE PIERCINGS
-- ============================================

-- Piercings Faciales
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Piercing en Nariz (Nostril)', 'Piercing lateral en la nariz. El más común y versátil. Cicatrización: 2-4 meses. Incluye joya inicial de acero quirúrgico.', 1),
('Piercing Septum', 'Piercing en el tabique nasal. Discreto y moderno. Cicatrización: 2-3 meses. Incluye herradura o aro de acero quirúrgico.', 1),
('Piercing Bridge', 'Piercing horizontal en el puente de la nariz. Estilo único y llamativo. Cicatrización: 2-3 meses. Requiere anatomía adecuada.', 1),
('Piercing en Ceja', 'Piercing vertical u horizontal en la ceja. Estilo urbano. Cicatrización: 2-3 meses. Incluye barra recta.', 1),
('Piercing Labret', 'Piercing debajo del labio inferior. Clásico y versátil. Cicatrización: 2-3 meses. Incluye labret de acero quirúrgico.', 1),
('Piercing Monroe/Madonna', 'Piercing sobre el labio superior (estilo lunar de belleza). Cicatrización: 2-3 meses. Incluye labret con piedra.', 1),
('Piercing Medusa', 'Piercing en el centro del labio superior (filtrum). Simétrico y elegante. Cicatrización: 2-3 meses.', 1),
('Piercing Snake Bites', 'Dos piercings simétricos en el labio inferior. Estilo atrevido. Cicatrización: 2-3 meses. Precio incluye ambos piercings.', 1),
('Piercing Angel Bites', 'Dos piercings simétricos en el labio superior. Complemento de snake bites. Cicatrización: 2-3 meses. Precio incluye ambos.', 1);

-- Piercings de Oreja
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Piercing en Lóbulo', 'Piercing tradicional en el lóbulo de la oreja. El más común y menos doloroso. Cicatrización: 1-2 meses. Incluye aros o topos.', 1),
('Piercing Helix', 'Piercing en el cartílago superior de la oreja. Popular y versátil. Cicatrización: 3-6 meses. Incluye aro o topos.', 1),
('Piercing Tragus', 'Piercing en el cartílago pequeño frente al canal auditivo. Moderno y discreto. Cicatrización: 3-6 meses.', 1),
('Piercing Anti-Tragus', 'Piercing en el cartílago opuesto al tragus. Menos común y único. Cicatrización: 3-6 meses. Requiere anatomía adecuada.', 1),
('Piercing Conch', 'Piercing en el cartílago central de la oreja. Ideal para aros grandes. Cicatrización: 3-6 meses.', 1),
('Piercing Daith', 'Piercing en el pliegue interno del cartílago. Estilo único. Cicatrización: 3-6 meses. Algunos reportan alivio de migrañas.', 1),
('Piercing Rook', 'Piercing en el pliegue superior del cartílago. Posición única. Cicatrización: 3-6 meses. Requiere anatomía adecuada.', 1),
('Piercing Industrial', 'Dos piercings conectados por una barra larga. Estilo llamativo. Cicatrización: 6-12 meses. Requiere anatomía específica.', 1),
('Piercing Snug', 'Piercing en el borde interno del cartílago. Posición ajustada. Cicatrización: 6-12 meses. Dolor moderado-alto.', 1),
('Piercing Forward Helix', 'Piercing en la parte frontal del helix. Moderno y delicado. Cicatrización: 3-6 meses. Se puede hacer múltiple.', 1);

-- Piercings Corporales
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Piercing en Lengua', 'Piercing vertical en el centro de la lengua. Clásico y popular. Cicatrización: 4-6 semanas. Incluye barra de titanio.', 1),
('Piercing en Ombligo', 'Piercing en el ombligo (superior o inferior). Muy popular. Cicatrización: 6-12 meses. Incluye banana con piedra.', 1),
('Piercing en Pezón', 'Piercing horizontal en el pezón. Para hombres y mujeres. Cicatrización: 6-12 meses. Incluye barra recta de titanio. Precio por pezón.', 1),
('Piercing Surface', 'Piercing superficial en cualquier parte del cuerpo. Requiere evaluación de anatomía. Cicatrización: 3-6 meses.', 1),
('Piercing Dermal/Microdermal', 'Implante dérmico con una sola entrada. Permanente y versátil. Cicatrización: 1-3 meses. Incluye top decorativo.', 1);

-- Servicios Adicionales de Piercing
INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Cambio de Joya', 'Cambio de joya en piercing cicatrizado. Incluye limpieza y desinfección. Joya no incluida.', 1),
('Retiro de Piercing', 'Retiro profesional de piercing. Incluye limpieza y cuidados post-retiro. Recomendado para evitar infecciones.', 1),
('Expansión de Lóbulo', 'Expansión gradual del lóbulo con dilatadores. Proceso por etapas. Incluye dilatador y tapón. Precio por tamaño.', 1),
('Curación de Piercing Problemático', 'Evaluación y tratamiento de piercing con problemas (infección, rechazo, queloides). Incluye productos de limpieza.', 1),
('Kit de Cuidados para Piercing', 'Kit completo de limpieza y cuidados para piercing nuevo. Incluye solución salina, instrucciones y seguimiento.', 1);

-- ============================================
-- SERVICIOS COMBINADOS Y PAQUETES
-- ============================================

INSERT INTO servicios (nombre, descripcion, activo) VALUES
('Paquete: 3 Piercings de Lóbulo', 'Tres piercings en el lóbulo de una oreja (curated ear). Incluye joyas iniciales. Precio especial de paquete.', 1),
('Paquete: Tatuaje + Piercing', 'Combo de tatuaje pequeño + piercing a elección. Precio especial. Ideal para primera experiencia.', 1),
('Sesión de Consulta', 'Consulta personalizada para planificar tatuaje o piercing. Incluye asesoría, diseño preliminar y cotización. Valor se descuenta del servicio final.', 1),
('Certificado de Regalo', 'Certificado de regalo para cualquier servicio. Válido por 6 meses. Monto a elección del comprador.', 1);

-- ============================================
-- RESUMEN DE SERVICIOS INSERTADOS
-- ============================================

SELECT 'SERVICIOS INSERTADOS EXITOSAMENTE' AS resultado;

SELECT 
    COUNT(*) as total_servicios,
    SUM(CASE WHEN nombre LIKE '%Tatuaje%' THEN 1 ELSE 0 END) as servicios_tatuaje,
    SUM(CASE WHEN nombre LIKE '%Piercing%' THEN 1 ELSE 0 END) as servicios_piercing,
    SUM(CASE WHEN nombre LIKE '%Paquete%' OR nombre LIKE '%Consulta%' OR nombre LIKE '%Certificado%' THEN 1 ELSE 0 END) as servicios_adicionales
FROM servicios;

-- Ver todos los servicios insertados
SELECT id_servicio, nombre, LEFT(descripcion, 50) as descripcion_corta, activo 
FROM servicios 
ORDER BY id_servicio;

-- ============================================
-- NOTAS DE USO
-- ============================================

/*
CATEGORÍAS DE SERVICIOS INCLUIDOS:

TATUAJES (32 servicios):
- Por Tamaño: Mini, Pequeño, Mediano, Grande, Extra Grande (5)
- Por Estilo: Realista, Tradicional, Minimalista, Geométrico, Acuarela, Blackwork, Dotwork, Neo-Tradicional, Japonés, Tribal (10)
- Por Ubicación: Brazo, Pierna, Espalda, Pecho, Cuello, Mano, Pie (7)
- Especiales: Cover-Up, Retoque, Letras, Retrato, Pareja, Temporal, Diseño Personalizado (7)

PIERCINGS (30 servicios):
- Faciales: Nariz, Septum, Bridge, Ceja, Labret, Monroe, Medusa, Snake Bites, Angel Bites (9)
- Oreja: Lóbulo, Helix, Tragus, Anti-Tragus, Conch, Daith, Rook, Industrial, Snug, Forward Helix (10)
- Corporales: Lengua, Ombligo, Pezón, Surface, Dermal (5)
- Adicionales: Cambio de Joya, Retiro, Expansión, Curación, Kit de Cuidados (5)

PAQUETES Y OTROS (4 servicios):
- Paquete 3 Piercings
- Paquete Tatuaje + Piercing
- Sesión de Consulta
- Certificado de Regalo

TOTAL: 66 servicios

PARA USAR ESTE ARCHIVO:
1. Abre MySQL/phpMyAdmin
2. Selecciona la base de datos 'skincodeia'
3. Ejecuta este script SQL
4. Verifica que se insertaron correctamente

PARA AGREGAR PRECIOS:
Puedes agregar una columna 'precio' a la tabla servicios:
ALTER TABLE servicios ADD COLUMN precio DECIMAL(10,2) NULL AFTER descripcion;

Luego actualizar precios según tu negocio:
UPDATE servicios SET precio = 50000 WHERE nombre LIKE '%Mini%';
UPDATE servicios SET precio = 100000 WHERE nombre LIKE '%Pequeño%';
etc.
*/
