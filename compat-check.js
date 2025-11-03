// compat-check.js (в корне проекта)
export function checkCompatibility() {
  const checks = {
    nodeVersion: checkNodeVersion(),
    esmSupport: checkESMSupport(),
    modernFeatures: checkModernFeatures()
  }

  return checks
}

function checkNodeVersion() {
  const nodeVersion = process.version
  const major = parseInt(process.version.slice(1).split('.')[0])
  return {
    supported: major >= 18,
    version: nodeVersion,
    message: major >= 18 ? '✅ Node.js версия поддерживается' : '❌ Требуется Node.js 18+'
  }
}

function checkESMSupport() {
  try {
    new Function('import("")')
    return {
      supported: true,
      message: '✅ ESM модули поддерживаются'
    }
  } catch {
    return {
      supported: false,
      message: '❌ ESM модули не поддерживаются'
    }
  }
}

function checkModernFeatures() {
  const features = {
    arrowFunctions: typeof (() => {}) === 'function',
    promises: typeof Promise !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    modules: typeof import !== 'undefined'
  }

  const unsupported = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([name]) => name)

  return {
    supported: unsupported.length === 0,
    unsupported,
    message: unsupported.length === 0 
      ? '✅ Все современные функции поддерживаются' 
      : `❌ Не поддерживаются: ${unsupported.join(', ')}`
  }
}

// Автопроверка при импорте
if (typeof window === 'undefined') {
  // Node.js environment
  const compat = checkCompatibility()
  console.log('🔍 Проверка совместимости Node.js:')
  Object.values(compat).forEach(check => {
    console.log(check.message)
  })
}
