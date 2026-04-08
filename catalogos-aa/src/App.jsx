import { useState, useMemo, useRef, useEffect } from 'react'
import { medications, atcGroups } from './data/medications'
import { clinicalManifestations, severityGrades, mechanisms } from './data/clinicalManifestations'
import { foodAllergens, foodGroups, severityLevels } from './data/foodAllergens'
import Papa from 'papaparse'
import './index.css'
import {
  LS_USER,
  LS_FAVORITES,
  lsSelectionsKey,
  safeGetItem,
  safeSetItem,
  loadJsonArray,
  loadFavoritesInitial,
  getOrCreateUserKey,
  loadCustomCatalogItems,
  saveCustomCatalogItems,
} from './lib/persistLocal'
import {
  isSupabaseConfigured,
  getSupabaseConfigurationIssue,
  fetchContributionsForCatalog,
  indexContributionsByItemId,
  upsertContribution,
  deleteContribution,
} from './lib/supabase'

/** Logo en `public/logo_cientifica.svg` (sirve con base relativa en build) */
const HEADER_LOGO_SRC = `${import.meta.env.BASE_URL}logo_cientifica.svg`

console.log('[cientifi.ca] App loading, medications:', typeof medications !== 'undefined' ? medications.length : 'undefined')

// SVG Icons
const MedIcon = () => <span style={{fontSize: '1.25rem'}}>💊</span>
const BodyIcon = () => <span style={{fontSize: '1.25rem'}}>🩺</span>
const FoodIcon = () => <span style={{fontSize: '1.25rem'}}>🥜</span>
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/** Incluye niveles del dataset (p. ej. Variable) además de la escala estándar */
const ALLERGEN_CUSTOM_SEVERITY_OPTIONS = [
  ...severityLevels,
  { level: 'Variable', description: 'Variabilidad individual o cuadros no típicos' },
]
const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const TeamNotesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="15" y2="10"/>
  </svg>
)

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const SortIcon = ({ direction, active }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={active ? "currentColor" : "currentColor"} strokeWidth="2" opacity={active ? 1 : 0.3}>
    {direction === 'asc' || !active ? (
      <path d="M12 5v14M5 12l7-7 7 7"/>
    ) : (
      <path d="M12 19V5M5 12l7 7 7-7"/>
    )}
  </svg>
)
const FilterIcon = ({ active }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={active ? 1 : 0.4}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

// Mobile Card View Component
const ChevronIcon = ({ expanded }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const CatalogCard = ({
  item,
  idField,
  isSelected,
  isFavorite,
  onToggleSelect,
  onToggleFavorite,
  onOpenNoteModal,
  hasNote,
  contribBadges,
  teamNotes,
  getSeverityClass,
  fields,
  isSupabaseConfigured,
  onRemoveNote,
  syncBusy,
  onRemoveCustom,
  getMyRowForItem,
}) => {
  const [expanded, setExpanded] = useState(false)

  const id = item[idField]
  const name = item.name || item.name
  const route = item.route
  const indication = item.indication
  const severity = item.severity
  const code = item[idField]

  // Get main fields for header
  const codeField = fields.find(f => f.key === 'code' || f.key === 'atc_code')
  const titleField = fields.find(f => f.key === 'name')
  const routeField = fields.find(f => f.key === 'route')
  const indicationField = fields.find(f => f.key === 'indication')
  const severityField = fields.find(f => f.key === 'severity')
  const categoryField = fields.find(f => f.key === 'category')
  const mechanismField = fields.find(f => f.key === 'mechanism')
  const scientificField = fields.find(f => f.key === 'scientificName')

  const hasTeamNotes = teamNotes && teamNotes.length > 0

  return (
    <div className={`catalog-card ${isSelected ? 'selected' : ''}`}>
      {/* Card Header - always visible */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-name">{name}</div>
          <div className="card-code">{codeField?.label}: {code}</div>
          {item.route && (
            <span className="card-route">{item.route}</span>
          )}
          {item.severity && (
            <span className={`card-severity ${getSeverityClass(item.severity)}`}>
              {item.severity}
            </span>
          )}
        </div>
        <div className="card-header-right">
          {/* Custom badge */}
          {item._custom && (
            <span className="custom-catalog-badge" title="Añadido por ti">Tú</span>
          )}
          {/* Expand button */}
          <button
            className={`card-expand-btn ${expanded ? 'expanded' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Colapsar detalles' : 'Ver más detalles'}
          >
            <ChevronIcon expanded={expanded} />
          </button>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <div className="card-action-left">
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => onToggleFavorite(id, e)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <StarIcon filled={isFavorite} />
          </button>
          {item._custom && (
            <button
              className="btn-remove-custom"
              onClick={() => onRemoveCustom(id)}
              title="Quitar del catálogo"
              style={{ width: 36, height: 36 }}
            >
              ✕
            </button>
          )}
        </div>
        <div className="card-action-right">
          {isSupabaseConfigured() && contribBadges && contribBadges.length > 0 && (
            <div className="card-contrib-badges">
              {contribBadges.slice(0, 2).map((badge, i) => (
                <span key={i} className="card-contrib-badge">{badge}</span>
              ))}
              {contribBadges.length > 2 && (
                <span className="card-contrib-badge">+{contribBadges.length - 2}</span>
              )}
            </div>
          )}
          <button
            className={`card-select-btn ${isSelected ? 'is-selected' : 'not-selected'}`}
            onClick={() => onToggleSelect(id)}
          >
            {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={`card-details ${expanded ? 'expanded' : ''}`}>
        <div className="card-details-inner">
          {/* Additional fields */}
          {fields.filter(f =>
            f.key !== 'code' &&
            f.key !== 'atc_code' &&
            f.key !== 'name' &&
            f.key !== 'route' &&
            f.key !== 'indication' &&
            f.key !== 'severity'
          ).map(field => (
            <div key={field.key} className="card-detail-row">
              <span className="card-detail-label">{field.label}</span>
              <span className="card-detail-value">
                {field.key === 'mechanism' ? (
                  <span className="mechanism-badge">{item[field.key]}</span>
                ) : field.key === 'category' ? (
                  <span className="category-badge">{item[field.key]}</span>
                ) : field.key === 'scientificName' ? (
                  <em style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{item[field.key] || '—'}</em>
                ) : (
                  item[field.key] || '—'
                )}
              </span>
            </div>
          ))}

          {/* Team Notes */}
          {isSupabaseConfigured() && hasTeamNotes && (
            <div className="card-team-notes">
              <div className="card-team-notes-title">Notas del equipo</div>
              {teamNotes.map((note, i) => (
                <div key={i} className="card-team-note">
                  <span className="card-team-note-author">{note.author}: </span>
                  {note.text}
                </div>
              ))}
            </div>
          )}

          {/* Add Note Button */}
          {isSupabaseConfigured() && (
            <button
              className="card-note-btn"
              onClick={() => onOpenNoteModal(id)}
            >
              {hasNote ? '✏️ Editar mi nota' : '+ Añadir nota'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
const ColumnFilterDropdown = ({ fieldKey, values, currentValue, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])
  
  return (
    <div className="column-filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-dropdown-btn ${currentValue ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
        title="Filtrar por esta columna"
      >
        <FilterIcon active={!!currentValue} />
      </button>
      {isOpen && (
        <div className="filter-dropdown-menu" onClick={(e) => e.stopPropagation()}>
          <div className="filter-dropdown-header">
            <span>Filtrar: {fieldKey}</span>
            {currentValue && (
              <button className="clear-filter" onClick={() => { onFilterChange(''); setIsOpen(false) }}>
                Limpiar
              </button>
            )}
          </div>
          <div className="filter-options">
            <label className="filter-option">
              <input type="radio" checked={!currentValue} onChange={() => { onFilterChange(''); setIsOpen(false) }} />
              <span>Todos</span>
            </label>
            {values.slice(0, 50).map(val => (
              <label key={val} className="filter-option">
                <input 
                  type="radio" 
                  checked={currentValue === val} 
                  onChange={() => { onFilterChange(val); setIsOpen(false) }} 
                />
                <span>{val}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Inline Team Notes Component
const TeamNotesCell = ({ notes, onAddNote, onRemoveNote, isMine, syncBusy }) => {
  const [expanded, setExpanded] = useState(false)

  if (!notes || notes.length === 0) {
    return (
      <button
        type="button"
        className="btn btn-xs btn-ghost"
        onClick={onAddNote}
        title="Añadir nota"
      >
        <NoteIcon />
      </button>
    )
  }

  return (
    <div className="team-notes-inline">
      <button
        type="button"
        className={`team-notes-toggle ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
        title={expanded ? 'Ocultar notas' : `${notes.length} nota(s)`}
      >
        <TeamNotesIcon />
        <span className="team-notes-count">{notes.length}</span>
      </button>
      {expanded && (
        <div className="team-notes-dropdown">
          {notes.map((note, i) => (
            <div key={i} className="team-note-item">
              <div className="team-note-header">
                <span className="team-note-author">{note.author}</span>
                {note.isMine && (
                  <button
                    type="button"
                    className="btn-note-remove-small"
                    onClick={() => onRemoveNote()}
                    disabled={syncBusy}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="team-note-text">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Row Actions Component
const RowActions = ({
  itemId,
  isFavorite,
  hasNote,
  onToggleFavorite,
  onOpenNoteModal,
  onRemoveCustom,
  isCustom,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="row-actions" ref={menuRef}>
      {/* Favorite - direct toggle */}
      <button
        className={`action-btn favorite-action ${isFavorite ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <StarIcon filled={isFavorite} />
      </button>

      {/* Note - direct action */}
      <button
        className={`action-btn note-action ${hasNote ? 'has-note' : ''}`}
        onClick={(e) => { e.stopPropagation(); onOpenNoteModal() }}
        title={hasNote ? 'Editar mi nota' : 'Añadir nota'}
      >
        <NoteIcon />
      </button>

      {/* More menu */}
      <div className="action-menu-wrapper">
        <button
          className={`action-btn more-action ${menuOpen ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          title="Más opciones"
        >
          <MoreIcon />
        </button>
        {menuOpen && (
          <div className="action-menu" onClick={(e) => e.stopPropagation()}>
            {isCustom && (
              <button
                className="action-menu-item danger"
                onClick={() => { onRemoveCustom(); setMenuOpen(false) }}
              >
                <span>✕</span> Quitar del catálogo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Catálogos disponibles
const catalogs = [
  { 
    id: 'medications', 
    name: 'Medicamentos ATC', 
    icon: <MedIcon />,
    description: 'Catálogo de medicamentos por código ATC nivel 5'
  },
  { 
    id: 'manifestations', 
    name: 'Manifestaciones Clínicas', 
    icon: <BodyIcon />,
    description: 'Signos y síntomas de reacciones alérgicas'
  },
  { 
    id: 'allergens', 
    name: 'Alérgenos Alimentarios', 
    icon: <FoodIcon />,
    description: 'Alimentos causantes de alergia (México)'
  }
]

// Campos por catálogo
const catalogFields = {
  medications: [
    { key: 'name', label: 'Sustancia' },
    { key: 'atc_code', label: 'Código ATC' },
    { key: 'route', label: 'Vía' },
    { key: 'indication', label: 'Indicación' }
  ],
  manifestations: [
    { key: 'name', label: 'Manifestación' },
    { key: 'code', label: 'Código' },
    { key: 'category', label: 'Sistema' },
    { key: 'mechanism', label: 'Mecanismo' },
    { key: 'severity', label: 'Severidad' },
    { key: 'description', label: 'Descripción' }
  ],
  allergens: [
    { key: 'name', label: 'Alimento' },
    { key: 'code', label: 'Código' },
    { key: 'scientificName', label: 'Nombre Científico' },
    { key: 'group', label: 'Grupo' },
    { key: 'severity', label: 'Riesgo' },
    { key: 'description', label: 'Descripción' }
  ]
}

function App() {
  // Estado general (hidratar desde localStorage)
  const [currentCatalog, setCurrentCatalog] = useState('medications')
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(loadJsonArray(lsSelectionsKey('medications'))),
  )
  const [favorites, setFavorites] = useState(() => loadFavoritesInitial())
  const [userName, setUserName] = useState(() => safeGetItem(LS_USER) || '')

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /** Ítems añadidos manualmente (por catálogo), persistidos en localStorage */
  const [customCatalog, setCustomCatalog] = useState(() => loadCustomCatalogItems())
  const [showAddCustomModal, setShowAddCustomModal] = useState(false)
  const [addCustomForm, setAddCustomForm] = useState({})

  useEffect(() => {
    saveCustomCatalogItems(customCatalog)
  }, [customCatalog])

  // Persistir selecciones del catálogo activo
  useEffect(() => {
    safeSetItem(lsSelectionsKey(currentCatalog), JSON.stringify([...selectedIds]))
  }, [selectedIds, currentCatalog])

  // Persistir nombre
  useEffect(() => {
    safeSetItem(LS_USER, userName)
  }, [userName])
  
  // Filtros
  const [filter1, setFilter1] = useState('')
  const [filter2, setFilter2] = useState('')
  const [filter3, setFilter3] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  
  // Column sorting
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Column filters (Google Sheets-like)
  const [columnFilters, setColumnFilters] = useState({})
  
  // Modals
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('json')
  const [exportPreview, setExportPreview] = useState('')
  const [exportAll, setExportAll] = useState(false)

  /** Si la imagen del header falla (red, CORS, 404), mostrar h1 en su lugar */
  const [headerLogoFailed, setHeaderLogoFailed] = useState(false)

  const [syncBusy, setSyncBusy] = useState(false)
  /** Filas de `catalogos_aa_contributions` para el catálogo activo */
  const [contributionRows, setContributionRows] = useState([])
  const [showNameGate, setShowNameGate] = useState(false)
  const [nameGateDraft, setNameGateDraft] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteItemId, setNoteItemId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const pendingActionRef = useRef(null)

  const fileInputRef = useRef(null)
  const supabaseConfigIssue = getSupabaseConfigurationIssue()
  const myUserKey = useMemo(() => getOrCreateUserKey(), [])

  const contributionsByItem = useMemo(
    () => indexContributionsByItemId(contributionRows),
    [contributionRows]
  )
  
  const catalogData = useMemo(() => {
    const custom = customCatalog[currentCatalog] || []
    switch (currentCatalog) {
      case 'medications':
        return [...medications, ...custom]
      case 'manifestations':
        return [...clinicalManifestations, ...custom]
      case 'allergens':
        return [...foodAllergens, ...custom]
      default:
        return []
    }
  }, [currentCatalog, customCatalog])
  
  const getIdField = () => {
    switch(currentCatalog) {
      case 'medications': return 'atc_code'
      case 'manifestations': return 'code'
      case 'allergens': return 'code'
      default: return 'code'
    }
  }
  
  // Obtener opciones de filtros dinámicos
  const getFilterOptions = () => {
    const data = catalogData
    const idField = getIdField()
    
    switch(currentCatalog) {
      case 'medications':
        return {
          options1: Object.entries(atcGroups).map(([code, g]) => ({ code, name: g.name })),
          label1: 'Grupo ATC',
          options2: filter1 ? Object.entries(atcGroups[filter1]?.subgroups || {}).map(([code, g]) => ({ code, name: g.name })) : [],
          label2: 'Subgrupo'
        }
      case 'manifestations':
        return {
          options1: [...new Set(data.map(m => m.category))].sort().map(c => ({ code: c, name: c })),
          label1: 'Sistema/Órgano',
          options2: filter1 ? [...new Set(data.filter(m => m.category === filter1).map(m => m.mechanism))].sort().map(c => ({ code: c, name: c })) : [],
          label2: 'Mecanismo'
        }
      case 'allergens':
        return {
          options1: Object.entries(foodGroups).map(([code, g]) => ({ code, name: g.name })),
          label1: 'Grupo Alimentario',
          options2: severityLevels.map(s => ({ code: s.level, name: `${s.level} (${s.description.substring(0, 30)}...)` })),
          label2: 'Nivel de Riesgo'
        }
      default:
        return { options1: [], label1: 'Filtro 1', options2: [], label2: 'Filtro 2' }
    }
  }
  
  const filterOptions = getFilterOptions()
  
  // Obtener valores únicos para filtro de columna
  const getColumnUniqueValues = (fieldKey) => {
    const data = catalogData
    const values = [...new Set(data.map(item => item[fieldKey]).filter(Boolean))]
    return values.sort()
  }
  
  // Manejador de ordenamiento
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  // Toggle column filter dropdown
  const toggleColumnFilter = (column, e) => {
    e.stopPropagation()
    // This will be handled by the dropdown visibility state
  }
  
  // Filtrar y ordenar datos
  const filteredData = useMemo(() => {
    const data = catalogData
    const idField = getIdField()
    
    let result = data.filter(item => {
      // Filtro por nombre
      if (filterName && !item.name.toLowerCase().includes(filterName.toLowerCase())) return false
      
      // Filtros específicos por catálogo
      if (currentCatalog === 'medications') {
        if (filter1 && !item._custom && !item.atc_code.startsWith(filter1)) return false
        if (filter2 && !item._custom) {
          const code2 = item.atc_code.substring(0, 4)
          if (code2 !== filter2 && !item.atc_code.startsWith(filter2)) return false
        }
      } else if (currentCatalog === 'manifestations') {
        if (filter1 && item.category !== filter1) return false
        if (filter2 && item.mechanism !== filter2) return false
      } else if (currentCatalog === 'allergens') {
        if (filter1 && item.group !== filter1) return false
        if (filter2 && item.severity !== filter2) return false
      }

      // Favoritos
      if (showFavoritesOnly && !favorites.has(item[idField])) return false
      
      // Solo seleccionados
      if (showSelectedOnly && !selectedIds.has(item[idField])) return false
      
      return true
    })
    
    // Apply column filters
    result = result.filter(item => {
      return Object.entries(columnFilters).every(([col, value]) => {
        if (!value) return true
        return item[col] === value
      })
    })
    
    // Apply sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn] || ''
        const bVal = b[sortColumn] || ''
        const comparison = String(aVal).localeCompare(String(bVal), 'es', { numeric: true })
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }
    
    return result
  }, [catalogData, currentCatalog, filter1, filter2, filterName, showFavoritesOnly, showSelectedOnly, selectedIds, favorites, columnFilters, sortColumn, sortDirection])

  const refreshContributions = async () => {
    if (!isSupabaseConfigured()) return
    setSyncBusy(true)
    try {
      const rows = await fetchContributionsForCatalog(currentCatalog)
      setContributionRows(rows)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const r of rows) {
          if (r.user_key === myUserKey && r.selected) next.add(r.item_id)
        }
        return next
      })
    } finally {
      setSyncBusy(false)
    }
  }

  useEffect(() => {
    if (isSupabaseConfigured()) {
      void refreshContributions()
    } else {
      setContributionRows([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar catálogo / nube
  }, [currentCatalog])

  const getMyRowForItem = (itemId) => {
    return (contributionsByItem.get(itemId) || []).find((r) => r.user_key === myUserKey)
  }

  const withNameGate = (action) => {
    if (!isSupabaseConfigured()) {
      action()
      return
    }
    if (!userName.trim()) {
      pendingActionRef.current = action
      setNameGateDraft('')
      setShowNameGate(true)
      return
    }
    action()
  }

  const confirmNameGate = async () => {
    const n = nameGateDraft.trim()
    if (!n) {
      alert('Escribe tu nombre para participar en la lista colaborativa.')
      return
    }
    setUserName(n)
    setShowNameGate(false)
    const fn = pendingActionRef.current
    pendingActionRef.current = null
    if (fn) await fn()
  }

  const runCloudToggle = async (id) => {
    const idField = getIdField()
    const willSelect = !selectedIds.has(id)
    const name = userName.trim()
    const row = getMyRowForItem(id)
    const existingNote = row?.note ? String(row.note) : ''

    setSelectedIds((prev) => {
      const n = new Set(prev)
      if (willSelect) n.add(id)
      else n.delete(id)
      return n
    })

    if (willSelect) {
      const { error } = await upsertContribution({
        catalog: currentCatalog,
        item_id: id,
        user_key: myUserKey,
        display_name: name,
        selected: true,
        note: existingNote || null,
      })
      if (error) alert(error.message || 'No se pudo guardar la selección.')
    } else {
      if (existingNote.trim()) {
        const { error } = await upsertContribution({
          catalog: currentCatalog,
          item_id: id,
          user_key: myUserKey,
          display_name: name,
          selected: false,
          note: existingNote,
        })
        if (error) alert(error.message || 'No se pudo actualizar.')
      } else {
        const { error } = await deleteContribution(currentCatalog, id, myUserKey)
        if (error) alert(error.message || 'No se pudo quitar la aportación.')
      }
    }
    await refreshContributions()
  }

  const handleToggleSelect = (id) => {
    if (!isSupabaseConfigured()) {
      setSelectedIds((prev) => {
        const n = new Set(prev)
        if (n.has(id)) n.delete(id)
        else n.add(id)
        return n
      })
      return
    }
    withNameGate(() => void runCloudToggle(id))
  }

  const runCloudSelectAll = async (allFilteredSelected) => {
    const idField = getIdField()
    const ids = filteredData.map((m) => m[idField])
    const name = userName.trim()

    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const n = new Set(prev)
        for (const id of ids) n.delete(id)
        return n
      })
      for (const id of ids) {
        const row = (contributionsByItem.get(id) || []).find((r) => r.user_key === myUserKey)
        const note = row?.note ? String(row.note) : ''
        if (note.trim()) {
          await upsertContribution({
            catalog: currentCatalog,
            item_id: id,
            user_key: myUserKey,
            display_name: name,
            selected: false,
            note,
          })
        } else {
          await deleteContribution(currentCatalog, id, myUserKey)
        }
      }
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev)
        for (const id of ids) n.add(id)
        return n
      })
      for (const id of ids) {
        const row = (contributionsByItem.get(id) || []).find((r) => r.user_key === myUserKey)
        const existingNote = row?.note ? String(row.note) : ''
        await upsertContribution({
          catalog: currentCatalog,
          item_id: id,
          user_key: myUserKey,
          display_name: name,
          selected: true,
          note: existingNote || null,
        })
      }
    }
    await refreshContributions()
  }

  const handleSelectAll = () => {
    const idField = getIdField()
    const allFilteredSelected =
      filteredData.length > 0 &&
      filteredData.every((item) => selectedIds.has(item[idField]))

    if (!isSupabaseConfigured()) {
      if (selectedIds.size === filteredData.length) {
        setSelectedIds(new Set())
      } else {
        setSelectedIds(new Set(filteredData.map((m) => m[idField])))
      }
      return
    }
    withNameGate(() => void runCloudSelectAll(allFilteredSelected))
  }
  
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
    safeSetItem(LS_FAVORITES, JSON.stringify([...newFavorites]))
  }

  const switchCatalog = (newId) => {
    if (newId === currentCatalog) return
    safeSetItem(lsSelectionsKey(currentCatalog), JSON.stringify([...selectedIds]))
    setCurrentCatalog(newId)
    setSelectedIds(new Set(loadJsonArray(lsSelectionsKey(newId))))
    setFilter1('')
    setFilter2('')
    setFilterName('')
  }

  const runClearSelectionCloud = async () => {
    setSelectedIds(new Set())
    const name = userName.trim()
    const mine = contributionRows.filter(
      (r) => r.user_key === myUserKey && r.catalog === currentCatalog && r.selected
    )
    for (const r of mine) {
      const note = r.note ? String(r.note) : ''
      if (note.trim()) {
        await upsertContribution({
          catalog: currentCatalog,
          item_id: r.item_id,
          user_key: myUserKey,
          display_name: name,
          selected: false,
          note,
        })
      } else {
        await deleteContribution(currentCatalog, r.item_id, myUserKey)
      }
    }
    await refreshContributions()
  }

  const clearSelection = () => {
    if (!isSupabaseConfigured()) {
      setSelectedIds(new Set())
      return
    }
    withNameGate(() => void runClearSelectionCloud())
  }

  const openNoteModal = (itemId) => {
    const row = getMyRowForItem(itemId)
    withNameGate(() => {
      setNoteItemId(itemId)
      setNoteDraft(row?.note ? String(row.note) : '')
      setShowNoteModal(true)
    })
  }

  const saveNoteFromModal = async () => {
    if (noteItemId == null || !isSupabaseConfigured()) return
    const name = userName.trim()
    const text = noteDraft.trim()
    const selected = selectedIds.has(noteItemId)

    if (!text && !selected) {
      const { error } = await deleteContribution(currentCatalog, noteItemId, myUserKey)
      if (error) alert(error.message || 'No se pudo borrar la nota.')
    } else {
      const { error } = await upsertContribution({
        catalog: currentCatalog,
        item_id: noteItemId,
        user_key: myUserKey,
        display_name: name,
        selected,
        note: text || null,
      })
      if (error) alert(error.message || 'No se pudo guardar la nota.')
    }
    setShowNoteModal(false)
    setNoteItemId(null)
    await refreshContributions()
  }

  /** Quita solo la nota de este usuario en el ítem (mantiene la marca si la hay). */
  const performRemoveMyNote = async (itemId) => {
    if (!isSupabaseConfigured()) return
    setSyncBusy(true)
    try {
      const name = userName.trim()
      const selected = selectedIds.has(itemId)
      if (selected) {
        const { error } = await upsertContribution({
          catalog: currentCatalog,
          item_id: itemId,
          user_key: myUserKey,
          display_name: name,
          selected: true,
          note: null,
        })
        if (error) alert(error.message || 'No se pudo quitar la nota.')
      } else {
        const { error } = await deleteContribution(currentCatalog, itemId, myUserKey)
        if (error) alert(error.message || 'No se pudo quitar la nota.')
      }
      await refreshContributions()
    } finally {
      setSyncBusy(false)
    }
  }

  const removeMyNoteForItem = (itemId) => {
    withNameGate(() => void performRemoveMyNote(itemId))
  }

  const removeMyNoteFromModal = async () => {
    if (noteItemId == null) return
    await performRemoveMyNote(noteItemId)
    setShowNoteModal(false)
    setNoteItemId(null)
    setNoteDraft('')
  }

  const collaboratorLabel = (r) => {
    const n = r.display_name != null ? String(r.display_name).trim() : ''
    return n || 'Colaborador'
  }

  const initAddCustomForm = () => {
    switch (currentCatalog) {
      case 'medications':
        return { name: '', route: 'Oral', indication: '' }
      case 'manifestations':
        return { name: '', category: '', mechanism: 'IgE-mediada', severity: '1-2', description: '' }
      case 'allergens':
        return { name: '', scientificName: '', group: 'OTROS', severity: 'Variable', description: '' }
      default:
        return {}
    }
  }

  const openAddCustomModal = () => {
    setAddCustomForm(initAddCustomForm())
    setShowAddCustomModal(true)
  }

  const submitAddCustom = (e) => {
    e.preventDefault()
    const uuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 14)
        : `${Date.now()}`
    let row = { _custom: true }
    if (currentCatalog === 'medications') {
      if (!addCustomForm.name?.trim()) {
        alert('Indica al menos el nombre del medicamento.')
        return
      }
      row = {
        ...row,
        atc_code: `USR-${uuid}`,
        name: addCustomForm.name.trim(),
        route: addCustomForm.route?.trim() || '—',
        indication: addCustomForm.indication?.trim() || '—',
      }
    } else if (currentCatalog === 'manifestations') {
      if (!addCustomForm.name?.trim()) {
        alert('Indica al menos el nombre de la manifestación.')
        return
      }
      row = {
        ...row,
        code: `MAN-U-${uuid}`,
        name: addCustomForm.name.trim(),
        category: addCustomForm.category?.trim() || 'Otro',
        mechanism: addCustomForm.mechanism?.trim() || '—',
        severity: addCustomForm.severity?.trim() || '1-2',
        description: addCustomForm.description?.trim() || '—',
      }
    } else {
      if (!addCustomForm.name?.trim()) {
        alert('Indica al menos el nombre del alérgeno.')
        return
      }
      row = {
        ...row,
        code: `ALG-U-${uuid}`,
        name: addCustomForm.name.trim(),
        scientificName: addCustomForm.scientificName?.trim() || null,
        group: addCustomForm.group || 'OTROS',
        severity: addCustomForm.severity?.trim() || 'Variable',
        description: addCustomForm.description?.trim() || '—',
      }
    }
    setCustomCatalog((prev) => ({
      ...prev,
      [currentCatalog]: [...(prev[currentCatalog] || []), row],
    }))
    setShowAddCustomModal(false)
  }

  const removeCustomFromCatalog = (itemId) => {
    if (
      !confirm(
        '¿Quitar este ítem del catálogo local? Se eliminarán también su selección y favoritos en este navegador.',
      )
    ) {
      return
    }
    const idField = getIdField()
    setCustomCatalog((prev) => ({
      ...prev,
      [currentCatalog]: (prev[currentCatalog] || []).filter((x) => x[idField] !== itemId),
    }))
    setSelectedIds((prev) => {
      const n = new Set(prev)
      n.delete(itemId)
      return n
    })
    setFavorites((prev) => {
      const n = new Set(prev)
      n.delete(itemId)
      safeSetItem(LS_FAVORITES, JSON.stringify([...n]))
      return n
    })
  }

  const handleExport = () => {
    const idField = getIdField()
    const dataToExport = exportAll ? catalogData : catalogData.filter(m => selectedIds.has(m[idField]))
    
    if (dataToExport.length === 0) {
      alert('No hay datos para exportar')
      return
    }
    
    if (exportFormat === 'json') {
      setExportPreview(JSON.stringify(dataToExport, null, 2))
    } else {
      setExportPreview(Papa.unparse(dataToExport))
    }
    setShowExportModal(true)
  }
  
  const handleDownload = () => {
    const idField = getIdField()
    const dataToExport = exportAll ? catalogData : catalogData.filter(m => selectedIds.has(m[idField]))
    const catalogName = catalogs.find(c => c.id === currentCatalog).name.replace(/\s+/g, '_')
    
    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${catalogName}_${userName || 'export'}_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csv = Papa.unparse(dataToExport)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${catalogName}_${userName || 'export'}_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setShowExportModal(false)
  }
  
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text)
          if (Array.isArray(data)) {
            const newIds = new Set([...selectedIds, ...data.map(m => m.code || m.atc_code)])
            setSelectedIds(newIds)
            const n = data.length
            alert(
              `Se importaron ${n} elementos.` +
                (isSupabaseConfigured()
                  ? ' Marca las filas o usa «Tu nota» para publicar en la lista del equipo (se pedirá tu nombre).'
                  : '')
            )
          }
        } else if (file.name.endsWith('.csv')) {
          const result = Papa.parse(text, { header: true })
          if (result.data && result.data.length > 0) {
            const newIds = new Set([...selectedIds, ...result.data.map(m => m.code || m.atc_code)])
            setSelectedIds(newIds)
            const n = result.data.length
            alert(
              `Se importaron ${n} elementos.` +
                (isSupabaseConfigured()
                  ? ' Marca las filas o usa «Tu nota» para publicar en la lista del equipo (se pedirá tu nombre).'
                  : '')
            )
          }
        }
      } catch (error) {
        alert('Error al leer el archivo: ' + error.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }
  
  const getSeverityClass = (severity) => {
    if (!severity) return ''
    if (severity.includes('4') || severity.includes('Muy Alta') || severity.includes('very-high')) return 'severity-badge very-high'
    if (severity.includes('3') || severity.includes('Alta') || severity.includes('high')) return 'severity-badge high'
    if (severity.includes('2') || severity.includes('Moderada') || severity.includes('moderate')) return 'severity-badge moderate'
    return 'severity-badge low'
  }
  
  const idField = getIdField()
  const fields = catalogFields[currentCatalog]
  const allFilteredSelected =
    filteredData.length > 0 && filteredData.every((item) => selectedIds.has(item[idField]))

  const noteModalRow = noteItemId != null ? getMyRowForItem(noteItemId) : null
  const canRemoveNoteInModal = Boolean(
    noteDraft.trim() || (noteModalRow?.note && String(noteModalRow.note).trim()),
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-brand" aria-label="cientifi.ca">
              {headerLogoFailed ? (
                <h1 className="logo-title-fallback">cientifi.ca</h1>
              ) : (
                <img
                  src={HEADER_LOGO_SRC}
                  alt="cientifi.ca"
                  className="logo-img"
                  width={1041}
                  height={386}
                  loading="eager"
                  decoding="async"
                  onError={() => setHeaderLogoFailed(true)}
                />
              )}
            </div>
            <div className="logo-meta">
              <span className="logo-tagline">Catálogos de Alergia e Inmunología</span>
            </div>
          </div>
          
          <div className="header-actions">
            <input
              type="text"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)' }}
            />
            <button
              className="btn btn-secondary"
              onClick={() =>
                isSupabaseConfigured()
                  ? withNameGate(() => setShowImportModal(true))
                  : setShowImportModal(true)
              }
            >
              <UploadIcon /> Importar
            </button>
            {isSupabaseConfigured() && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => withNameGate(() => void refreshContributions())}
                disabled={syncBusy}
                title="Traer las aportaciones más recientes de todo el equipo"
              >
                {syncBusy ? '…' : '☁️'} Actualizar equipo
              </button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={selectedIds.size === 0}
            >
              <DownloadIcon /> Exportar ({exportAll ? catalogData.length : selectedIds.size})
            </button>
          </div>
        </div>
      </header>

      {supabaseConfigIssue && (
        <div className="config-banner" role="alert">
          <span className="config-banner-label">Supabase</span>
          <span>{supabaseConfigIssue}</span>
        </div>
      )}

      <main className="main-content">
        {/* Tabs de Catálogos */}
        <div className="catalog-tabs">
          {catalogs.map(cat => (
            <button
              key={cat.id}
              className={`catalog-tab ${currentCatalog === cat.id ? 'active' : ''}`}
              onClick={() => switchCatalog(cat.id)}
            >
              <span className="catalog-tab-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Info del Catálogo */}
        <div className="catalog-info">
          {catalogs.filter(c => c.id === currentCatalog).map(cat => (
            <div key={cat.id} className="info-card">
              <h4>{cat.icon} {cat.name}</h4>
              <p>{cat.description}</p>
            </div>
          ))}
          <div className="info-card">
            <h4>📊 Total en catálogo</h4>
            <p>{catalogData.length} registros</p>
          </div>
        </div>

        {isSupabaseConfigured() && (
          <section className="collab-section" aria-label="Lista colaborativa">
            <div className="collab-card">
              <h4 className="collab-title">☁️ Lista colaborativa</h4>
              <p className="collab-hint">
                «Marcado por» muestra quién seleccionó el ítem; «Notas del equipo» lista cada nota con el nombre de
                quien la escribió. Puedes quitar solo tu nota con «Quitar la mía» o desde el modal. Indica tu nombre
                cuando lo pida la app. «Actualizar equipo» trae los últimos cambios.
              </p>
            </div>
          </section>
        )}

        {/* Filtros */}
        <section className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{filterOptions.label1}</label>
              <select value={filter1} onChange={(e) => { setFilter1(e.target.value); setFilter2('') }}>
                <option value="">Todos</option>
                {filterOptions.options1.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>{filterOptions.label2}</label>
              <select value={filter2} onChange={(e) => setFilter2(e.target.value)} disabled={!filter1}>
                <option value="">Todos</option>
                {filterOptions.options2.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group" style={{ minWidth: '180px' }}>
              <label>Buscar</label>
              <input
                type="text"
                placeholder="Nombre..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            
            <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', minWidth: 'auto', maxWidth: 'none' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
                Favoritos
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showSelectedOnly}
                  onChange={(e) => setShowSelectedOnly(e.target.checked)}
                />
                Seleccionados
              </label>
            </div>
          </div>
          <div className="filters-custom-row">
            <button type="button" className="btn btn-secondary" onClick={openAddCustomModal}>
              + Añadir ítem al catálogo
            </button>
            <span className="filters-custom-hint">
              Los ítems que añades se guardan en este navegador (exportar/importar JSON los incluye si están en la tabla).
            </span>
          </div>
        </section>

        {/* Barra de Resultados */}
        <div className="results-bar">
          <div className="results-count">
            Mostrando <strong>{filteredData.length}</strong> de <strong>{catalogData.length}</strong> registros
            {favorites.size > 0 && ` (${favorites.size} favoritos)`}
          </div>
          
          <div className="selection-info">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportAll}
                onChange={(e) => setExportAll(e.target.checked)}
              />
              Exportar todos
            </label>
            <span className="count">{selectedIds.size}</span> seleccionados
            {selectedIds.size > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={clearSelection}>
                Limpiar selección
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          {filteredData.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p>No se encontraron registros con los filtros seleccionados.</p>
            </div>
          ) : isMobile ? (
            /* Mobile Card View */
            <div className="mobile-card-view">
              {filteredData.map(item => {
                const id = item[idField]
                const row = contributionsByItem.get(id)
                const myRow = getMyRowForItem(id)
                const contribBadges = (row || [])
                  .filter(r => r.selected)
                  .map(r => collaboratorLabel(r))
                const teamNotes = (row || [])
                  .filter(r => r.note && String(r.note).trim())
                  .map(r => ({
                    author: collaboratorLabel(r),
                    text: String(r.note).length > 80
                      ? String(r.note).slice(0, 80) + '…'
                      : String(r.note)
                  }))

                return (
                  <CatalogCard
                    key={id}
                    item={item}
                    idField={idField}
                    isSelected={selectedIds.has(id)}
                    isFavorite={favorites.has(id)}
                    onToggleSelect={handleToggleSelect}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenNoteModal={openNoteModal}
                    hasNote={myRow?.note?.trim()}
                    contribBadges={contribBadges}
                    teamNotes={teamNotes}
                    getSeverityClass={getSeverityClass}
                    fields={fields}
                    isSupabaseConfigured={isSupabaseConfigured}
                    onRemoveNote={removeMyNoteForItem}
                    syncBusy={syncBusy}
                    onRemoveCustom={removeCustomFromCatalog}
                    getMyRowForItem={getMyRowForItem}
                  />
                )
              })}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
                      title="Seleccionar todos"
                    />
                  </th>
                  {fields.map(f => (
                    <th
                      key={f.key}
                      className={`sortable-header ${f.key === 'name' ? 'name-col' : ''}`}
                      onClick={() => handleSort(f.key)}
                    >
                      <div className="th-content">
                        <span>{f.label}</span>
                        <div className="th-actions">
                          <SortIcon direction={sortDirection} active={sortColumn === f.key} />
                          <ColumnFilterDropdown
                            fieldKey={f.key}
                            values={getColumnUniqueValues(f.key)}
                            currentValue={columnFilters[f.key]}
                            onFilterChange={(val) => setColumnFilters(prev => ({...prev, [f.key]: val}))}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                  {isSupabaseConfigured() && (
                    <th className="team-col" title="Notas del equipo">💬</th>
                  )}
                  <th className="actions-col" title="Acciones">···</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => {
                  const itemId = item[idField]
                  const row = contributionsByItem.get(itemId) || []
                  const myRow = getMyRowForItem(itemId)
                  const teamNotes = row.filter(r => r.note && String(r.note).trim())
                  const hasNote = myRow?.note?.trim()

                  return (
                    <tr
                      key={itemId}
                      className={selectedIds.has(itemId) ? 'selected' : ''}
                    >
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(itemId)}
                          onChange={() => handleToggleSelect(itemId)}
                        />
                      </td>
                      {fields.map(f => (
                        <td key={f.key}>
                          {f.key === 'name' ? (
                            <div className="name-cell">
                              <span className="name-text">{item[f.key]}</span>
                              {item._custom && (
                                <span className="custom-catalog-badge" title="Añadido por ti">Tú</span>
                              )}
                            </div>
                          ) : f.key === 'atc_code' || f.key === 'code' ? (
                            <span className="code-badge">{item[f.key]}</span>
                          ) : f.key === 'severity' ? (
                            <span className={getSeverityClass(item[f.key])}>{item[f.key]}</span>
                          ) : f.key === 'mechanism' ? (
                            <span className="mechanism-badge">{item[f.key]}</span>
                          ) : f.key === 'category' ? (
                            <span className="category-badge">{item[f.key]}</span>
                          ) : f.key === 'scientificName' ? (
                            <em className="scientific-name">{item[f.key] || '—'}</em>
                          ) : (
                            item[f.key] || '—'
                          )}
                        </td>
                      ))}
                      {isSupabaseConfigured() && (
                        <td className="team-cell">
                          <TeamNotesCell
                            notes={teamNotes.map(r => ({
                              author: collaboratorLabel(r),
                              text: String(r.note),
                              isMine: r.user_key === myUserKey
                            }))}
                            onAddNote={() => openNoteModal(itemId)}
                            onRemoveNote={() => removeMyNoteForItem(itemId)}
                            isMine={Boolean(hasNote)}
                            syncBusy={syncBusy}
                          />
                        </td>
                      )}
                      <td className="actions-cell">
                        <RowActions
                          itemId={itemId}
                          isFavorite={favorites.has(itemId)}
                          hasNote={Boolean(hasNote)}
                          onToggleFavorite={() => handleToggleFavorite(itemId, { stopPropagation: () => {} })}
                          onOpenNoteModal={() => openNoteModal(itemId)}
                          onRemoveCustom={() => removeCustomFromCatalog(itemId)}
                          isCustom={item._custom}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal añadir ítem al catálogo */}
      {showAddCustomModal && (
        <div className="modal-overlay" onClick={() => setShowAddCustomModal(false)}>
          <div className="modal modal-add-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                Añadir al catálogo:{' '}
                {currentCatalog === 'medications'
                  ? 'Medicamentos'
                  : currentCatalog === 'manifestations'
                    ? 'Manifestaciones'
                    : 'Alérgenos'}
              </h2>
              <button type="button" className="modal-close" onClick={() => setShowAddCustomModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form className="modal-body" onSubmit={submitAddCustom}>
              {currentCatalog === 'medications' && (
                <>
                  <label className="add-custom-field">
                    <span>Nombre / sustancia *</span>
                    <input
                      value={addCustomForm.name || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="p. ej. Antihistamínico X"
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Vía</span>
                    <input
                      value={addCustomForm.route || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, route: e.target.value }))}
                      placeholder="Oral, Inyectable…"
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Indicación</span>
                    <input
                      value={addCustomForm.indication || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, indication: e.target.value }))}
                      placeholder="Uso clínico breve"
                    />
                  </label>
                  <p className="collab-hint">Se asignará un código interno (USR-…) para identificar el ítem.</p>
                </>
              )}
              {currentCatalog === 'manifestations' && (
                <>
                  <label className="add-custom-field">
                    <span>Manifestación *</span>
                    <input
                      value={addCustomForm.name || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Sistema / órgano</span>
                    <input
                      value={addCustomForm.category || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, category: e.target.value }))}
                      placeholder="p. ej. Cutáneo"
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Mecanismo</span>
                    <input
                      value={addCustomForm.mechanism || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, mechanism: e.target.value }))}
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Severidad</span>
                    <input
                      value={addCustomForm.severity || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, severity: e.target.value }))}
                      placeholder="p. ej. 1-2"
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Descripción</span>
                    <textarea
                      rows={2}
                      value={addCustomForm.description || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </label>
                </>
              )}
              {currentCatalog === 'allergens' && (
                <>
                  <label className="add-custom-field">
                    <span>Alimento / alérgeno *</span>
                    <input
                      value={addCustomForm.name || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Nombre científico</span>
                    <input
                      value={addCustomForm.scientificName || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, scientificName: e.target.value }))}
                    />
                  </label>
                  <label className="add-custom-field">
                    <span>Grupo</span>
                    <select
                      value={addCustomForm.group || 'OTROS'}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, group: e.target.value }))}
                    >
                      {Object.entries(foodGroups).map(([code, g]) => (
                        <option key={code} value={code}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="add-custom-field">
                    <span>Riesgo / severidad</span>
                    <select
                      value={addCustomForm.severity || 'Variable'}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, severity: e.target.value }))}
                    >
                      {ALLERGEN_CUSTOM_SEVERITY_OPTIONS.map((s) => (
                        <option key={s.level} value={s.level}>
                          {s.level}
                          {s.description
                            ? ` — ${s.description.length > 52 ? `${s.description.slice(0, 52)}…` : s.description}`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="add-custom-field">
                    <span>Descripción</span>
                    <textarea
                      rows={2}
                      value={addCustomForm.description || ''}
                      onChange={(e) => setAddCustomForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </label>
                </>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCustomModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar en el catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exportación */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📥 Exportar Catálogo</h2>
              <button className="modal-close" onClick={() => setShowExportModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="tabs">
                <button 
                  className={`tab ${exportFormat === 'json' ? 'active' : ''}`}
                  onClick={() => setExportFormat('json')}
                >
                  JSON
                </button>
                <button 
                  className={`tab ${exportFormat === 'csv' ? 'active' : ''}`}
                  onClick={() => setExportFormat('csv')}
                >
                  CSV
                </button>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="value">{exportAll ? catalogData.length : selectedIds.size}</div>
                  <div className="label">{exportAll ? 'Catálogo completo' : 'Seleccionados'}</div>
                </div>
                <div className="stat-card">
                  <div className="value">{favorites.size}</div>
                  <div className="label">Favoritos</div>
                </div>
                <div className="stat-card">
                  <div className="value">{catalogData.length}</div>
                  <div className="label">Total</div>
                </div>
                <div className="stat-card">
                  <div className="value">{filteredData.length}</div>
                  <div className="label">Filtrados</div>
                </div>
              </div>
              
              <h3 style={{marginBottom: '0.5rem', fontSize: '0.9rem'}}>Vista Previa:</h3>
              <div className="preview-content">
                {exportPreview || 'No hay datos para exportar'}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                <DownloadIcon /> Descargar {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Importación */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Importar Selecciones</h2>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="file-input" style={{marginBottom: '1.5rem'}}>
                <input
                  type="file"
                  id="import-file"
                  accept=".json,.csv"
                  onChange={handleImport}
                />
                <label htmlFor="import-file">
                  <UploadIcon /> Seleccionar archivo JSON o CSV
                </label>
              </div>
              
              <div className="instructions-box">
                <h4>📋 Instrucciones:</h4>
                <ul>
                  <li>Los archivos deben contener un array JSON o CSV con los registros</li>
                  <li>Los códigos se fusionarán con tu selección actual</li>
                  <li>Los duplicados se evitarán automáticamente</li>
                  <li>Puedes exportar desde la herramienta y compartir con colaboradores</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showNameGate && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowNameGate(false)
            pendingActionRef.current = null
          }}
        >
          <div className="modal modal-compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tu nombre</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setShowNameGate(false)
                  pendingActionRef.current = null
                }}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p className="collab-hint" style={{ marginBottom: '0.75rem' }}>
                Para la lista colaborativa necesitamos cómo mostrarte a las demás personas en la tabla.
              </p>
              <input
                type="text"
                className="collab-other-input"
                style={{ width: '100%' }}
                value={nameGateDraft}
                onChange={(e) => setNameGateDraft(e.target.value)}
                placeholder="Nombre o apodo"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void confirmNameGate()
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowNameGate(false)
                  pendingActionRef.current = null
                }}
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void confirmNameGate()}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal modal-compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mi nota en este ítem</h2>
              <button type="button" className="modal-close" onClick={() => setShowNoteModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p className="collab-hint" style={{ marginBottom: '0.5rem' }}>
                Las notas de todos aparecen firmadas con el nombre en «Notas del equipo». Puedes borrar solo la tuya con
                «Quitar mi nota» o dejando el texto vacío y guardando (si el ítem sigue marcado, solo se borra el texto).
              </p>
              <textarea
                className="note-textarea"
                rows={4}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Observaciones, dudas, experiencia clínica…"
              />
            </div>
            <div className="modal-footer modal-footer-note">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => void removeMyNoteFromModal()}
                disabled={syncBusy || !canRemoveNoteInModal}
              >
                Quitar mi nota
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void saveNoteFromModal()} disabled={syncBusy}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
