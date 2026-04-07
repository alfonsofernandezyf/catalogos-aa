// Manifestaciones Clínicas para Alergia Alimentaria
// Clasificación basada en WAO/EAACI/NIAID 2024

export const clinicalManifestations = [
  // ============ PIEL ============
  // IgE-mediadas
  { code: 'MAN-001', name: 'Urticaria aguda', category: 'Piel', mechanism: 'IgE-mediada', severity: '2-3', description: 'Ronchas pruriginosas, eritematosas, transitorias' },
  { code: 'MAN-002', name: 'Angioedema', category: 'Piel', mechanism: 'IgE-mediada', severity: '2-3', description: 'Hinchazón de labios, párpados, lengua o garganta' },
  { code: 'MAN-003', name: 'Prurito cutáneo generalizada', category: 'Piel', mechanism: 'IgE-mediada', severity: '1-2', description: 'Comezón en la piel sin lesiones visibles' },
  { code: 'MAN-004', name: 'Eritema difuso', category: 'Piel', mechanism: 'IgE-mediada', severity: '1-2', description: 'Enrojecimiento generalizado de la piel' },
  { code: 'MAN-005', name: 'Síndrome de Schuler (flush)', category: 'Piel', mechanism: 'IgE-mediada', severity: '2-3', description: 'Enrojecimiento facial con prurito' },
  
  // No IgE-mediadas
  { code: 'MAN-006', name: 'Dermatitis atópica', category: 'Piel', mechanism: 'Mixta', severity: '1-2', description: 'Eccema crónico con prurito intenso' },
  { code: 'MAN-007', name: 'Dermatitis herpetiforme', category: 'Piel', mechanism: 'No IgE', severity: '1-2', description: 'Vesículas pruriginosas, asociada a enfermedad celíaca' },
  { code: 'MAN-008', name: 'Proctocolitis alérgica', category: 'Piel', mechanism: 'No IgE', severity: '1', description: 'Sangrado rectal leve en lactantes, proctitis' },
  
  // ============ RESPIRATORIO ============
  // IgE-mediadas
  { code: 'MAN-009', name: 'Rinitis alérgica', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '1-2', description: 'Estornudos, prurito nasal, rinorrea, congestión' },
  { code: 'MAN-010', name: 'Conjuntivitis alérgica', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '1-2', description: 'Prurito ocular, lagrimeo, enrojecimiento conjuntival' },
  { code: 'MAN-011', name: 'Síndrome de alergia oral (OAS)', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '1-2', description: 'Prurito/edema oral con frutas y verduras frescas' },
  { code: 'MAN-012', name: 'Tos', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '2-3', description: 'Tos seca persistente' },
  { code: 'MAN-013', name: 'Broncoespasmo', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '3-4', description: 'Sibilancias, dificultad respiratoria, opresión torácica' },
  { code: 'MAN-014', name: 'Disnea', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '3-4', description: 'Dificultad para respirar' },
  { code: 'MAN-015', name: 'Estridor laríngeo', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '4', description: 'Ruido inspiratorio agudo, obstrucción de vía aérea superior' },
  { code: 'MAN-016', name: 'Cianosis', category: 'Respiratorio', mechanism: 'IgE-mediada', severity: '4', description: 'Coloración azulada de piel/mucosas por hipoxia' },
  
  // ============ GASTROINTESTINAL ============
  // IgE-mediadas
  { code: 'MAN-017', name: 'Síndrome de enterocolitis (FPIES)', category: 'Gastrointestinal', mechanism: 'No IgE (FPIES)', severity: '3-4', description: 'Vómitos severos 2-4h post-ingesta, palidez, letargia' },
  { code: 'MAN-018', name: 'Náusea', category: 'Gastrointestinal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Sensación de náusea' },
  { code: 'MAN-019', name: 'Vómito', category: 'Gastrointestinal', mechanism: 'IgE-mediada', severity: '2-3', description: 'Emesis, puede ser única o repetitiva' },
  { code: 'MAN-020', name: 'Diarrea', category: 'Gastrointestinal', mechanism: 'Mixta', severity: '1-2', description: 'Heces sueltas, aumento en frecuencia' },
  { code: 'MAN-021', name: 'Dolor abdominal tipo cólico', category: 'Gastrointestinal', mechanism: 'IgE-mediada', severity: '2', description: 'Dolor abdominal intermitente' },
  { code: 'MAN-022', name: 'Pirosis', category: 'Gastrointestinal', mechanism: 'Mixta', severity: '1', description: 'Acidez estomacal' },
  { code: 'MAN-023', name: 'Esofagitis eosinofílica (EoE)', category: 'Gastrointestinal', mechanism: 'Mixta', severity: '2-3', description: 'Disfagia, impactación alimentaria, dolor torácico' },
  { code: 'MAN-024', name: 'Gastritis alérgica', category: 'Gastrointestinal', mechanism: 'Mixta', severity: '1-2', description: 'Dolor epigástrico, náusea, vómitos' },
  { code: 'MAN-025', name: 'Enteritis alérgica', category: 'Gastrointestinal', mechanism: 'No IgE', severity: '2', description: 'Diarrea mucosa, dolor abdominal' },
  { code: 'MAN-026', name: 'Colitis alérgica', category: 'Gastrointestinal', mechanism: 'No IgE', severity: '1-2', description: 'Sangrado rectal, irritabilidad en lactantes' },
  
  // ============ CARDIOVASCULAR ============
  { code: 'MAN-027', name: 'Taquicardia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3', description: 'Frecuencia cardíaca elevada >100 lpm' },
  { code: 'MAN-028', name: 'Bradicardia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Frecuencia cardíaca disminuida, signo de anafilaxia severa' },
  { code: 'MAN-029', name: 'Hipotensión', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3-4', description: 'PA sistólica <90 mmHg o >30% del basal' },
  { code: 'MAN-030', name: 'Arritmia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3-4', description: 'Irregularidad en el ritmo cardíaco' },
  { code: 'MAN-031', name: 'Shock anafiláctico', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Colapso cardiovascular con hipotensión refractaria' },
  { code: 'MAN-032', name: 'Pérdida de consciencia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Síncope, desmayo' },
  
  // ============ SISTEMA NERVIOSO ============
  { code: 'MAN-033', name: 'Cefalea', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '1-2', description: 'Dolor de cabeza' },
  { code: 'MAN-034', name: 'Mareo', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sensación de vértigo, aturdimiento' },
  { code: 'MAN-035', name: 'Confusión mental', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '3-4', description: 'Desorientación, alteración del estado mental' },
  { code: 'MAN-036', name: 'Convulsiones', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '4', description: 'En contexto de anafilaxia severa o hipoxia' },
  
  // ============ GENERAL/SISTÉMICO ============
  { code: 'MAN-037', name: 'Prurito generalizado sin lesiones', category: 'General', mechanism: 'IgE-mediada', severity: '1-2', description: 'Comezón en todo el cuerpo sin evidencia de lesiones' },
  { code: 'MAN-038', name: 'Sensación de muerte inminente', category: 'General', mechanism: 'IgE-mediada', severity: '3-4', description: 'Presagio de fatalidad (aura anafiláctica)' },
  { code: 'MAN-039', name: 'Letargia/somnolencia', category: 'General', mechanism: 'IgE-mediada', severity: '3', description: 'Decreased level of consciousness, letargia' },
  { code: 'MAN-040', name: 'Inquietud/agitación', category: 'General', mechanism: 'IgE-mediada', severity: '2', description: 'Ansiedad, agitación, sensación de opresión' },
  { code: 'MAN-041', name: 'Palidez', category: 'General', mechanism: 'IgE-mediada', severity: '2-3', description: 'Piel pálida, moteada' },
  { code: 'MAN-042', name: 'Diaforesis', category: 'General', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sudoración profusa' }
]

// Severidad WAO 2024
export const severityGrades = [
  { grade: '1', name: 'Leve', description: 'Síntomas transitorios, un solo órgano, sin compromiso vital' },
  { grade: '2', name: 'Moderada', description: 'Síntomas más pronunciados, 2+ órganos, requiere tratamiento' },
  { grade: '3', name: 'Severa', description: 'Compromiso respiratorio o cardiovascular, requiere epinefrina' },
  { grade: '4', name: 'Potencialmente fatal', description: 'Anafilaxia con compromiso de vía aérea, shock, muerte' }
]

// Mecanismos inmunológicos
export const mechanisms = [
  { code: 'IgE-mediada', name: 'IgE-mediada (Tipo I)', description: 'Reacción inmediata (minutos a 2 horas)' },
  { code: 'No IgE', name: 'No IgE-mediada (Tipo IV)', description: 'Reacción tardía (horas a días)' },
  { code: 'Mixta', name: 'Mixta (IgE + celular)', description: 'Combina mecanismos inmediatos y tardíos' },
  { code: 'No IgE (FPIES)', name: 'FPIES (Enterocolitis)', description: 'Reacción no-IgE específica del intestino' }
]

export default clinicalManifestations
