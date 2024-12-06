import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
/** @type {import('eslint').Linter.Config[]} */
export default [
    // 忽略特定目录
    {
        ignores: ['dist'],
    },
    // 针对所有 JS 文件的基本配置
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
            ecmaVersion: 2020, // 可以根据需要调整 ECMAScript 版本
        },
    },
    // 使用 ESLint 推荐的规则
    pluginJs.configs.recommended,
    // 集成 Prettier 并放宽规则
    {
        plugins: {
            prettier,
        }, // 添加 prettier 插件

        rules: {
            // 放宽 ESLint 规则
            'no-console': 'off', // 允许使用 console
            'no-unused-vars': 'warn', // 未使用变量时仅警告
            'no-debugger': 'warn', // 允许 debugger，但会提示警告
            // 关闭一些严格规则
            strict: 'off',
            eqeqeq: 'off',
            // Prettier 规则
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                    trailingComma: 'es5',
                    semi: true,
                    tabWidth: 4,
                    printWidth: 120,
                    arrowParens: 'always',
                },
            ],
        },
        linterOptions: {
            reportUnusedDisableDirectives: true, // 报告未使用的禁用指令
        },
    },
];
