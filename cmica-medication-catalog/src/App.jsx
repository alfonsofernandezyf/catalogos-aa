import { useState, useMemo, useRef, useEffect } from 'react'
import { medications, atcGroups } from './data/medications'
import { isSupabaseConfigured, saveMedications, fetchMedications } from './lib/supabase'
import Papa from 'papaparse'
import './index.css'

// Icon components
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const MergeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// Group names for display
const groupNames = {
  'A': 'Alimentario',
  'C': 'Cardiovascular',
  'D': 'Dermatológicos',
  'H': 'Hormonales',
  'J': 'Antiinfecciosos',
  'L': 'Antineoplásicos',
  'M': 'Musculoesquelético',
  'N': 'Nervioso',
  'R': 'Respiratorio',
  'V': 'Varios'
}

function App() {
  // State
  const [allMedications, setAllMedications] = useState([])
  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('cientifi_ca_selected_atc')
      if (raw) {
        const a = JSON.parse(raw)
        if (Array.isArray(a)) return new Set(a)
      }
    } catch {
      /* ignore */
    }
    return new Set()
  })
  const [favorites, setFavorites] = useState(new Set())
  const [customMedications, setCustomMedications] = useState([])
  
  // Filters
  const [filterATC1, setFilterATC1] = useState('')
  const [filterATC2, setFilterATC2] = useState('')
  const [filterATC3, setFilterATC3] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterRoute, setFilterRoute] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showCustomOnly, setShowCustomOnly] = useState(false)
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('json')
  const [exportPreview, setExportPreview] = useState('')
  
  // User info
  const [userName, setUserName] = useState('')
  
  // New medication form
  const [newMed, setNewMed] = useState({
    name: '',
    atc_code: '',
    route: '',
    indication: ''
  })
  
  const fileInputRef = useRef(null)
  const mergeInputRef = useRef(null)

  const [saveCatalogBusy, setSaveCatalogBusy] = useState(false)

  // Load medications on mount
  useEffect(() => {
    const loadData = async () => {
      // Try to load from Supabase first
      if (isSupabaseConfigured()) {
        const supabaseData = await fetchMedications()
        if (supabaseData && supabaseData.length > 0) {
          setAllMedications(supabaseData)
          return
        }
      }
      // Fall back to local data
      setAllMedications(medications)
    }
    loadData()
    
    // Load favorites and selections from localStorage
    const savedFavorites = localStorage.getItem('cientifi_ca_favorites')
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)))
    
    const savedUser = localStorage.getItem('cientifi_ca_user_name')
    if (savedUser) setUserName(savedUser)
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('cientifi_ca_favorites', JSON.stringify([...favorites]))
  }, [favorites])

  // Save user name
  useEffect(() => {
    localStorage.setItem('cientifi_ca_user_name', userName)
  }, [userName])

  // Persistir selección (códigos ATC marcados)
  useEffect(() => {
    localStorage.setItem('cientifi_ca_selected_atc', JSON.stringify([...selectedIds]))
  }, [selectedIds])

  // Get available sub-groups based on selected group
  const availableSubgroups = useMemo(() => {
    if (!filterATC1 || !atcGroups[filterATC1]) return []
    return Object.entries(atcGroups[filterATC1].subgroups).map(([code, data]) => ({
      code,
      name: data.name
    }))
  }, [filterATC1])

  // Get available 3rd level groups
  const availableGroups3 = useMemo(() => {
    if (!filterATC1 || !filterATC2 || !atcGroups[filterATC1]?.subgroups[filterATC2]) return []
    const sub = atcGroups[filterATC1].subgroups[filterATC2]
    if (!sub.subgroups) return []
    return Object.entries(sub.subgroups).map(([code, data]) => ({
      code,
      name: data.name
    }))
  }, [filterATC1, filterATC2])

  // Get unique routes
  const uniqueRoutes = useMemo(() => {
    const routes = new Set()
    allMedications.forEach(m => {
      m.route.split('/').forEach(r => routes.add(r.trim()))
    })
    return [...routes].sort()
  }, [allMedications])

  // Filter medications
  const filteredMedications = useMemo(() => {
    return allMedications.filter(med => {
      // ATC filters
      if (filterATC1 && !med.atc_code.startsWith(filterATC1)) return false
      if (filterATC2) {
        const code2 = med.atc_code.substring(0, 4)
        if (code2 !== filterATC2 && !med.atc_code.startsWith(filterATC2)) return false
      }
      if (filterATC3 && !med.atc_code.startsWith(filterATC3)) return false
      
      // Name filter
      if (filterName && !med.name.toLowerCase().includes(filterName.toLowerCase())) return false
      
      // Route filter
      if (filterRoute && !med.route.toLowerCase().includes(filterRoute.toLowerCase())) return false
      
      // Favorites filter
      if (showFavoritesOnly && !favorites.has(med.atc_code)) return false
      
      // Custom filter
      if (showCustomOnly && !med.isCustom) return false
      
      return true
    })
  }, [allMedications, filterATC1, filterATC2, filterATC3, filterName, filterRoute, showFavoritesOnly, showCustomOnly, favorites])

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredMedications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMedications.map(m => m.atc_code)))
    }
  }

  const handleToggleSelect = (atcCode) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(atcCode)) {
      newSelected.delete(atcCode)
    } else {
      newSelected.add(atcCode)
    }
    setSelectedIds(newSelected)
  }

  const handleToggleFavorite = (atcCode, e) => {
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(atcCode)) {
      newFavorites.delete(atcCode)
    } else {
      newFavorites.add(atcCode)
    }
    setFavorites(newFavorites)
  }

  const handleAddCustom = () => {
    if (!newMed.name || !newMed.atc_code) return
    
    // Validate ATC code format (basic validation)
    const atcRegex = /^[A-Z]\d{2}[A-Z]{2}\d{2}$/
    if (!atcRegex.test(newMed.atc_code)) {
      alert('Código ATC inválido. Use formato: letra + 2 dígitos + 2 letras + 2 dígitos (ej: R06AX01)')
      return
    }
    
    const medication = {
      ...newMed,
      atc_code: newMed.atc_code.toUpperCase(),
      isCustom: true,
      route: newMed.route || 'Oral',
      indication: newMed.indication || 'Medicamento personalizado'
    }
    
    // Check for duplicates
    if (allMedications.some(m => m.atc_code === medication.atc_code)) {
      alert('Ya existe un medicamento con este código ATC')
      return
    }
    
    const newList = [...allMedications, medication]
    setAllMedications(newList)
    setCustomMedications([...customMedications, medication])
    setNewMed({ name: '', atc_code: '', route: '', indication: '' })
    setShowAddModal(false)
  }

  const handleExport = () => {
    const selected = allMedications.filter(m => selectedIds.has(m.atc_code))
    
    if (selected.length === 0) {
      alert('No hay medicamentos seleccionados para exportar')
      return
    }
    
    if (exportFormat === 'json') {
      const data = JSON.stringify(selected, null, 2)
      setExportPreview(data)
    } else {
      const csv = Papa.unparse(selected)
      setExportPreview(csv)
    }
    setShowExportModal(true)
  }

  const handleDownload = () => {
    const selected = allMedications.filter(m => selectedIds.has(m.atc_code))
    
    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cientifi_ca_medications_${userName || 'export'}_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csv = Papa.unparse(selected)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cientifi_ca_medications_${userName || 'export'}_${new Date().toISOString().split('T')[0]}.csv`
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
            // Merge selections
            const newIds = new Set([...selectedIds, ...data.map(m => m.atc_code)])
            setSelectedIds(newIds)
            alert(`Se importaron ${data.length} selecciones`)
          }
        } else if (file.name.endsWith('.csv')) {
          const result = Papa.parse(text, { header: true })
          if (result.data && result.data.length > 0) {
            const newIds = new Set([...selectedIds, ...result.data.map(m => m.atc_code)])
            setSelectedIds(newIds)
            alert(`Se importaron ${result.data.length} selecciones`)
          }
        }
      } catch (error) {
        alert('Error al leer el archivo: ' + error.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleMergeImports = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    let totalImported = 0
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const text = event.target.result
            if (file.name.endsWith('.json')) {
              const data = JSON.parse(text)
              if (Array.isArray(data)) {
                resolve(data.length)
              } else {
                resolve(0)
              }
            } else if (file.name.endsWith('.csv')) {
              const result = Papa.parse(text, { header: true })
              resolve(result.data?.length || 0)
            }
          } catch {
            resolve(0)
          }
        }
        reader.readAsText(file)
      })
    })
    
    Promise.all(promises).then(counts => {
      const total = counts.reduce((a, b) => a + b, 0)
      // For merge, we merge from all files (simplified approach)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const text = event.target.result
            if (file.name.endsWith('.json')) {
              const data = JSON.parse(text)
              if (Array.isArray(data)) {
                const newIds = new Set([...selectedIds, ...data.map(m => m.atc_code)])
                setSelectedIds(newIds)
              }
            } else if (file.name.endsWith('.csv')) {
              const result = Papa.parse(text, { header: true })
              if (result.data) {
                const newIds = new Set([...selectedIds, ...result.data.map(m => m.atc_code)])
                setSelectedIds(newIds)
              }
            }
          } catch {}
        }
        reader.readAsText(event.target?.files?.[0] || { target: { result: '' } })
      })
      alert(`Archivos cargados. Se combinarán ${total} selecciones.`)
      e.target.value = ''
    })
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleSaveToSupabase = async () => {
    setSaveCatalogBusy(true)
    try {
      if (!isSupabaseConfigured()) {
        alert('Supabase no está configurado. Catálogo guardado solo en este navegador.')
        localStorage.setItem('cientifi_ca_medications', JSON.stringify(allMedications))
        return
      }

      const { error } = await saveMedications(allMedications)
      if (error) {
        alert('Error al guardar: ' + error.message)
      } else {
        alert('Medicamentos guardados en Supabase (tabla medications).')
      }
    } finally {
      setSaveCatalogBusy(false)
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>cientifi.ca</h1>
            <span>Catálogo de Medicamentos ATC</span>
          </div>
          
          <div className="header-actions">
            <input
              type="text"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '0.375rem' }}
            />
            <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
              <PlusIcon /> Agregar
            </button>
            <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>
              <UploadIcon /> Importar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveToSupabase}
              disabled={saveCatalogBusy}
              title={
                isSupabaseConfigured()
                  ? 'Sube el catálogo actual a Supabase (medications)'
                  : 'Sin Supabase: guarda una copia local del catálogo'
              }
            >
              {saveCatalogBusy ? '…' : '☁️'} Guardar catálogo
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={selectedIds.size === 0}
            >
              <DownloadIcon /> Exportar ({selectedIds.size})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Filters */}
        <section className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Grupo ATC (1er nivel)</label>
              <select value={filterATC1} onChange={(e) => {
                setFilterATC1(e.target.value)
                setFilterATC2('')
                setFilterATC3('')
              }}>
                <option value="">Todos</option>
                {Object.entries(atcGroups).map(([code, data]) => (
                  <option key={code} value={code}>
                    {code} - {data.name.substring(0, 30)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Subgrupo (2do nivel)</label>
              <select value={filterATC2} onChange={(e) => {
                setFilterATC2(e.target.value)
                setFilterATC3('')
              }} disabled={!filterATC1}>
                <option value="">Todos</option>
                {availableSubgroups.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {code} - {name.substring(0, 35)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Subgrupo (3er nivel)</label>
              <select value={filterATC3} onChange={(e) => setFilterATC3(e.target.value)} disabled={!filterATC2}>
                <option value="">Todos</option>
                {availableGroups3.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Buscar por nombre</label>
              <input
                type="text"
                placeholder="Nombre del medicamento..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Vía de administración</label>
              <select value={filterRoute} onChange={(e) => setFilterRoute(e.target.value)}>
                <option value="">Todas</option>
                {uniqueRoutes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
                Solo favoritos
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showCustomOnly}
                  onChange={(e) => setShowCustomOnly(e.target.checked)}
                />
                Solo custom
              </label>
            </div>
          </div>
        </section>

        {/* Results Bar */}
        <div className="results-bar">
          <div className="results-count">
            Mostrando <strong>{filteredMedications.length}</strong> de <strong>{allMedications.length}</strong> medicamentos
            {favorites.size > 0 && ` (${favorites.size} favoritos)`}
          </div>
          
          <div className="selection-info">
            <span className="count">{selectedIds.size}</span> seleccionados
            {selectedIds.size > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={clearSelection}>
                Limpiar selección
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {filteredMedications.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron medicamentos con los filtros seleccionados.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredMedications.length && filteredMedications.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Favorito</th>
                  <th>Código ATC</th>
                  <th>Nombre (Sustancia)</th>
                  <th>Vía de Administración</th>
                  <th>Indicación</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedications.map(med => (
                  <tr 
                    key={med.atc_code} 
                    className={selectedIds.has(med.atc_code) ? 'selected' : ''}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(med.atc_code)}
                        onChange={() => handleToggleSelect(med.atc_code)}
                      />
                    </td>
                    <td>
                      <button
                        className={`favorite-btn ${favorites.has(med.atc_code) ? 'active' : ''}`}
                        onClick={(e) => handleToggleFavorite(med.atc_code, e)}
                        title={favorites.has(med.atc_code) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <StarIcon filled={favorites.has(med.atc_code)} />
                      </button>
                    </td>
                    <td>
                      <span className="atc-code">{med.atc_code}</span>
                      {med.isCustom && <span className="custom-badge">CUSTOM</span>}
                    </td>
                    <td>{med.name}</td>
                    <td>
                      {med.route.split('/').map((r, i) => (
                        <span key={i} className="route-badge">{r.trim()}</span>
                      ))}
                    </td>
                    <td>{med.indication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Medicamento Personalizado</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="add-form">
                <div className="add-form-row">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>
                      Nombre de la sustancia *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: nuevo_antihistaminico"
                      value={newMed.name}
                      onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>
                      Código ATC * (formato: R06AX99)
                    </label>
                    <input
                      type="text"
                      placeholder="R06AX99"
                      value={newMed.atc_code}
                      onChange={e => setNewMed({ ...newMed, atc_code: e.target.value.toUpperCase() })}
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className="add-form-row">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>
                      Vía de administración
                    </label>
                    <input
                      type="text"
                      placeholder="Oral, Tópica, etc."
                      value={newMed.route}
                      onChange={e => setNewMed({ ...newMed, route: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>
                      Indicación
                    </label>
                    <input
                      type="text"
                      placeholder="Indicação terapéutica"
                      value={newMed.indication}
                      onChange={e => setNewMed({ ...newMed, indication: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                Los medicamentos agregados se marcarán como "CUSTOM" y podrán ser exportados junto con el catálogo.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={handleAddCustom}>
                <PlusIcon /> Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Exportar Medicamentos</h2>
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
                  <div className="value">{selectedIds.size}</div>
                  <div className="label">Seleccionados</div>
                </div>
                <div className="stat-card">
                  <div className="value">{favorites.size}</div>
                  <div className="label">Favoritos</div>
                </div>
                <div className="stat-card">
                  <div className="value">{customMedications.length}</div>
                  <div className="label">Custom</div>
                </div>
              </div>
              
              <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Vista Previa:</h3>
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Importar Selecciones</h2>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Importar archivo propio:</h3>
                <div className="file-input">
                  <input
                    type="file"
                    id="import-file"
                    accept=".json,.csv"
                    onChange={handleImport}
                    ref={fileInputRef}
                  />
                  <label htmlFor="import-file">
                    <UploadIcon /> Seleccionar archivo JSON/CSV
                  </label>
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Combinar múltiples archivos:</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                  Selecciona múltiples archivos de diferentes colaboradores para combinar sus selecciones.
                </p>
                <div className="file-input">
                  <input
                    type="file"
                    id="merge-files"
                    accept=".json,.csv"
                    multiple
                    onChange={handleMergeImports}
                    ref={mergeInputRef}
                  />
                  <label htmlFor="merge-files">
                    <MergeIcon /> Combinar múltiples archivos
                  </label>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Instrucciones:</h4>
                <ul style={{ fontSize: '0.75rem', color: 'var(--gray-500)', paddingLeft: '1.25rem' }}>
                  <li>Cada archivo puede contener un array JSON o CSV con medicamentos</li>
                  <li>Los medicamentos se fusionarán con tu selección actual</li>
                  <li>Los duplicados se evitarán automáticamente</li>
                  <li>Puedes exportar desde la herramienta y compartir el archivo con colaboradores</li>
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
    </div>
  )
}

export default App
