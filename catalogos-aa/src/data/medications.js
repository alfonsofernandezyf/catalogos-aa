// Medicamentos esenciales para CMICA - Alergia e Inmunología Clínica
// Código ATC Nivel 5 - Sustancias individuales

export const atcGroups = {
  'R': { name: 'Sistema respiratorio', subgroups: {
    'R01': { name: 'Preparaciones nasales' },
    'R03': { name: 'Obstructivas vías respiratorias' },
    'R06': { name: 'Antihistamínicos sistémicos' }
  }},
  'D': { name: 'Dermatológicos', subgroups: {
    'D07': { name: 'Corticosteroides tópicos' },
    'D11': { name: 'Otros dermatológicos' }
  }},
  'H': { name: 'Hormonales sistémicos', subgroups: {
    'H02': { name: 'Corticosteroides sistémicos' }
  }},
  'L': { name: 'Antineoplásicos e inmunomoduladores', subgroups: {
    'L04': { name: 'Inmunosupresores' }
  }},
  'A': { name: 'Tracto alimentario', subgroups: {
    'A02': { name: 'Antiulcerosos' }
  }},
  'J': { name: 'Antiinfecciosos', subgroups: {
    'J01': { name: 'Antibacterianos' }
  }},
  'C': { name: 'Cardiovascular', subgroups: {
    'C01': { name: 'Terapia cardíaca' },
    'C07': { name: 'Betabloqueantes' },
    'C08': { name: 'Bloqueantes calcio' },
    'C09': { name: 'Agentes renina-angiotensina' }
  }},
  'M': { name: 'Musculoesquelético', subgroups: {
    'M01': { name: 'AINES' }
  }},
  'N': { name: 'Sistema nervioso', subgroups: {
    'N02': { name: 'Analgésicos' },
    'N03': { name: 'Antiepilépticos' },
    'N07': { name: 'Antivertigo' }
  }},
  'V': { name: 'Varios', subgroups: {
    'V01': { name: 'Alérgenos' }
  }}
}

export const medications = [
  // R06 - Antihistamínicos
  { atc_code: 'R06AA02', name: 'Difenidramina', route: 'Oral', indication: 'Alergias, urticaria' },
  { atc_code: 'R06AB02', name: 'Dexclorfeniramina', route: 'Oral', indication: 'Alergias, rinitis' },
  { atc_code: 'R06AB04', name: 'Clorfenamina', route: 'Oral', indication: 'Reacciones alérgicas' },
  { atc_code: 'R06AE07', name: 'Cetirizina', route: 'Oral', indication: 'Rinitis, urticaria' },
  { atc_code: 'R06AE09', name: 'Levocetirizina', route: 'Oral', indication: 'Alergias' },
  { atc_code: 'R06AX13', name: 'Loratadina', route: 'Oral', indication: 'Rinitis, urticaria' },
  { atc_code: 'R06AX19', name: 'Azelastina', route: 'Nasal', indication: 'Rinitis alérgica' },
  { atc_code: 'R06AX26', name: 'Fexofenadina', route: 'Oral', indication: 'Rinitis, urticaria' },
  { atc_code: 'R06AX27', name: 'Desloratadina', route: 'Oral', indication: 'Alergias' },
  { atc_code: 'R06AX28', name: 'Rupatadina', route: 'Oral', indication: 'Urticaria' },
  { atc_code: 'R06AX29', name: 'Bilastina', route: 'Oral', indication: 'Rinitis alérgica' },
  
  // R03 - Respiratorios
  { atc_code: 'R03AC02', name: 'Salbutamol', route: 'Inhalatoria', indication: 'Asma, broncoespasmo' },
  { atc_code: 'R03AC03', name: 'Terbutalina', route: 'Inhalatoria', indication: 'Asma, EPOC' },
  { atc_code: 'R03AC12', name: 'Salmeterol', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03AC13', name: 'Formoterol', route: 'Inhalatoria', indication: 'Asma, EPOC' },
  { atc_code: 'R03AC18', name: 'Indacaterol', route: 'Inhalatoria', indication: 'EPOC' },
  { atc_code: 'R03AK06', name: 'Salmeterol + Fluticasona', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03AK07', name: 'Budesonida + Formoterol', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03BA02', name: 'Budesonida', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03BA03', name: 'Fluticasona', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03BA04', name: 'Mometasona', route: 'Inhalatoria', indication: 'Asma' },
  { atc_code: 'R03BC01', name: 'Cromoglicato sodio', route: 'Inhalatoria', indication: 'Asma, alergias' },
  { atc_code: 'R03DA04', name: 'Teofilina', route: 'Oral', indication: 'Asma' },
  { atc_code: 'R03DC01', name: 'Montelukast', route: 'Oral', indication: 'Asma, rinitis' },
  { atc_code: 'R03DX01', name: 'Omalizumab', route: 'Inyectable', indication: 'Asma alérgica grave' },
  
  // R01 - Nasales
  { atc_code: 'R01AA05', name: 'Xilometazolina', route: 'Nasal', indication: 'Descongestivo nasal' },
  { atc_code: 'R01AB02', name: 'Budesonida nasal', route: 'Nasal', indication: 'Rinitis alérgica' },
  { atc_code: 'R01AB03', name: 'Fluticasona nasal', route: 'Nasal', indication: 'Rinitis alérgica' },
  { atc_code: 'R01AB04', name: 'Mometasona nasal', route: 'Nasal', indication: 'Rinitis alérgica' },
  { atc_code: 'R01AX03', name: 'Azelastina nasal', route: 'Nasal', indication: 'Rinitis alérgica' },
  
  // H02 - Corticosteroides sistémicos
  { atc_code: 'H02AB02', name: 'Dexametasona', route: 'Oral/Inyectable', indication: 'Inflamación, alergias' },
  { atc_code: 'H02AB04', name: 'Hidrocortisona', route: 'Oral/Inyectable', indication: 'Insuficiencia suprarrenal' },
  { atc_code: 'H02AB05', name: 'Metilprednisolona', route: 'Oral/Inyectable', indication: 'Inflamación' },
  { atc_code: 'H02AB06', name: 'Prednisolona', route: 'Oral', indication: 'Inflamación, alergias' },
  { atc_code: 'H02AB07', name: 'Prednisona', route: 'Oral', indication: 'Inflamación, alergias' },
  
  // D07 - Corticosteroides tópicos
  { atc_code: 'D07AA01', name: 'Hidrocortisona tópica', route: 'Tópica', indication: 'Dermatitis' },
  { atc_code: 'D07AB03', name: 'Triamcinolona tópica', route: 'Tópica', indication: 'Dermatitis' },
  { atc_code: 'D07AB06', name: 'Betametasona tópica', route: 'Tópica', indication: 'Dermatitis' },
  { atc_code: 'D07AC02', name: 'Clobetasol tópico', route: 'Tópica', indication: 'Psoriasis' },
  
  // D11AH - Inhibidores calcineurina tópicos
  { atc_code: 'D11AH01', name: 'Tacrolimus tópico', route: 'Tópica', indication: 'Dermatitis atópica' },
  { atc_code: 'D11AH02', name: 'Pimecrolimus', route: 'Tópica', indication: 'Dermatitis atópica' },
  
  // L04 - Inmunosupresores
  { atc_code: 'L04AA06', name: 'Micofenolato mofetilo', route: 'Oral', indication: 'Inmunosupresor' },
  { atc_code: 'L04AA24', name: 'Ciclosporina', route: 'Oral', indication: 'Psoriasis' },
  { atc_code: 'L04AA26', name: 'Azatioprina', route: 'Oral', indication: 'Inmunosupresor' },
  { atc_code: 'L04AA27', name: 'Metotrexato', route: 'Oral/Inyectable', indication: 'Artritis' },
  { atc_code: 'L04AA40', name: 'Tofacitinib', route: 'Oral', indication: 'Artritis reumatoide' },
  { atc_code: 'L04AB02', name: 'Infliximab', route: 'Inyectable', indication: 'Crohn, psoriasis' },
  { atc_code: 'L04AB03', name: 'Adalimumab', route: 'Inyectable', indication: 'Artritis, psoriasis' },
  { atc_code: 'L04AB05', name: 'Golimumab', route: 'Inyectable', indication: 'Artritis' },
  { atc_code: 'L04AB06', name: 'Rituximab', route: 'Inyectable', indication: 'Linfoma' },
  { atc_code: 'L04AC03', name: 'Ustekinumab', route: 'Inyectable', indication: 'Psoriasis' },
  { atc_code: 'L04AC05', name: 'Tocilizumab', route: 'Inyectable', indication: 'Artritis' },
  { atc_code: 'L04AC06', name: 'Secukinumab', route: 'Inyectable', indication: 'Psoriasis' },
  { atc_code: 'L04AC13', name: 'Omalizumab', route: 'Inyectable', indication: 'Asma, urticaria' },
  { atc_code: 'L04AC14', name: 'Mepolizumab', route: 'Inyectable', indication: 'Asma eosinofílica' },
  { atc_code: 'L04AC16', name: 'Benralizumab', route: 'Inyectable', indication: 'Asma eosinofílica' },
  { atc_code: 'L04AC17', name: 'Dupilumab', route: 'Inyectable', indication: 'Dermatitis atópica' },
  
  // A02 - Antiulcerosos
  { atc_code: 'A02BA03', name: 'Famotidina', route: 'Oral', indication: 'Antiulceroso' },
  { atc_code: 'A02BC01', name: 'Omeprazol', route: 'Oral', indication: 'Antiulceroso' },
  { atc_code: 'A02BC02', name: 'Pantoprazol', route: 'Oral', indication: 'Antiulceroso' },
  { atc_code: 'A02BC03', name: 'Lansoprazol', route: 'Oral', indication: 'Antiulceroso' },
  { atc_code: 'A02BC05', name: 'Esomeprazol', route: 'Oral', indication: 'Antiulceroso' },
  
  // J01 - Antibióticos
  { atc_code: 'J01AA02', name: 'Doxiciclina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01CA04', name: 'Amoxicilina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01CR02', name: 'Amoxicilina + Clavulanato', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01DB03', name: 'Cefazolina', route: 'Inyectable', indication: 'Antibiótico' },
  { atc_code: 'J01DC02', name: 'Cefuroxima', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01DD02', name: 'Ceftriaxona', route: 'Inyectable', indication: 'Antibiótico' },
  { atc_code: 'J01FA01', name: 'Eritromicina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01FA09', name: 'Claritromicina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01FA10', name: 'Azitromicina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01FF01', name: 'Clindamicina', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01MA02', name: 'Ciprofloxacino', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01MA12', name: 'Levofloxacino', route: 'Oral', indication: 'Antibiótico' },
  { atc_code: 'J01EE01', name: 'Sulfametoxazol + Trimetoprim', route: 'Oral', indication: 'Antibiótico' },
  
  // C - Cardiovasculares
  { atc_code: 'C01AA01', name: 'Digoxina', route: 'Oral', indication: 'Insuficiencia cardíaca' },
  { atc_code: 'C01BC04', name: 'Verapamilo', route: 'Oral', indication: 'Antiarrítmico' },
  { atc_code: 'C01BD01', name: 'Amiodarona', route: 'Oral', indication: 'Antiarrítmico' },
  { atc_code: 'C07AA01', name: 'Propranolol', route: 'Oral', indication: 'Betabloqueante' },
  { atc_code: 'C07AB01', name: 'Metoprolol', route: 'Oral', indication: 'Betabloqueante' },
  { atc_code: 'C07AB02', name: 'Atenolol', route: 'Oral', indication: 'Betabloqueante' },
  { atc_code: 'C07AB04', name: 'Bisoprolol', route: 'Oral', indication: 'Betabloqueante' },
  { atc_code: 'C08CA01', name: 'Nifedipino', route: 'Oral', indication: 'Bloqueante calcio' },
  { atc_code: 'C08CA03', name: 'Amlodipino', route: 'Oral', indication: 'Bloqueante calcio' },
  { atc_code: 'C09AA02', name: 'Enalapril', route: 'Oral', indication: 'Inhibidor ECA' },
  { atc_code: 'C09AA03', name: 'Lisinopril', route: 'Oral', indication: 'Inhibidor ECA' },
  { atc_code: 'C09CA01', name: 'Losartán', route: 'Oral', indication: 'ARA II' },
  { atc_code: 'C09CA06', name: 'Candesartán', route: 'Oral', indication: 'ARA II' },
  
  // M01 - AINES
  { atc_code: 'M01AB03', name: 'Diclofenaco', route: 'Oral', indication: 'AINES' },
  { atc_code: 'M01AE01', name: 'Ibuprofeno', route: 'Oral', indication: 'AINES' },
  { atc_code: 'M01AE02', name: 'Naproxeno', route: 'Oral', indication: 'AINES' },
  { atc_code: 'M01AH01', name: 'Celecoxib', route: 'Oral', indication: 'Inhibidor COX-2' },
  { atc_code: 'M01AH05', name: 'Etoricoxib', route: 'Oral', indication: 'Inhibidor COX-2' },
  
  // N - Neurológicos
  { atc_code: 'N02AA03', name: 'Codeína', route: 'Oral', indication: 'Analgésico opioide' },
  { atc_code: 'N02AX02', name: 'Tramadol', route: 'Oral', indication: 'Analgésico' },
  { atc_code: 'N02BA01', name: 'Ácido acetilsalicílico', route: 'Oral', indication: 'AINE, antiagregante' },
  { atc_code: 'N02BE01', name: 'Paracetamol', route: 'Oral', indication: 'Analgésico' },
  { atc_code: 'N03AA01', name: 'Fenobarbital', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AB01', name: 'Fenitoína', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AF01', name: 'Carbamazepina', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AG01', name: 'Ácido valproico', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AX09', name: 'Lamotrigina', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AX12', name: 'Gabapentina', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AX14', name: 'Levetiracetam', route: 'Oral', indication: 'Antiepiléptico' },
  { atc_code: 'N03AX16', name: 'Pregabalina', route: 'Oral', indication: 'Neuropático' },
  { atc_code: 'N05BA04', name: 'Diazepam', route: 'Oral', indication: 'Ansiolítico' },
  { atc_code: 'N07CA01', name: 'Betahistina', route: 'Oral', indication: 'Antivertigo' },
  
  // V01 - Alérgenos
  { atc_code: 'V01AA02', name: 'Extracto polen gramíneas', route: 'Cutánea', indication: 'Diagnóstico' },
  { atc_code: 'V01AA05', name: 'Extracto ácaros polvo', route: 'Cutánea', indication: 'Diagnóstico' },
  { atc_code: 'V01AA06', name: 'Extracto epitelio animales', route: 'Cutánea', indication: 'Diagnóstico' },
  
  // Emergencia
  { atc_code: 'C01CA24', name: 'Epinefrina', route: 'Intramuscular', indication: 'Anafilaxia' }
]

export default medications
