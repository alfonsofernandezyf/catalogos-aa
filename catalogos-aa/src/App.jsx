import { useState, useMemo, useRef } from 'react'
import { medications, atcGroups } from './data/medications'
import { clinicalManifestations, severityGrades, mechanisms } from './data/clinicalManifestations'
import { foodAllergens, foodGroups, severityLevels } from './data/foodAllergens'
import Papa from 'papaparse'
import './index.css'

// SVG Icons
const MedIcon = () => <span style={{fontSize: '1.25rem'}}>💊</span>
const BodyIcon = () => <span style={{fontSize: '1.25rem'}}>🩺</span>
const FoodIcon = () => <span style={{fontSize: '1.25rem'}}>🥜</span>
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
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
const MergeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
    <path d="M6 21V9a9 9 0 0 0 9 9"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

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
    { key: 'atc_code', label: 'Código ATC' },
    { key: 'name', label: 'Sustancia' },
    { key: 'route', label: 'Vía' },
    { key: 'indication', label: 'Indicación' }
  ],
  manifestations: [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Manifestación' },
    { key: 'category', label: 'Sistema' },
    { key: 'mechanism', label: 'Mecanismo' },
    { key: 'severity', label: 'Severidad' },
    { key: 'description', label: 'Descripción' }
  ],
  allergens: [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Alimento' },
    { key: 'scientificName', label: 'Nombre Científico' },
    { key: 'group', label: 'Grupo' },
    { key: 'severity', label: 'Riesgo' },
    { key: 'description', label: 'Descripción' }
  ]
}

function App() {
  // Estado general
  const [currentCatalog, setCurrentCatalog] = useState('medications')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [favorites, setFavorites] = useState(new Set())
  const [userName, setUserName] = useState('')
  
  // Filtros
  const [filter1, setFilter1] = useState('')
  const [filter2, setFilter2] = useState('')
  const [filter3, setFilter3] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  
  // Modals
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('json')
  const [exportPreview, setExportPreview] = useState('')
  const [exportAll, setExportAll] = useState(false)
  
  const fileInputRef = useRef(null)
  
  // Datos por catálogo
  const getCatalogData = () => {
    switch(currentCatalog) {
      case 'medications': return medications
      case 'manifestations': return clinicalManifestations
      case 'allergens': return foodAllergens
      default: return []
    }
  }
  
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
    const data = getCatalogData()
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
  
  // Filtrar datos
  const filteredData = useMemo(() => {
    const data = getCatalogData()
    const idField = getIdField()
    
    return data.filter(item => {
      // Filtro por nombre
      if (filterName && !item.name.toLowerCase().includes(filterName.toLowerCase())) return false
      
      // Filtros específicos por catálogo
      if (currentCatalog === 'medications') {
        if (filter1 && !item.atc_code.startsWith(filter1)) return false
        if (filter2) {
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
  }, [currentCatalog, filter1, filter2, filterName, showFavoritesOnly, showSelectedOnly, selectedIds, favorites])
  
  // Manejadores
  const handleSelectAll = () => {
    const idField = getIdField()
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredData.map(m => m[idField])))
    }
  }
  
  const handleToggleSelect = (id) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
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
    
    // Guardar en localStorage
    localStorage.setItem('catalogosaa_favorites', JSON.stringify([...newFavorites]))
    localStorage.setItem('catalogosaa_catalog_favorites', JSON.stringify([...newFavorites]))
  }
  
  const handleExport = () => {
    const idField = getIdField()
    const dataToExport = exportAll ? getCatalogData() : getCatalogData().filter(m => selectedIds.has(m[idField]))
    
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
    const dataToExport = exportAll ? getCatalogData() : getCatalogData().filter(m => selectedIds.has(m[idField]))
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
            alert(`Se importaron ${data.length} elementos`)
          }
        } else if (file.name.endsWith('.csv')) {
          const result = Papa.parse(text, { header: true })
          if (result.data && result.data.length > 0) {
            const newIds = new Set([...selectedIds, ...result.data.map(m => m.code || m.atc_code)])
            setSelectedIds(newIds)
            alert(`Se importaron ${result.data.length} elementos`)
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
  
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📚</div>
            <div>
              <h1>Catálogos-AA</h1>
              <span>Registro Nacional de Alergia Alimentaria</span>
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
            <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>
              <UploadIcon /> Importar
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={selectedIds.size === 0}
            >
              <DownloadIcon /> Exportar ({exportAll ? getCatalogData().length : selectedIds.size})
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Tabs de Catálogos */}
        <div className="catalog-tabs">
          {catalogs.map(cat => (
            <button
              key={cat.id}
              className={`catalog-tab ${currentCatalog === cat.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentCatalog(cat.id)
                setSelectedIds(new Set())
                setFilter1('')
                setFilter2('')
                setFilterName('')
              }}
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
            <p>{getCatalogData().length} registros</p>
          </div>
        </div>

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
            
            <div className="filter-group">
              <label>Buscar por nombre</label>
              <input
                type="text"
                placeholder="Nombre del elemento..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            
            <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
                ⭐ Solo favoritos
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showSelectedOnly}
                  onChange={(e) => setShowSelectedOnly(e.target.checked)}
                />
                ☑️ Solo seleccionados
              </label>
            </div>
          </div>
        </section>

        {/* Barra de Resultados */}
        <div className="results-bar">
          <div className="results-count">
            Mostrando <strong>{filteredData.length}</strong> de <strong>{getCatalogData().length}</strong> registros
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
              <button className="btn btn-sm btn-secondary" onClick={() => setSelectedIds(new Set())}>
                Limpiar
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
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Fav</th>
                  {fields.map(f => (
                    <th key={f.key}>{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr 
                    key={item[idField]} 
                    className={selectedIds.has(item[idField]) ? 'selected' : ''}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item[idField])}
                        onChange={() => handleToggleSelect(item[idField])}
                      />
                    </td>
                    <td>
                      <button
                        className={`favorite-btn ${favorites.has(item[idField]) ? 'active' : ''}`}
                        onClick={(e) => handleToggleFavorite(item[idField], e)}
                      >
                        <StarIcon filled={favorites.has(item[idField])} />
                      </button>
                    </td>
                    {fields.map(f => (
                      <td key={f.key}>
                        {f.key === 'atc_code' || f.key === 'code' ? (
                          <span className="code-badge">{item[f.key]}</span>
                        ) : f.key === 'severity' ? (
                          <span className={getSeverityClass(item[f.key])}>{item[f.key]}</span>
                        ) : f.key === 'mechanism' ? (
                          <span className="mechanism-badge">{item[f.key]}</span>
                        ) : f.key === 'category' ? (
                          <span className="category-badge">{item[f.key]}</span>
                        ) : f.key === 'scientificName' ? (
                          <em style={{color: 'var(--gray-500)', fontSize: '0.85rem'}}>
                            {item[f.key] || '-'}
                          </em>
                        ) : (
                          item[f.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

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
                  <div className="value">{exportAll ? getCatalogData().length : selectedIds.size}</div>
                  <div className="label">{exportAll ? 'Catálogo completo' : 'Seleccionados'}</div>
                </div>
                <div className="stat-card">
                  <div className="value">{favorites.size}</div>
                  <div className="label">Favoritos</div>
                </div>
                <div className="stat-card">
                  <div className="value">{getCatalogData().length}</div>
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
    </div>
  )
}

export default App
