# 🧪 Testing y Calidad

La documentación de **Testing y Calidad** describe las estrategias, herramientas y mejores prácticas para asegurar la calidad del código en Hoergen WebApp.

## 📋 Índice

- [Estrategia de Testing](#estrategia-de-testing)
- [Herramientas de Testing](#herramientas-de-testing)
- [Testing Unitario](#testing-unitario)
- [Testing de Integración](#testing-de-integración)
- [Testing de Componentes](#testing-de-componentes)
- [Testing E2E](#testing-e2e)
- [Cobertura de Código](#cobertura-de-código)
- [Testing de Performance](#testing-de-performance)
- [Testing de Accesibilidad](#testing-de-accesibilidad)
- [CI/CD y Testing](#cicd-y-testing)

## 🎯 Estrategia de Testing

### Pirámide de Testing

```
        /\
       /  \     E2E Tests (Pocos)
      /____\    Integration Tests (Algunos)
     /______\   Unit Tests (Muchos)
    /________\
```

### Tipos de Tests

- **Unit Tests**: Funciones y lógica individual
- **Integration Tests**: Interacción entre módulos
- **Component Tests**: Componentes React aislados
- **E2E Tests**: Flujos completos de usuario
- **Performance Tests**: Rendimiento y carga
- **Accessibility Tests**: Accesibilidad y usabilidad

## 🛠️ Herramientas de Testing

### Stack Principal

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^24.0.0",
    "msw": "^2.0.0"
  }
}
```

### Configuración de Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});
```

## 🧩 Testing Unitario

### Configuración de Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createMediaElementSource: vi.fn(),
  createAnalyser: vi.fn(),
  createGain: vi.fn(),
  createOscillator: vi.fn(),
  destination: {},
}));

// Mock de Web Audio API
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));
```

### Ejemplos de Tests Unitarios

#### Test de Utilidades

```typescript
// src/utils/formatTime.test.ts
import { describe, it, expect } from 'vitest';
import { formatTime, formatDuration } from './formatTime';

describe('formatTime', () => {
  it('formatea segundos correctamente', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('maneja valores negativos', () => {
    expect(formatTime(-30)).toBe('-0:30');
    expect(formatTime(-65)).toBe('-1:05');
  });

  it('maneja valores decimales', () => {
    expect(formatTime(30.5)).toBe('0:30');
    expect(formatTime(65.9)).toBe('1:05');
  });
});

describe('formatDuration', () => {
  it('formatea duración en formato legible', () => {
    expect(formatDuration(30)).toBe('30 segundos');
    expect(formatDuration(60)).toBe('1 minuto');
    expect(formatDuration(120)).toBe('2 minutos');
    expect(formatDuration(3661)).toBe('1 hora 1 minuto 1 segundo');
  });
});
```

#### Test de Hooks

```typescript
// src/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('retorna valor inicial cuando no hay valor almacenado', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('retorna valor almacenado cuando está disponible', () => {
    localStorage.setItem('test', '"stored"');
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('actualiza valor almacenado cuando se llama setValue', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test')).toBe('"new value"');
  });

  it('maneja valores complejos como objetos', () => {
    const testObject = { name: 'test', value: 123 };
    const { result } = renderHook(() => useLocalStorage('test', testObject));
    
    act(() => {
      result.current[1]({ ...testObject, value: 456 });
    });
    
    expect(result.current[0]).toEqual({ name: 'test', value: 456 });
  });
});
```

## 🔗 Testing de Integración

### Mock Service Worker (MSW)

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET /api/stations
  http.get('/api/stations', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Station 1',
        description: 'Test description 1',
        genre: ['House', 'Techno'],
        currentListeners: 150,
        isLive: true,
      },
      {
        id: '2',
        name: 'Test Station 2',
        description: 'Test description 2',
        genre: ['Trance', 'Progressive'],
        currentListeners: 89,
        isLive: false,
      },
    ]);
  }),

  // GET /api/stations/:id
  http.get('/api/stations/:id', ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id,
      name: `Test Station ${id}`,
      description: `Test description for station ${id}`,
      genre: ['House', 'Techno'],
      currentListeners: 150,
      isLive: true,
      creator: {
        id: 'user1',
        username: 'testuser',
        displayName: 'Test User',
      },
    });
  }),

  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        token_type: 'Bearer',
        user: {
          id: 'user1',
          email: 'test@example.com',
          username: 'testuser',
        },
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),
];
```

### Configuración de MSW

```typescript
// src/test/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/test/setup.ts
if (process.env.NODE_ENV === 'test') {
  const { worker } = require('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}
```

### Test de Integración

```typescript
// src/features/stations/StationList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StationList } from './StationList';
import { StationProvider } from './StationContext';

describe('StationList Integration', () => {
  it('carga y muestra estaciones desde la API', async () => {
    render(
      <StationProvider>
        <StationList />
      </StationProvider>
    );

    // Verificar estado de carga
    expect(screen.getByText('Cargando estaciones...')).toBeInTheDocument();

    // Esperar a que se carguen las estaciones
    await waitFor(() => {
      expect(screen.getByText('Test Station 1')).toBeInTheDocument();
      expect(screen.getByText('Test Station 2')).toBeInTheDocument();
    });

    // Verificar información de las estaciones
    expect(screen.getByText('House, Techno')).toBeInTheDocument();
    expect(screen.getByText('150 oyentes')).toBeInTheDocument();
    expect(screen.getByText('EN VIVO')).toBeInTheDocument();
  });

  it('maneja errores de API correctamente', async () => {
    // Mock de error de API
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <StationProvider>
        <StationList />
      </StationProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar estaciones')).toBeInTheDocument();
    });
  });
});
```

## 🧩 Testing de Componentes

### Test de Componentes React

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza con texto correcto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('llama onClick cuando se hace clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica clases de variante correctamente', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('btn-secondary');
  });

  it('aplica clases de tamaño correctamente', () => {
    render(<Button size="large">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('btn-large');
  });

  it('deshabilita el botón cuando disabled es true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('no llama onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Test de Componentes con Context

```typescript
// src/components/StationCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StationCard } from './StationCard';
import { StationProvider } from '../context/StationContext';

const mockStation = {
  id: '1',
  name: 'Test Station',
  description: 'Test description',
  genre: ['House', 'Techno'],
  currentListeners: 150,
  isLive: true,
  coverImage: 'test-cover.jpg',
};

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <StationProvider>
      {component}
    </StationProvider>
  );
};

describe('StationCard', () => {
  it('renderiza información de estación correctamente', () => {
    renderWithContext(<StationCard station={mockStation} />);
    
    expect(screen.getByText('Test Station')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('House, Techno')).toBeInTheDocument();
    expect(screen.getByText('150 oyentes')).toBeInTheDocument();
    expect(screen.getByText('EN VIVO')).toBeInTheDocument();
  });

  it('muestra imagen de portada', () => {
    renderWithContext(<StationCard station={mockStation} />);
    
    const coverImage = screen.getByAltText('Portada de Test Station');
    expect(coverImage).toHaveAttribute('src', 'test-cover.jpg');
  });

  it('maneja estaciones sin imagen', () => {
    const stationWithoutImage = { ...mockStation, coverImage: undefined };
    renderWithContext(<StationCard station={stationWithoutImage} />);
    
    expect(screen.getByAltText('Portada por defecto')).toBeInTheDocument();
  });
});
```

## 🌐 Testing E2E

### Playwright para E2E

```typescript
// tests/e2e/station-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navegación de Estaciones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('usuario puede navegar a una estación', async ({ page }) => {
    // Verificar que las estaciones estén visibles
    await expect(page.locator('[data-testid="station-card"]')).toHaveCount(2);
    
    // Hacer clic en la primera estación
    await page.locator('[data-testid="station-card"]').first().click();
    
    // Verificar que se navegue a la página de estación
    await expect(page).toHaveURL(/\/stations\/\d+/);
    
    // Verificar que se muestre la información de la estación
    await expect(page.locator('[data-testid="station-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="station-description"]')).toBeVisible();
  });

  test('usuario puede reproducir audio de estación', async ({ page }) => {
    await page.locator('[data-testid="station-card"]').first().click();
    
    // Hacer clic en el botón de reproducción
    await page.locator('[data-testid="play-button"]').click();
    
    // Verificar que el reproductor esté activo
    await expect(page.locator('[data-testid="player-controls"]')).toBeVisible();
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
  });

  test('usuario puede enviar mensaje en chat', async ({ page }) => {
    await page.locator('[data-testid="station-card"]').first().click();
    
    // Navegar a la pestaña de chat
    await page.locator('[data-testid="chat-tab"]').click();
    
    // Escribir y enviar mensaje
    await page.locator('[data-testid="chat-input"]').fill('Hola desde test!');
    await page.locator('[data-testid="send-button"]').click();
    
    // Verificar que el mensaje aparezca
    await expect(page.locator('text=Hola desde test!')).toBeVisible();
  });
});
```

### Configuración de Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📊 Cobertura de Código

### Configuración de Cobertura

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'src/main.tsx',
        'src/routeTree.gen.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        './src/components/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        './src/hooks/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
});
```

### Scripts de Cobertura

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:coverage:html": "vitest run --coverage --reporter=html",
    "test:coverage:badges": "vitest run --coverage --reporter=json && node scripts/generate-coverage-badges.js"
  }
}
```

## ⚡ Testing de Performance

### Lighthouse CI

```typescript
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Test de Performance con Vitest

```typescript
// src/utils/performance.test.ts
import { describe, it, expect } from 'vitest';
import { measurePerformance } from './performance';

describe('Performance Tests', () => {
  it('formatea tiempo en menos de 1ms', () => {
    const result = measurePerformance(() => {
      // Código a medir
      for (let i = 0; i < 1000; i++) {
        formatTime(i);
      }
    });
    
    expect(result.duration).toBeLessThan(1);
  });

  it('procesa 1000 estaciones en menos de 10ms', () => {
    const stations = Array.from({ length: 1000 }, (_, i) => ({
      id: i.toString(),
      name: `Station ${i}`,
      genre: ['House'],
    }));
    
    const result = measurePerformance(() => {
      processStations(stations);
    });
    
    expect(result.duration).toBeLessThan(10);
  });
});
```

## ♿ Testing de Accesibilidad

### Testing con axe-core

```typescript
// src/test/accessibility.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// src/components/Button.test.tsx
import { axe } from 'jest-axe';

describe('Button Accessibility', () => {
  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('tiene atributo aria-label cuando es necesario', () => {
    render(<Button aria-label="Cerrar modal">×</Button>);
    expect(screen.getByLabelText('Cerrar modal')).toBeInTheDocument();
  });

  it('puede ser enfocado con teclado', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    
    button.focus();
    expect(button).toHaveFocus();
  });
});
```

### Testing de Navegación por Teclado

```typescript
// src/components/StationList.test.tsx
import { fireEvent } from '@testing-library/react';

describe('StationList Keyboard Navigation', () => {
  it('permite navegación con teclado', () => {
    render(<StationList />);
    
    const firstStation = screen.getByTestId('station-card');
    firstStation.focus();
    
    // Navegar con Tab
    fireEvent.keyDown(firstStation, { key: 'Tab' });
    expect(document.activeElement).not.toBe(firstStation);
    
    // Navegar con flechas
    fireEvent.keyDown(firstStation, { key: 'ArrowDown' });
    // Verificar que se mueva al siguiente elemento
  });
});
```

## 🔄 CI/CD y Testing

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:coverage"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

## 📚 Recursos Adicionales

### Documentación Oficial

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

### Mejores Prácticas

- **Arrange-Act-Assert**: Estructura clara de tests
- **Test Isolation**: Cada test debe ser independiente
- **Meaningful Names**: Nombres descriptivos para tests
- **DRY Principle**: Evitar duplicación en tests
- **Realistic Data**: Usar datos que simulen casos reales

---

**Última actualización**: Diciembre 2024  
**Versión**: 0.1.4  
**Autor**: Equipo de Hoergen
