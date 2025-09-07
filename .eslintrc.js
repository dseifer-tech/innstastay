module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'warn',
  },
  overrides: [
    {
      files: [
        'app/about/**/*.{ts,tsx}',
        'app/contact/**/*.{ts,tsx}',
        'app/privacy/**/*.{ts,tsx}',
        'app/hotels/toronto-downtown/**/*.{ts,tsx}',
        'app/not-found.tsx',
      ],
      rules: {
        'no-restricted-imports': ['error', { paths: [
          { name: 'next/navigation', message: 'Use a .client.tsx leaf wrapped in <Suspense> instead.' },
        ]}],
        'no-restricted-globals': ['error', { name: 'window', message: 'Not available in server files.' }],
      },
    },
  ],
}


