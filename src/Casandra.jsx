import React, { useState, useEffect } from 'react';

function Cassandra() {
  const [currentCommand, setCurrentCommand] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const steps = [
    { id: 1, title: "Crear Keyspace", command: "CREATE KEYSPACE mi_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};" },
    { id: 2, title: "Usar Keyspace", command: "USE mi_keyspace;" },
    { id: 3, title: "Crear Tabla", command: "CREATE TABLE usuarios (id UUID PRIMARY KEY, nombre TEXT, email TEXT, edad INT);" },
    { id: 4, title: "Insertar Datos", command: "INSERT INTO usuarios (id, nombre, email, edad) VALUES (uuid(), 'Juan Perez', 'juan@email.com', 25);" },
    { id: 5, title: "Consultar Datos", command: "SELECT * FROM usuarios;" },
    { id: 6, title: "Eliminar Tabla", command: "DROP TABLE usuarios;" }
  ];

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch('https://backcompiladores.onrender.com/health');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.cassandra_connected || false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  const analyzeCommand = async () => {
    if (!currentCommand.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://backcompiladores.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: currentCommand
        })
      });
      
      const result = await response.json();
      setAnalysisResult(result);
      
    } catch (error) {
      setAnalysisResult({
        success: false,
        errors: ['Error de conexión con el servidor'],
        timestamp: new Date()
      });
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>🗄️ CASSANDRA DATABASE CREATOR</h1>
        <p style={{ margin: '10px 0 0 0', color: '#93c5fd' }}>Analizador CQL + Creador de Bases de Datos</p>
        <div style={{ marginTop: '15px' }}>
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: isConnected ? '#10b981' : '#ef4444',
            fontSize: '14px'
          }}>
            {isConnected ? '✅ Cassandra Conectado' : '❌ Cassandra Desconectado'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Panel de Pasos */}
        <div>
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h2 style={{ marginTop: 0, color: '#93c5fd' }}>📋 Pasos para crear BD</h2>
            
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentCommand(step.command)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: 'rgba(55, 65, 81, 0.5)',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <strong>{step.id}.</strong> {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Principal */}
        <div>
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h2 style={{ marginTop: 0, color: '#93c5fd' }}>🔍 Analizador CQL</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Comando CQL:</label>
              <textarea
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="Escribe tu comando CQL aquí..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <button
              onClick={analyzeCommand}
              disabled={!currentCommand.trim() || isAnalyzing}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: isConnected ? '#2563eb' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                marginBottom: '20px'
              }}
            >
              {isAnalyzing ? '⏳ Analizando...' : '🚀 Analizar y Ejecutar'}
            </button>

            {/* Resultados */}
            {analysisResult && (
              <div style={{
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  backgroundColor: analysisResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }}>
                  <span style={{ fontSize: '20px' }}>
                    {analysisResult.success ? '✅' : '❌'}
                  </span>
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    {analysisResult.success ? 'Comando Válido' : 'Comando con Errores'}
                  </span>
                  {analysisResult.executed && (
                    <div style={{ marginTop: '5px', color: '#86efac', fontSize: '14px' }}>
                      ✅ Ejecutado en Cassandra
                    </div>
                  )}
                </div>

                {/* Mostrar datos */}
                {analysisResult.execution_result && analysisResult.execution_result.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#d1d5db' }}>
                      📊 Resultados ({analysisResult.execution_result.length} registros):
                    </h4>
                    
                    {/* Verificar si hay datos reales de tabla */}
                    {analysisResult.execution_result.length > 0 && 
                     typeof analysisResult.execution_result[0] === 'object' && 
                     !analysisResult.execution_result[0].message ? (
                      
                      /* Mostrar como tabla */
                      <div style={{
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        {/* Encabezados */}
                        <div style={{
                          display: 'flex',
                          backgroundColor: 'rgba(37, 99, 235, 0.3)',
                          padding: '12px',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {Object.keys(analysisResult.execution_result[0]).map((header, index) => (
                            <div key={index} style={{
                              flex: 1,
                              color: '#93c5fd',
                              marginRight: '15px',
                              textTransform: 'uppercase'
                            }}>
                              {header}
                            </div>
                          ))}
                        </div>
                        
                        {/* Filas de datos */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {analysisResult.execution_result.map((row, rowIndex) => (
                            <div key={rowIndex} style={{
                              display: 'flex',
                              padding: '10px 12px',
                              backgroundColor: rowIndex % 2 === 0 ? 'rgba(15, 23, 42, 0.3)' : 'rgba(30, 41, 59, 0.3)',
                              fontSize: '13px',
                              borderBottom: '1px solid rgba(75, 85, 99, 0.3)'
                            }}>
                              {Object.values(row).map((value, cellIndex) => (
                                <div key={cellIndex} style={{
                                  flex: 1,
                                  color: '#e2e8f0',
                                  marginRight: '15px',
                                  wordBreak: 'break-word'
                                }}>
                                  {value !== null && value !== undefined ? String(value) : '-'}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        
                        {/* Contador de filas */}
                        <div style={{
                          padding: '8px 12px',
                          backgroundColor: 'rgba(55, 65, 81, 0.7)',
                          fontSize: '12px',
                          color: '#9ca3af',
                          textAlign: 'center'
                        }}>
                          Total: {analysisResult.execution_result.length} registro(s)
                        </div>
                      </div>
                      
                    ) : (
                      
                      /* Mostrar como mensaje simple */
                      <div style={{
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        padding: '15px',
                        borderRadius: '6px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {analysisResult.execution_result.map((row, index) => (
                          <div key={index} style={{
                            padding: '8px',
                            marginBottom: '8px',
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            borderRadius: '4px'
                          }}>
                            {typeof row === 'object' ? (
                              Object.entries(row).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '4px' }}>
                                  <span style={{ color: '#93c5fd', fontWeight: 'bold' }}>{key}:</span>{' '}
                                  <span style={{ color: '#86efac' }}>{String(value)}</span>
                                </div>
                              ))
                            ) : (
                              <span style={{ color: '#86efac' }}>{String(row)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Errores */}
                {analysisResult.errors && analysisResult.errors.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#fca5a5' }}>❌ Errores:</h4>
                    {analysisResult.errors.map((error, index) => (
                      <div key={index} style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        padding: '8px',
                        borderRadius: '4px',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}>
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Advertencias */}
                {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#fbbf24' }}>⚠️ Advertencias:</h4>
                    {analysisResult.warnings.map((warning, index) => (
                      <div key={index} style={{
                        backgroundColor: 'rgba(251, 191, 36, 0.2)',
                        padding: '8px',
                        borderRadius: '4px',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}>
                        {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de conexión */}
      {!isConnected && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          maxWidth: '300px'
        }}>
          <strong>Cassandra no disponible</strong>
          <br />
          Ejecuta: <code style={{ backgroundColor: '#dc2626', padding: '2px 4px', borderRadius: '4px' }}>
            go run cassandra.go server
          </code>
        </div>
      )}
    </div>
  );
}

export default Cassandra;