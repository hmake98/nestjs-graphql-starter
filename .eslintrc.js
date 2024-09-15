module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        extraFileExtensions: ['.json'], // Add this line
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['parent', 'sibling', 'index'],
                ],
                'newlines-between': 'always',
            },
        ],
        'import/newline-after-import': ['error', { count: 1 }],
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/*.spec.ts',
                    '**/*.test.ts',
                    '**/jest.config.ts',
                ],
            },
        ],
        'no-console': 'warn',
        'no-debugger': 'error',
    },
    overrides: [
        {
            files: ['*.json', '*.json5'],
            parser: 'jsonc-eslint-parser',
            rules: {
                '@typescript-eslint/no-unused-expressions': 'off',
            },
        },
    ],
};
