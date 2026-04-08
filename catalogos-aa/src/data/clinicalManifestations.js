// Manifestaciones Clínicas para Alergia Alimentaria
// Clasificación por órganos/sistemas - Basado en WAO/EAACI/NIAID 2024

export const clinicalManifestations = [
  // ============ NASAL ============
  { code: 'MAN-101', name: 'Rinitis alérgica', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Estornudos, prurito nasal, rinorrea acuosa, congestión' },
  { code: 'MAN-102', name: 'Obstrucción nasal', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Congestión nasal bilateral' },
  { code: 'MAN-103', name: 'Prurito nasal', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1', description: 'Comezón داخل الأنف (dentro de la nariz)' },
  { code: 'MAN-104', name: 'Hiposmia', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Disminución del olfato' },
  { code: 'MAN-105', name: 'Epistaxis', category: 'Nasal', mechanism: 'Mixta', severity: '1', description: 'Sangrado nasal' },
  { code: 'MAN-106', name: 'Rinorrea hialina', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Secreción nasal acuosa, transparente' },
  { code: 'MAN-107', name: 'Estornudos', category: 'Nasal', mechanism: 'IgE-mediada', severity: '1-2', description: 'Estornudos en salvas' },

  // ============ OCULAR ============
  { code: 'MAN-201', name: 'Conjuntivitis alérgica', category: 'Ocular', mechanism: 'IgE-mediada', severity: '1-2', description: 'Prurito ocular, lagrimeo, enrojecimiento conjuntival' },
  { code: 'MAN-202', name: 'Quemosis', category: 'Ocular', mechanism: 'IgE-mediada', severity: '2-3', description: 'Hinchazón de la conjuntiva (ojo rojo e hinchado)' },
  { code: 'MAN-203', name: 'Edema palpebral', category: 'Ocular', mechanism: 'IgE-mediada', severity: '2-3', description: 'Hinchazón de los párpados' },
  { code: 'MAN-204', name: 'Prurito periocular', category: 'Ocular', mechanism: 'IgE-mediada', severity: '1', description: 'Comezón alrededor de los ojos' },
  { code: 'MAN-205', name: 'Fotofobia', category: 'Ocular', mechanism: 'IgE-mediada', severity: '2', description: 'Sensibilidad a la luz' },
  { code: 'MAN-206', name: 'Lacrimación', category: 'Ocular', mechanism: 'IgE-mediada', severity: '1-2', description: 'Producción excesiva de lágrimas' },
  { code: 'MAN-207', name: 'Sensación de cuerpo extraño', category: 'Ocular', mechanism: 'IgE-mediada', severity: '1-2', description: 'Sensación de arena o cuerpo extraño en el ojo' },

  // ============ ÓTICA ============
  { code: 'MAN-301', name: 'Otalgia', category: 'Ótica', mechanism: 'IgE-mediada', severity: '1-2', description: 'Dolor de oído' },
  { code: 'MAN-302', name: 'Otorrea', category: 'Ótica', mechanism: 'IgE-mediada', severity: '2', description: 'Secreción del oído (liquid-clear o purulenta)' },
  { code: 'MAN-303', name: 'Prurito ótico', category: 'Ótica', mechanism: 'IgE-mediada', severity: '1', description: 'Comezón en el oído externo' },
  { code: 'MAN-304', name: 'Hipoacusia', category: 'Ótica', mechanism: 'Mixta', severity: '2', description: 'Disminución de la audición transitoria' },
  { code: 'MAN-305', name: 'Acúfenos', category: 'Ótica', mechanism: 'IgE-mediada', severity: '2', description: 'Zumbido o pitido en los oídos' },
  { code: 'MAN-306', name: 'Tinnitus', category: 'Ótica', mechanism: 'IgE-mediada', severity: '2', description: 'Zumbido, pitido o ruido en los oídos' },
  { code: 'MAN-307', name: 'Vértigo', category: 'Ótica', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sensación de girar o balanceo' },
  { code: 'MAN-308', name: 'Plenitud ótica', category: 'Ótica', mechanism: 'IgE-mediada', severity: '1-2', description: 'Sensación de presión o taponamiento en el oído' },

  // ============ FARÍNGEA ============
  { code: 'MAN-401', name: 'Síndrome de alergia oral (OAS)', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Prurito/edema oral con frutas y verduras frescas' },
  { code: 'MAN-402', name: 'Disfagia', category: 'Faríngea', mechanism: 'Mixta', severity: '2-3', description: 'Dificultad para tragar alimentos' },
  { code: 'MAN-403', name: 'Odinofagia', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '2', description: 'Dolor al tragar' },
  { code: 'MAN-404', name: 'Prurito faríngeo', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Comezón en la garganta' },
  { code: 'MAN-405', name: 'Edema faríngeo', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '3-4', description: 'Hinchazón de la garganta, sensación de opresión' },
  { code: 'MAN-406', name: 'Tos faríngea', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Tos por irritación de la garganta' },
  { code: 'MAN-407', name: 'Descarga posterior', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Moco que gotea por la parte posterior de la garganta' },
  { code: 'MAN-408', name: 'Sensación de atragantamiento', category: 'Faríngea', mechanism: 'IgE-mediada', severity: '3-4', description: 'Sensación de ahogamiento o sofocación' },

  // ============ VÍA AÉREA INFERIOR ============
  { code: 'MAN-501', name: 'Tos', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '2-3', description: 'Tos seca persistente' },
  { code: 'MAN-502', name: 'Broncoespasmo', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '3-4', description: 'Sibilancias, dificultad respiratoria, opresión torácica' },
  { code: 'MAN-503', name: 'Disnea', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '3-4', description: 'Dificultad para respirar, falta de aire' },
  { code: 'MAN-504', name: 'Sibilancias', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '2-3', description: 'Ruidos respiratorios agudos' },
  { code: 'MAN-505', name: 'Opresión torácica', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sensación de presión en el pecho' },
  { code: 'MAN-506', name: 'Taquipnea', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '3', description: 'Frecuencia respiratoria elevada >20 rpm' },
  { code: 'MAN-508', name: 'Silbido torácico', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '3', description: 'Sonido agudo al respirar audible sin estetoscopio' },
  { code: 'MAN-509', name: 'Roncus', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '2-3', description: 'Ruidos respiratorios graves, ronquidos' },
  { code: 'MAN-510', name: 'Estridor', category: 'Vía aérea inferior', mechanism: 'IgE-mediada', severity: '4', description: 'Ruido inspiratorio agudo por obstrucción de vía aérea' },

  // ============ CARDIOVASCULAR ============
  { code: 'MAN-601', name: 'Taquicardia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3', description: 'Frecuencia cardíaca >100 lpm en adultos' },
  { code: 'MAN-602', name: 'Bradicardia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Frecuencia cardíaca disminuida, signo de anafilaxia severa' },
  { code: 'MAN-603', name: 'Hipotensión', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3-4', description: 'PA sistólica <90 mmHg o >30% del basal' },
  { code: 'MAN-604', name: 'Arritmia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '3-4', description: 'Irregularidad en el ritmo cardíaco' },
  { code: 'MAN-605', name: 'Palpitaciones', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sensación de latidos cardíacos rápidos o irregulares' },
  { code: 'MAN-606', name: 'Edema generalizada', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '2-3', description: 'Hinchazón generalizada (no localizada)' },
  { code: 'MAN-607', name: 'Cianosis', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Coloración azulada de piel/mucosas por hipoxia' },
  { code: 'MAN-608', name: 'Diaforesis', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sudoración profusa' },
  { code: 'MAN-609', name: 'Pérdida de consciencia', category: 'Cardiovascular', mechanism: 'IgE-mediada', severity: '4', description: 'Síncope, desmayo' },

  // ============ DIGESTIVA ============
  { code: 'MAN-701', name: 'Náusea', category: 'Digestiva', mechanism: 'IgE-mediada', severity: '1-2', description: 'Sensación de ganas de vomitar' },
  { code: 'MAN-702', name: 'Vómito', category: 'Digestiva', mechanism: 'IgE-mediada', severity: '2-3', description: 'Emesis, puede ser única o repetitiva' },
  { code: 'MAN-703', name: 'Diarrea', category: 'Digestiva', mechanism: 'Mixta', severity: '1-2', description: 'Heces sueltas, aumento en frecuencia' },
  { code: 'MAN-704', name: 'Dolor abdominal', category: 'Digestiva', mechanism: 'IgE-mediada', severity: '2', description: 'Dolor abdominal tipo cólico' },
  { code: 'MAN-705', name: 'Pirosis', category: 'Digestiva', mechanism: 'Mixta', severity: '1', description: 'Acidez estomacal, reflujo' },
  { code: 'MAN-706', name: 'Distensión abdominal', category: 'Digestiva', mechanism: 'Mixta', severity: '1-2', description: 'Hinchazón del abdomen' },
  { code: 'MAN-707', name: 'Esofagitis eosinofílica (EoE)', category: 'Digestiva', mechanism: 'Mixta', severity: '2-3', description: 'Disfagia, impactación alimentaria, dolor torácico' },
  { code: 'MAN-708', name: 'Enteritis alérgica', category: 'Digestiva', mechanism: 'No IgE', severity: '2', description: 'Diarrea mucosa, dolor abdominal' },
  { code: 'MAN-709', name: 'Colitis alérgica', category: 'Digestiva', mechanism: 'No IgE', severity: '1-2', description: 'Sangrado rectal, irritabilidad en lactantes' },
  { code: 'MAN-710', name: 'Gastritis alérgica', category: 'Digestiva', mechanism: 'Mixta', severity: '1-2', description: 'Dolor epigástrico, náusea, vómitos' },
  { code: 'MAN-711', name: 'Proctocolitis alérgica', category: 'Digestiva', mechanism: 'No IgE', severity: '1', description: 'Sangrado rectal leve en lactantes' },
  { code: 'MAN-712', name: 'Síndrome de enterocolitis (FPIES)', category: 'Digestiva', mechanism: 'No IgE (FPIES)', severity: '3-4', description: 'Vómitos severos 2-4h post-ingesta, palidez, letargia' },
  { code: 'MAN-713', name: 'Estreñimiento', category: 'Digestiva', mechanism: 'Mixta', severity: '1', description: 'Dificultad para defecar, heces duras' },

  // ============ CUTÁNEA ============
  { code: 'MAN-801', name: 'Urticaria aguda', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '2-3', description: 'Ronchas pruriginosas, eritematosas, transitorias (<6 semanas)' },
  { code: 'MAN-802', name: 'Urticaria crónica', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '2-3', description: 'Ronchas >6 semanas, recurrente' },
  { code: 'MAN-803', name: 'Angioedema', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '2-3', description: 'Hinchazón de labios, párpados, lengua' },
  { code: 'MAN-804', name: 'Prurito cutáneo generalizada', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Comezón en la piel sin lesiones visibles' },
  { code: 'MAN-805', name: 'Prurito localized', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '1', description: 'Comezón en zona específica' },
  { code: 'MAN-806', name: 'Eritema difuso', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Enrojecimiento generalizado de la piel' },
  { code: 'MAN-807', name: 'Flush', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '2-3', description: 'Enrojecimiento facial con prurito transitorio' },
  { code: 'MAN-808', name: 'Escalofríos', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '1-2', description: 'Piel de gallina, sensación de frío' },
  { code: 'MAN-809', name: 'Dermatitis atópica', category: 'Cutánea', mechanism: 'Mixta', severity: '1-2', description: 'Eccema crónico con prurito intenso' },
  { code: 'MAN-810', name: 'Dermatitis herpetiforme', category: 'Cutánea', mechanism: 'No IgE', severity: '1-2', description: 'Vesículas pruriginosas, asociada a enfermedad celíaca' },
  { code: 'MAN-811', name: 'Palidez', category: 'Cutánea', mechanism: 'IgE-mediada', severity: '2-3', description: 'Piel pálida, moteada' },
  { code: 'MAN-812', name: 'Eccema', category: 'Cutánea', mechanism: 'Mixta', severity: '1-2', description: ' Dermatitis eccematosa, piel seca, inflamada y con prurito' },

  // ============ ANAFILAXIA ============
  { code: 'MAN-901', name: 'Shock anafiláctico', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '4', description: 'Colapso cardiovascular con hipotensión refractaria' },
  { code: 'MAN-902', name: 'Anafilaxia generalizada', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '4', description: 'Reacción alérgica sistémica severa, multi-orgánica' },
  { code: 'MAN-903', name: 'Edema laríngeo', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '4', description: 'Obstrucción de vía aérea superior, riesgo vital' },
  { code: 'MAN-904', name: 'Estridor laríngeo', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '4', description: 'Ruido inspiratorio agudo, obstrucción de vía aérea' },
  { code: 'MAN-907', name: 'Asistolia', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '4', description: 'Paro cardíaco' },
  { code: 'MAN-908', name: 'Sensación de muerte inminente', category: 'Anafilaxia', mechanism: 'IgE-mediada', severity: '3-4', description: 'Presagio de fatalidad (aura anafiláctica)' },

  // ============ NEUROLÓGICO/GENERAL ============
  { code: 'MAN-1001', name: 'Cefalea', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '1-2', description: 'Dolor de cabeza' },
  { code: 'MAN-1002', name: 'Mareo', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '2-3', description: 'Sensación de vértigo, aturdimiento' },
  { code: 'MAN-1003', name: 'Confusión mental', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '3-4', description: 'Desorientación, alteración del estado mental' },
  { code: 'MAN-1004', name: 'Letargia', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '3', description: 'Decreased consciousness, somnolencia excesiva' },
  { code: 'MAN-1005', name: 'Inquietud/agitación', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '2', description: 'Ansiedad, agitación, sensación de opresión' },
  { code: 'MAN-1006', name: 'Astenia', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '2', description: 'Cansancio, debilidad generalizada' },
  { code: 'MAN-1007', name: 'Parestesias', category: 'Neurológico', mechanism: 'IgE-mediada', severity: '2', description: 'Sensación de hormigueo, adormecimiento o pinchazos' }
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

// Sistemas/Órganos
export const organSystems = [
  { code: 'Nasal', name: 'Nasal', icon: '👃', description: 'Síntomas nasales' },
  { code: 'Ocular', name: 'Ocular', icon: '👁️', description: 'Síntomas oculares' },
  { code: 'Ótica', name: 'Ótica', icon: '👂', description: 'Síntomas del oído' },
  { code: 'Faríngea', name: 'Faríngea', icon: '🗣️', description: 'Síntomas de la garganta' },
  { code: 'Vía aérea inferior', name: 'Vía aérea inferior', icon: '🫁', description: 'Síntomas pulmonares' },
  { code: 'Cardiovascular', name: 'Cardiovascular', icon: '❤️', description: 'Síntomas cardíacos' },
  { code: 'Digestiva', name: 'Digestiva', icon: '🫃', description: 'Síntomas gastrointestinales' },
  { code: 'Cutánea', name: 'Cutánea', icon: '🩹', description: 'Síntomas de la piel' },
  { code: 'Anafilaxia', name: 'Anafilaxia', icon: '⚠️', description: 'Reacciones anafilácticas' },
  { code: 'Neurológico', name: 'Neurológico', icon: '🧠', description: 'Síntomas neurológicos/sistémicos' }
]

export default clinicalManifestations
