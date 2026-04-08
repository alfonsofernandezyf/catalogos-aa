// Alérgenos Alimentarios para México
// Basado en: Codex Alimentarius, FDA Big 9, NOM-051-SCFI/SSA1, REGULACIONES MÉXICO
// Clasificación por grupo alimentario

export const foodGroups = {
  'LACTEOS': { name: 'Lácteos y Derivados', description: 'Leche y productos lácteos' },
  'HUEVO': { name: 'Huevo y Derivados', description: 'Aves y huevo' },
  'LEGUMINOSAS': { name: 'Leguminosas', description: 'Frijoles, lentejas, cacahuate, soya' },
  'FRUTOS': { name: 'Frutos Secos y Semillas', description: 'Nuez, almendra, pistache, ajonjolí' },
  'FRUTAS': { name: 'Frutas', description: 'Frutas frescas y procesadas' },
  'VERDURAS': { name: 'Verduras y Hortalizas', description: 'Vegetales, hortalizas y legumbres verdes' },
  'PESCADO': { name: 'Pescados', description: 'Pescados con aletas' },
  'MARISCOS': { name: 'Crustáceos y Moluscos', description: 'Camarón, jaiba, langosta, pulpo, calamar' },
  'CEREALES': { name: 'Cereales con Gluten', description: 'Trigo, cebada, centeno, avena' },
  'SEMILLAS': { name: 'Semillas y Otros', description: 'Sésamo, mostaza, apio' },
  'OTROS': { name: 'Otros Alérgenos', description: 'Sulfitos, colorantes, conservadores' }
}

export const foodAllergens = [
  // ============ LÁCTEOS ============
  { code: 'ALG-001', name: 'Leche de vaca', scientificName: 'Bos taurus', group: 'LACTEOS', synonyms: ['Leche', 'Lácteo'], severity: 'Alta', crossReactivity: ['Leche de cabra, oveja', 'Carne de res'], description: 'Proteínas: caseína, α-lactoalbúmina, β-lactoglobulina' },
  { code: 'ALG-002', name: 'Caseína', scientificName: null, group: 'LACTEOS', synonyms: ['Caseinato'], severity: 'Alta', crossReactivity: ['Todas las leches'], description: 'Proteína principal de la leche, presente en queso' },
  { code: 'ALG-003', name: 'Suero de leche', scientificName: null, group: 'LACTEOS', synonyms: ['Whey'], severity: 'Moderada', crossReactivity: ['Lácteos'], description: 'Subproducto de la elaboración de queso' },
  { code: 'ALG-004', name: 'Lactosa', scientificName: null, group: 'LACTEOS', synonyms: ['Azúcar de leche'], severity: 'Variable', crossReactivity: [], description: 'Intolerancia frecuente, no es alergia IgE' },
  { code: 'ALG-005', name: 'Mantequilla', scientificName: null, group: 'LACTEOS', synonyms: ['Manteca'], severity: 'Alta', crossReactivity: ['Lácteos'], description: 'Contiene caseína residual' },
  { code: 'ALG-006', name: 'Queso', scientificName: null, group: 'LACTEOS', synonyms: ['Variedades: cheddar, mozzarella, parmesan'], severity: 'Alta', crossReactivity: ['Lácteos'], description: 'Todos los quesos contienen caseína' },
  { code: 'ALG-007', name: 'Yogur', scientificName: null, group: 'LACTEOS', synonyms: [], severity: 'Alta', crossReactivity: ['Lácteos'], description: 'Leche fermentada' },
  { code: 'ALG-008', name: 'Nieve/Helado', scientificName: null, group: 'LACTEOS', synonyms: ['Ice cream'], severity: 'Alta', crossReactivity: ['Lácteos'], description: 'Contiene leche y frecuentemente huevo' },
  
  // ============ HUEVO ============
  { code: 'ALG-009', name: 'Huevo de gallina', scientificName: 'Gallus domesticus', group: 'HUEVO', synonyms: ['Huevo'], severity: 'Alta', crossReactivity: ['Huevos de pato, gallina, codorniz'], description: 'Proteínas: ovoalbúmina, ovomucoide, lisozima' },
  { code: 'ALG-010', name: 'Clara de huevo', scientificName: null, group: 'HUEVO', synonyms: ['Albúmina'], severity: 'Alta', crossReactivity: ['Clara de otras aves'], description: 'Mayor alergenicidad que la yema' },
  { code: 'ALG-011', name: 'Yema de huevo', scientificName: null, group: 'HUEVO', synonyms: [], severity: 'Moderada', crossReactivity: ['Yema de otras aves'], description: 'Contiene livetina (síndrome ave-huevo)' },
  { code: 'ALG-012', name: 'Ovoalbúmina', scientificName: null, group: 'HUEVO', synonyms: ['Albumina'], severity: 'Alta', crossReactivity: [], description: 'Principal alérgeno de clara de huevo' },
  { code: 'ALG-013', name: 'Ovomucoide', scientificName: null, group: 'HUEVO', synonyms: [], severity: 'Alta', crossReactivity: [], description: 'Termorresistente, principal en niños' },
  { code: 'ALG-014', name: 'Lisozima', scientificName: null, group: 'HUEVO', synonyms: ['E1105'], severity: 'Moderada', crossReactivity: [], description: 'Enzima usada como conservante' },
  { code: 'ALG-015', name: 'Mayonesa', scientificName: null, group: 'HUEVO', synonyms: [], severity: 'Alta', crossReactivity: ['Huevo'], description: 'Contiene huevo, generalmente huevo entero' },
  
  // ============ LEGUMINOSAS ============
  { code: 'ALG-016', name: 'Cacahuate', scientificName: 'Arachis hypogaea', group: 'LEGUMINOSAS', synonyms: ['Maní', 'Peanut'], severity: 'Muy Alta', crossReactivity: ['Leguminosas'], description: 'Una de las principales causas de anafilaxia fatal' },
  { code: 'ALG-017', name: 'Soya', scientificName: 'Glycine max', group: 'LEGUMINOSAS', synonyms: ['Soy', 'Edamame', 'Tofu'], severity: 'Alta', crossReactivity: ['Leguminosas', 'Garbanzo'], description: 'Muy oculta en alimentos procesados' },
  { code: 'ALG-018', name: 'Frijol', scientificName: 'Phaseolus vulgaris', group: 'LEGUMINOSAS', synonyms: ['Judía', 'Bean'], severity: 'Baja', crossReactivity: ['Leguminosas'], description: 'Poco frecuente, casos aislados reportados' },
  { code: 'ALG-019', name: 'Lenteja', scientificName: 'Lens culinaris', group: 'LEGUMINOSAS', synonyms: ['Lentil'], severity: 'Baja', crossReactivity: ['Leguminosas'], description: 'Reacciones poco frecuentes' },
  { code: 'ALG-020', name: 'Garbanzo', scientificName: 'Cicer arietinum', group: 'LEGUMINOSAS', synonyms: ['Chícharo'], severity: 'Moderada', crossReactivity: ['Soya', 'Lenteja'], description: 'Común en cocina mexicana (hummus, falafel)' },
  { code: 'ALG-021', name: 'Haba', scientificName: 'Vicia faba', group: 'LEGUMINOSAS', synonyms: ['Fava bean'], severity: 'Moderada', crossReactivity: ['Leguminosas'], description: 'Contiene vicina/convicina' },
  { code: 'ALG-022', name: 'Alfalfa', scientificName: 'Medicago sativa', group: 'LEGUMINOSAS', synonyms: [], severity: 'Baja', crossReactivity: ['Leguminosas'], description: 'Germinados, sprouts' },
  
  // ============ FRUTOS SECOS ============
  { code: 'ALG-023', name: 'Nuez', scientificName: 'Juglans regia', group: 'FRUTOS', synonyms: ['Nuez inglesa', 'Walnut'], severity: 'Muy Alta', crossReactivity: ['Nuez negra', 'Pecana'], description: 'Tricóideae, familia del nogal' },
  { code: 'ALG-024', name: 'Nuez de nogal', scientificName: 'Juglans nigra', group: 'FRUTOS', synonyms: ['Black walnut'], severity: 'Muy Alta', crossReactivity: ['Nuez común'], description: 'Muy alergénica, contaminación cruzada frecuente' },
  { code: 'ALG-025', name: 'Almendra', scientificName: 'Prunus dulcis', group: 'FRUTOS', synonyms: ['Almond'], severity: 'Alta', crossReactivity: ['Melocotón', 'Ciruela'], description: 'Rosaceae, frecuente en repostería' },
  { code: 'ALG-026', name: 'Pistache', scientificName: 'Pistacia vera', group: 'FRUTOS', synonyms: ['Pistachio'], severity: 'Alta', crossReactivity: ['Mango', 'Pistache'], description: 'Frecuente en cocina mexicana' },
  { code: 'ALG-027', name: 'Pecana', scientificName: 'Carya illinoinensis', group: 'FRUTOS', synonyms: ['Pecan', 'Nuez pecana'], severity: 'Alta', crossReactivity: ['Nuez'], description: 'Común en dulce de calabaza, pan de muerto' },
  { code: 'ALG-028', name: 'Nuez de la India', scientificName: 'Anacardium occidentale', group: 'FRUTOS', synonyms: ['Cashew'], severity: 'Alta', crossReactivity: ['Pistache'], description: 'Anacardiaceae, alta alergenicidad' },
  { code: 'ALG-029', name: 'Avellana', scientificName: 'Corylus avellana', group: 'FRUTOS', synonyms: ['Hazelnut', 'Avellana'], severity: 'Alta', crossReactivity: ['Polen de abedul'], description: 'Común en dulces, contaminación cruzada' },
  { code: 'ALG-030', name: 'Macadamia', scientificName: 'Macadamia integrifolia', group: 'FRUTOS', synonyms: ['Macadamia'], severity: 'Moderada', crossReactivity: [], description: 'Menos frecuente, casos aislados' },
  { code: 'ALG-031', name: 'Piñón', scientificName: 'Pinus edulis', group: 'FRUTOS', synonyms: ['Pine nut', 'Pignoli'], severity: 'Moderada', crossReactivity: [], description: 'Piña de pino, usado en mole' },
  { code: 'ALG-032', name: 'Coco', scientificName: 'Cocos nucifera', group: 'FRUTOS', synonyms: ['Coconut'], severity: 'Baja', crossReactivity: [], description: 'Considerado bajo riesgo, casos raros' },

  // ============ FRUTAS (Codex Alimentarius) ============
  { code: 'ALG-073', name: 'Manzana', scientificName: 'Malus domestica', group: 'FRUTAS', synonyms: ['Apple'], severity: 'Moderada', crossReactivity: ['Polen de abedul', 'Almendra'], description: 'Síndrome polen-fruta (PRAS)' },
  { code: 'ALG-074', name: 'Melocotón', scientificName: 'Prunus persica', group: 'FRUTAS', synonyms: ['Durazno', 'Peach'], severity: 'Alta', crossReactivity: ['Almendra', 'Ciruela', 'Cereza'], description: 'LTP, principal fruta alergénica en España' },
  { code: 'ALG-075', name: 'Albaricoque', scientificName: 'Prunus armeniaca', group: 'FRUTAS', synonyms: ['Apricot'], severity: 'Moderada', crossReactivity: ['Melocotón', 'Ciruela'], description: 'Rosaceae, síndrome polen-fruta' },
  { code: 'ALG-076', name: 'Cereza', scientificName: 'Prunus avium', group: 'FRUTAS', synonyms: ['Cherry'], severity: 'Moderada', crossReactivity: ['Melocotón', 'Ciruela'], description: 'Rosaceae' },
  { code: 'ALG-077', name: 'Ciruela', scientificName: 'Prunus domestica', group: 'FRUTAS', synonyms: ['Plum'], severity: 'Moderada', crossReactivity: ['Melocotón', 'Cereza'], description: 'Rosaceae' },
  { code: 'ALG-078', name: 'Fresa', scientificName: 'Fragaria × ananassa', group: 'FRUTAS', synonyms: ['Strawberry'], severity: 'Alta', crossReactivity: [], description: 'Frecuentemente oculta en dulces, helados' },
  { code: 'ALG-079', name: 'Mango', scientificName: 'Mangifera indica', group: 'FRUTAS', synonyms: ['Mango'], severity: 'Alta', crossReactivity: ['Pistache', 'Anacardo'], description: 'Anacardiaceae, reacciones severas reportadas' },
  { code: 'ALG-080', name: 'Plátano', scientificName: 'Musa × paradisiaca', group: 'FRUTAS', synonyms: ['Banana'], severity: 'Moderada', crossReactivity: ['Látex', 'Aguacate'], description: 'Síndrome látex-fruta' },
  { code: 'ALG-081', name: 'Kiwi', scientificName: 'Actinidia deliciosa', group: 'FRUTAS', synonyms: ['Kiwi'], severity: 'Alta', crossReactivity: ['Látex', 'Aguacate'], description: 'Actinidiaceae, creciente en México' },
  { code: 'ALG-082', name: 'Aguacate', scientificName: 'Persea americana', group: 'FRUTAS', synonyms: ['Avocado'], severity: 'Moderada', crossReactivity: ['Látex', 'Plátano'], description: 'Síndrome látex-fruta, crema aguacatera' },
  { code: 'ALG-083', name: 'Papaya', scientificName: 'Carica papaya', group: 'FRUTAS', synonyms: ['Papaya'], severity: 'Moderada', crossReactivity: [], description: 'Tropical, enzima papaína' },
  { code: 'ALG-084', name: 'Piña', scientificName: 'Ananas comosus', group: 'FRUTAS', synonyms: ['Pineapple'], severity: 'Moderada', crossReactivity: [], description: 'Bromelina, sensibilizante oral' },
  { code: 'ALG-085', name: 'Uvas', scientificName: 'Vitis vinifera', group: 'FRUTAS', synonyms: ['Grapes'], severity: 'Moderada', crossReactivity: [], description: 'Vino, jugo de uva' },
  { code: 'ALG-086', name: 'Sandía', scientificName: 'Citrullus lanatus', group: 'FRUTAS', synonyms: ['Watermelon'], severity: 'Moderada', crossReactivity: ['Melón', 'Pepino'], description: 'Síndrome melón-sandia' },
  { code: 'ALG-087', name: 'Melón', scientificName: 'Cucumis melo', group: 'FRUTAS', synonyms: ['Melon'], severity: 'Moderada', crossReactivity: ['Sandía', 'Pepino'], description: 'Síndrome melón-sandia' },
  { code: 'ALG-088', name: 'Naranja', scientificName: 'Citrus sinensis', group: 'FRUTAS', synonyms: ['Orange'], severity: 'Baja', crossReactivity: [], description: 'Cítricos, casos aislados' },
  { code: 'ALG-089', name: 'Limón', scientificName: 'Citrus limon', group: 'FRUTAS', synonyms: ['Lemon'], severity: 'Baja', crossReactivity: ['Naranja', 'Lima'], description: 'Cítricos' },
  { code: 'ALG-090', name: 'Mandarina', scientificName: 'Citrus reticulata', group: 'FRUTAS', synonyms: ['Tangerine'], severity: 'Baja', crossReactivity: ['Naranja'], description: 'Cítricos' },
  { code: 'ALG-091', name: 'Higo', scientificName: 'Ficus carica', group: 'FRUTAS', synonyms: ['Fig'], severity: 'Moderada', crossReactivity: ['Látex'], description: 'Látex de higuera' },

  // ============ VERDURAS/HORTALIZAS (Codex Alimentarius) ============
  { code: 'ALG-092', name: 'Tomate', scientificName: 'Solanum lycopersicum', group: 'VERDURAS', synonyms: ['Tomato'], severity: 'Moderada', crossReactivity: ['Patata', 'Pimiento'], description: 'Solanaceae, PRAS frecuente' },
  { code: 'ALG-093', name: 'Patata', scientificName: 'Solanum tuberosum', group: 'VERDURAS', synonyms: ['Papa', 'Potato'], severity: 'Baja', crossReactivity: ['Tomate', 'Polen'], description: 'Solanaceae, casos aislados' },
  { code: 'ALG-094', name: 'Pimiento', scientificName: 'Capsicum annuum', group: 'VERDURAS', synonyms: ['Chile', 'Bell pepper'], severity: 'Moderada', crossReactivity: ['Tomate', 'Patata'], description: 'Solanaceae, chile en polvo' },
  { code: 'ALG-095', name: 'Zanahoria', scientificName: 'Daucus carota', group: 'VERDURAS', synonyms: ['Carrot'], severity: 'Moderada', crossReactivity: ['Apio', 'Perejil'], description: 'Apiaceae' },
  { code: 'ALG-096', name: 'Apio', scientificName: 'Apium graveolens', group: 'VERDURAS', synonyms: ['Celery'], severity: 'Moderada', crossReactivity: ['Zanahoria', 'Perejil'], description: 'Apiaceae, presente en sopas, caldos' },
  { code: 'ALG-097', name: 'Perejil', scientificName: 'Petroselinum crispum', group: 'VERDURAS', synonyms: ['Parsley'], severity: 'Baja', crossReactivity: ['Zanahoria', 'Apio'], description: 'Apiaceae, condimento' },
  { code: 'ALG-098', name: 'Cebolla', scientificName: 'Allium cepa', group: 'VERDURAS', synonyms: ['Onion'], severity: 'Baja', crossReactivity: ['Ajo', 'Puerro'], description: 'Allium, contaminación cruzada' },
  { code: 'ALG-099', name: 'Ajo', scientificName: 'Allium sativum', group: 'VERDURAS', synonyms: ['Garlic'], severity: 'Baja', crossReactivity: ['Cebolla', 'Puerro'], description: 'Allium' },
  { code: 'ALG-100', name: 'Lechuga', scientificName: 'Lactuca sativa', group: 'VERDURAS', synonyms: ['Lettuce'], severity: 'Baja', crossReactivity: [], description: 'Ensaladas, látex de planta' },
  { code: 'ALG-101', name: 'Espinaca', scientificName: 'Spinacia oleracea', group: 'VERDURAS', synonyms: ['Spinach'], severity: 'Baja', crossReactivity: [], description: 'Oxalatos, casos aislados' },
  { code: 'ALG-102', name: 'Brócoli', scientificName: 'Brassica oleracea', group: 'VERDURAS', synonyms: ['Broccoli'], severity: 'Baja', crossReactivity: ['Coliflor', 'Col'], description: 'Brassica, casos aislados' },
  { code: 'ALG-103', name: 'Coliflor', scientificName: 'Brassica oleracea var. botrytis', group: 'VERDURAS', synonyms: ['Cauliflower'], severity: 'Baja', crossReactivity: ['Brócoli', 'Col'], description: 'Brassica' },
  { code: 'ALG-104', name: 'Col/Repollo', scientificName: 'Brassica oleracea var. capitata', group: 'VERDURAS', synonyms: ['Cabbage'], severity: 'Baja', crossReactivity: ['Brócoli', 'Coliflor'], description: 'Brassica' },
  { code: 'ALG-105', name: 'Pepino', scientificName: 'Cucumis sativus', group: 'VERDURAS', synonyms: ['Cucumber'], severity: 'Moderada', crossReactivity: ['Melón', 'Sandía'], description: 'Cucurbitaceae' },
  { code: 'ALG-106', name: 'Calabaza', scientificName: 'Cucurbita spp.', group: 'VERDURAS', synonyms: ['Squash', 'Pumpkin'], severity: 'Baja', crossReactivity: ['Melón', 'Pepino'], description: 'Cucurbitaceae' },
  { code: 'ALG-107', name: 'Betabel', scientificName: 'Beta vulgaris', group: 'VERDURAS', synonyms: ['Beet', 'Remolacha'], severity: 'Baja', crossReactivity: [], description: 'Casos raros reportados' },
  { code: 'ALG-108', name: 'Champiñón', scientificName: 'Agaricus bisporus', group: 'VERDURAS', synonyms: ['Mushroom'], severity: 'Baja', crossReactivity: [], description: 'Hongos, casos aislados' },
  { code: 'ALG-109', name: 'Ejotes', scientificName: 'Phaseolus vulgaris', group: 'VERDURAS', synonyms: ['Green beans', 'Judías verdes'], severity: 'Baja', crossReactivity: ['Leguminosas'], description: 'Frijol tierno' },
  { code: 'ALG-110', name: 'Chícharo', scientificName: 'Pisum sativum', group: 'VERDURAS', synonyms: ['Peas', 'Guisantes'], severity: 'Moderada', crossReactivity: ['Maní', 'Leguminosas'], description: 'Legumbre verde' },

  // ============ PESCADOS ============
  { code: 'ALG-033', name: 'Bacalao', scientificName: 'Gadus morhua', group: 'PESCADO', synonyms: ['Cod'], severity: 'Alta', crossReactivity: ['Otros bacalaos', 'Merluza'], description: 'Parvalbúmina, termorresistente' },
  { code: 'ALG-034', name: 'Atún', scientificName: 'Thunnus spp.', group: 'PESCADO', synonyms: ['Tuna'], severity: 'Alta', crossReactivity: ['Bonito, caballa'], description: 'Muy consumido en México' },
  { code: 'ALG-035', name: 'Salmón', scientificName: 'Salmo salar', group: 'PESCADO', synonyms: ['Salmon'], severity: 'Alta', crossReactivity: ['Trucha'], description: 'Contaminación cruzada frecuente en restaurantes' },
  { code: 'ALG-036', name: 'Mojarra', scientificName: 'Tilapia spp.', group: 'PESCADO', synonyms: ['Tilapia'], severity: 'Moderada', crossReactivity: ['Otros peces'], description: 'Muy consumido en México' },
  { code: 'ALG-037', name: 'Huachinango', scientificName: 'Lutjanuscampechanus', group: 'PESCADO', synonyms: ['Red snapper'], severity: 'Moderada', crossReactivity: ['Pargos'], description: 'Pescado rojo, alta cocina' },
  { code: 'ALG-038', name: 'Róbalo', scientificName: 'Centropomus spp.', group: 'PESCADO', synonyms: ['Snook'], severity: 'Moderada', crossReactivity: ['Otros peces'], description: 'Pescado blanco mexicano' },
  { code: 'ALG-039', name: 'Corvina', scientificName: 'Sciaenops ocellatus', group: 'PESCADO', synonyms: ['Red drum'], severity: 'Moderada', crossReactivity: ['Otros peces'], description: 'Frecuente en Pacífico mexicano' },
  { code: 'ALG-040', name: 'Sardina', scientificName: 'Sardinops sagax', group: 'PESCADO', synonyms: ['Sardine'], severity: 'Moderada', crossReactivity: ['Anchoa', 'Arenque'], description: 'Enlatados, aceites de pescado' },
  { code: 'ALG-041', name: 'Anchoa', scientificName: 'Engraulis mordax', group: 'PESCADO', synonyms: ['Anchovy'], severity: 'Alta', crossReactivity: ['Sardina', 'Arenque'], description: 'Frecuentemente oculta en salsa worcestershire' },
  { code: 'ALG-042', name: 'Mero', scientificName: 'Epinephelus spp.', group: 'PESCADO', synonyms: ['Grouper'], severity: 'Moderada', crossReactivity: ['Otros peces'], description: 'Pescado de carne blanca' },
  { code: 'ALG-043', name: 'Pez gallo', scientificName: 'Heteropriacanthus cruentatus', group: 'PESCADO', synonyms: ['Bigeye'], severity: 'Moderada', crossReactivity: [], description: 'Consumo regional' },
  
  // ============ MARISCOS ============
  // Crustáceos
  { code: 'ALG-044', name: 'Camarón', scientificName: 'Penaeus spp.', group: 'MARISCOS', synonyms: ['Shrimp', 'Langostino'], severity: 'Muy Alta', crossReactivity: ['Camarón de todas las especies'], description: 'Principal alérgeno de mariscos en México' },
  { code: 'ALG-045', name: 'Jaiba', scientificName: 'Callinectes sapidus', group: 'MARISCOS', synonyms: ['Blue crab', 'Cangrejo'], severity: 'Alta', crossReactivity: ['Otros cangrejos'], description: 'Contaminación cruzada frecuente' },
  { code: 'ALG-046', name: 'Langosta', scientificName: 'Panulirus spp.', group: 'MARISCOS', synonyms: ['Lobster'], severity: 'Alta', crossReactivity: ['Langostino', 'Cangrejo'], description: 'Alta alergenicidad' },
  { code: 'ALG-047', name: 'Langostino', scientificName: 'Nematoceles spp.', group: 'MARISCOS', synonyms: ['Krill'], severity: 'Alta', crossReactivity: ['Camarón'], description: 'Similar a camarón' },
  
  // Moluscos
  { code: 'ALG-048', name: 'Pulpo', scientificName: 'Octopus spp.', group: 'MARISCOS', synonyms: ['Octopus'], severity: 'Moderada', crossReactivity: ['Calamar', 'Jibia'], description: 'Común en cocina costera mexicana' },
  { code: 'ALG-049', name: 'Calamar', scientificName: 'Loligo spp.', group: 'MARISCOS', synonyms: ['Squid', 'Calamares'], severity: 'Moderada', crossReactivity: ['Pulpo', 'Jibia'], description: 'Cefalópodo, alta frecuencia de reacciones' },
  { code: 'ALG-050', name: 'Almeja', scientificName: 'Venerupis spp.', group: 'MARISCOS', synonyms: ['Clam'], severity: 'Moderada', crossReactivity: ['Ostra', 'Mejillón'], description: 'Molusco bivalvo' },
  { code: 'ALG-051', name: 'Ostra', scientificName: 'Crassostrea spp.', group: 'MARISCOS', synonyms: ['Oyster'], severity: 'Moderada', crossReactivity: ['Almeja', 'Mejillón'], description: 'Consumo creciente en México' },
  { code: 'ALG-052', name: 'Mejillón', scientificName: 'Mytilus spp.', group: 'MARISCOS', synonyms: ['Mussel'], severity: 'Moderada', crossReactivity: ['Almeja', 'Ostra'], description: 'Contaminación cruzada frecuente' },
  { code: 'ALG-053', name: 'Caracol', scientificName: 'Helix spp.', group: 'MARISCOS', synonyms: ['Escargot', 'Snail'], severity: 'Moderada', crossReactivity: ['Cefalópodos'], description: 'Caracol de tierra (en algunos preparaciones)' },
  
  // ============ CEREALES CON GLUTEN ============
  { code: 'ALG-054', name: 'Trigo', scientificName: 'Triticum aestivum', group: 'CEREALES', synonyms: ['Wheat', 'Trigo sarraceno (no relacionado)'], severity: 'Alta', crossReactivity: ['Cebada', 'Centeno'], description: 'Incluye harina, sémola, salvado' },
  { code: 'ALG-055', name: 'Cebada', scientificName: 'Hordeum vulgare', group: 'CEREALES', synonyms: ['Barley'], severity: 'Moderada', crossReactivity: ['Trigo', 'Centeno'], description: 'En cerveza, malta, sopa de pasta' },
  { code: 'ALG-056', name: 'Centeno', scientificName: 'Secale cereale', group: 'CEREALES', synonyms: ['Rye'], severity: 'Moderada', crossReactivity: ['Trigo', 'Cebada'], description: 'Pan de centeno, whisky' },
  { code: 'ALG-057', name: 'Avena', scientificName: 'Avena sativa', group: 'CEREALES', synonyms: ['Oats'], severity: 'Moderada', crossReactivity: ['Trigo'], description: 'Contaminación cruzada frecuente con trigo' },
  { code: 'ALG-058', name: 'Gluten', scientificName: null, group: 'CEREALES', synonyms: [], severity: 'Alta', crossReactivity: ['Todos los cereales con gluten'], description: 'Proteína compleja (gliadina + glutenina)' },
  { code: 'ALG-059', name: 'Salvado de trigo', scientificName: null, group: 'CEREALES', synonyms: [], severity: 'Alta', crossReactivity: ['Trigo'], description: 'Subproducto del trigo' },
  { code: 'ALG-060', name: 'Sémola', scientificName: null, group: 'CEREALES', synonyms: ['Semolina'], severity: 'Alta', crossReactivity: ['Trigo'], description: 'Harina de trigo duro, pasta' },
  
  // ============ SEMILLAS ============
  { code: 'ALG-061', name: 'Sésamo', scientificName: 'Sesamum indicum', group: 'SEMILLAS', synonyms: ['Ajonjolí', 'Sesame'], severity: 'Alta', crossReactivity: [], description: 'Big 9 desde 2023 en USA, NOM-051' },
  { code: 'ALG-062', name: 'Mostaza', scientificName: 'Brassica spp.', group: 'SEMILLAS', synonyms: ['Mustard'], severity: 'Moderada', crossReactivity: ['Brócoli', 'Coliflor', 'Nabo'], description: 'Presente en salsa inglés, mostaza preparada' },
  { code: 'ALG-063', name: 'Girasol', scientificName: 'Helianthus annuus', group: 'SEMILLAS', synonyms: ['Sunflower'], severity: 'Baja', crossReactivity: [], description: 'Semillas y aceite' },
  { code: 'ALG-064', name: 'Amapola', scientificName: 'Papaver somniferum', group: 'SEMILLAS', synonyms: ['Poppy seed'], severity: 'Baja', crossReactivity: [], description: 'Semillas de amapola en pan, pasteles' },
  { code: 'ALG-065', name: 'Chía', scientificName: 'Salvia hispanica', group: 'SEMILLAS', synonyms: ['Chia'], severity: 'Baja', crossReactivity: [], description: 'Súper alimento, reciente en dieta mexicana' },
  { code: 'ALG-066', name: 'Linaza', scientificName: 'Linum usitatissimum', group: 'SEMILLAS', synonyms: ['Flaxseed'], severity: 'Baja', crossReactivity: [], description: 'Semillas de lino' },
  
  // ============ OTROS ADITIVOS ============
  { code: 'ALG-067', name: 'Apio', scientificName: 'Apium graveolens', group: 'OTROS', synonyms: ['Celery'], severity: 'Moderada', crossReactivity: ['Zanahoria', 'Perejil'], description: 'Tubérculo, presente en sopas, caldos' },
  { code: 'ALG-068', name: 'Sulfitos', scientificName: null, group: 'OTROS', synonyms: ['E220-E228', 'Dióxido de azufre'], severity: 'Variable', crossReactivity: [], description: 'Conservantes en vinos, frutas secas, mariscos' },
  { code: 'ALG-069', name: 'Tartrazina', scientificName: null, group: 'OTROS', synonyms: ['E102', 'FD&C Yellow 5'], severity: 'Baja', crossReactivity: ['Aditivos azoicos'], description: 'Colorante amarillo sintético' },
  { code: 'ALG-070', name: 'Glutamato monosódico', scientificName: null, group: 'OTROS', synonyms: ['MSG', 'E621'], severity: 'Variable', crossReactivity: [], description: 'Sensibilidad, no es alergia IgE' },
  { code: 'ALG-071', name: 'Benzoatos', scientificName: null, group: 'OTROS', synonyms: ['E210-E219', 'Benzoic acid'], severity: 'Baja', crossReactivity: [], description: 'Conservantes' },
  { code: 'ALG-072', name: 'Cornezuelo de centeno', scientificName: 'Claviceps purpurea', group: 'OTROS', synonyms: ['Ergot'], severity: 'Baja', crossReactivity: ['Centeno'], description: 'Hongo parasitario del centeno' }
]

// Severidad típica
export const severityLevels = [
  { level: 'Muy Alta', description: 'Anafilaxia frecuente, pequeñas cantidades pueden causar reacciones severas', color: '#dc2626' },
  { level: 'Alta', description: 'Reacciones significativas, incluso moderadas ingestas pueden causar síntomas', color: '#f97316' },
  { level: 'Moderada', description: 'Reacciones variables, depende del individuo y forma de preparación', color: '#eab308' },
  { level: 'Baja', description: 'Casos raros reportados, reacciones generalmente leves', color: '#22c55e' }
]

export default foodAllergens
