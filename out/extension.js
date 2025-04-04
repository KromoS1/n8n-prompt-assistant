"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
function activate(context) {
    console.log('N8N Prompt Assistant is now active');
    // Регистрируем провайдер автодополнения для XML файлов
    const xmlProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'xml' }, {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const wordRange = document.getWordRangeAtPosition(position);
            const word = wordRange ? document.getText(wordRange) : '';
            // Если строка начинается с '<', предлагаем теги
            if (linePrefix.endsWith('<')) {
                return getTagCompletionItems();
            }
            // Если внутри тега, предлагаем атрибуты
            if (linePrefix.includes('<') && !linePrefix.includes('>')) {
                return getAttributeCompletionItems();
            }
            return [];
        }
    }, '<', // Триггер для автодополнения тегов
    ' ' // Триггер для автодополнения атрибутов
    );
    // Регистрируем провайдер автодополнения для N8N файлов
    const n8nProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'n8nprompt' }, {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const wordRange = document.getWordRangeAtPosition(position);
            const word = wordRange ? document.getText(wordRange) : '';
            // Если строка начинается с '<', предлагаем теги
            if (linePrefix.endsWith('<')) {
                return getN8NTagCompletionItems();
            }
            // Если внутри тега, предлагаем атрибуты
            if (linePrefix.includes('<') && !linePrefix.includes('>')) {
                return getAttributeCompletionItems();
            }
            return [];
        }
    }, '<', // Триггер для автодополнения тегов
    ' ' // Триггер для автодополнения атрибутов
    );
    // Регистрируем провайдер форматирования для XML файлов
    const xmlFormatter = vscode.languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'xml' }, {
        provideDocumentFormattingEdits(document) {
            const text = document.getText();
            const formatted = formatXML(text);
            return [vscode.TextEdit.replace(new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).range.end.character), formatted)];
        }
    });
    // Регистрируем провайдер форматирования для N8N файлов
    const n8nFormatter = vscode.languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'n8nprompt' }, {
        provideDocumentFormattingEdits(document) {
            const text = document.getText();
            const formatted = formatXML(text);
            return [vscode.TextEdit.replace(new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).range.end.character), formatted)];
        }
    });
    // Регистрируем команду форматирования
    const formatCommand = vscode.commands.registerCommand('n8n-prompt-assistant.formatDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });
    context.subscriptions.push(xmlProvider, n8nProvider, xmlFormatter, n8nFormatter, formatCommand);
}
function getTagCompletionItems() {
    return [
        createCompletionItem('prompt', 'Корневой элемент для промпта', vscode.CompletionItemKind.Class),
        createCompletionItem('system', 'Системная секция промпта', vscode.CompletionItemKind.Property),
        createCompletionItem('user', 'Пользовательская секция промпта', vscode.CompletionItemKind.Property),
        createCompletionItem('assistant', 'Секция ответа ассистента', vscode.CompletionItemKind.Property),
        createCompletionItem('example', 'Секция примера взаимодействия', vscode.CompletionItemKind.Property),
        createCompletionItem('context', 'Секция дополнительного контекста', vscode.CompletionItemKind.Property)
    ];
}
function getN8NTagCompletionItems() {
    const items = [];
    // Основные теги агента
    const agentTags = [
        { label: 'Agentinstructions', detail: 'Корневой элемент для инструкций агента' },
        { label: 'Role', detail: 'Секция роли агента' },
        { label: 'Name', detail: 'Имя агента' },
        { label: 'Description', detail: 'Описание агента' },
        { label: 'currentDate', detail: 'Текущая дата с переменной n8n' },
        { label: 'Goal', detail: 'Секция целей агента' },
        { label: 'Primary', detail: 'Основная цель агента' },
        { label: 'Secondary', detail: 'Вторичная цель агента' },
        { label: 'Instructions', detail: 'Секция инструкций агента' },
        { label: 'Instruction', detail: 'Отдельная инструкция для агента' },
        { label: 'Tools', detail: 'Секция инструментов агента' },
        { label: 'Tool', detail: 'Отдельный инструмент для агента' },
        { label: 'Constraints', detail: 'Секция ограничений агента' },
        { label: 'Constraint', detail: 'Отдельное ограничение для агента' }
    ];
    // Теги для контекста выполнения
    const executionContextTags = [
        { label: 'ExecutionContext', detail: 'Контекст выполнения агента' },
        { label: 'Environment', detail: 'Окружение выполнения (production/staging/development)' },
        { label: 'Timezone', detail: 'Часовой пояс для выполнения задач' },
        { label: 'Language', detail: 'Язык для обработки задач' }
    ];
    // Теги для обработки ошибок
    const errorHandlingTags = [
        { label: 'ErrorHandling', detail: 'Настройки обработки ошибок' },
        { label: 'RetryStrategy', detail: 'Стратегия повторных попыток (exponential/linear/fixed)' },
        { label: 'MaxRetries', detail: 'Максимальное количество повторных попыток' },
        { label: 'FallbackAction', detail: 'Действие при исчерпании попыток' }
    ];
    // Теги для валидации
    const validationTags = [
        { label: 'Validation', detail: 'Правила валидации данных' },
        { label: 'RequiredFields', detail: 'Список обязательных полей' },
        { label: 'Field', detail: 'Отдельное обязательное поле' },
        { label: 'FormatRules', detail: 'Правила форматирования полей' },
        { label: 'Rule', detail: 'Правило форматирования для поля' }
    ];
    // Теги для логирования
    const loggingTags = [
        { label: 'Logging', detail: 'Настройки логирования' },
        { label: 'Level', detail: 'Уровень логирования (debug/info/warn/error)' },
        { label: 'IncludeContext', detail: 'Включить контекст в логи' },
        { label: 'SensitiveFields', detail: 'Список чувствительных полей' }
    ];
    // Теги для безопасности
    const securityTags = [
        { label: 'Security', detail: 'Настройки безопасности' },
        { label: 'Authentication', detail: 'Настройки аутентификации' },
        { label: 'Type', detail: 'Тип аутентификации (jwt/basic/oauth)' },
        { label: 'Expiration', detail: 'Время жизни токена в секундах' },
        { label: 'RateLimit', detail: 'Ограничения по количеству запросов' },
        { label: 'Requests', detail: 'Максимальное количество запросов' },
        { label: 'Period', detail: 'Период ограничения в секундах' }
    ];
    // Теги для интеграций
    const integrationsTags = [
        { label: 'Integrations', detail: 'Настройки интеграций с внешними сервисами' },
        { label: 'Service', detail: 'Конфигурация внешнего сервиса' },
        { label: 'Provider', detail: 'Провайдер сервиса' },
        { label: 'Config', detail: 'Конфигурация сервиса' },
        { label: 'Host', detail: 'Хост сервиса' },
        { label: 'Port', detail: 'Порт сервиса' }
    ];
    // Теги для метрик
    const metricsTags = [
        { label: 'Metrics', detail: 'Настройки метрик и мониторинга' },
        { label: 'Track', detail: 'Список отслеживаемых метрик' },
        { label: 'Metric', detail: 'Отдельная метрика для отслеживания' },
        { label: 'Thresholds', detail: 'Пороговые значения для метрик' },
        { label: 'Threshold', detail: 'Пороговое значение для метрики' }
    ];
    // Теги для версионирования
    const versioningTags = [
        { label: 'Versioning', detail: 'Информация о версионировании' },
        { label: 'Current', detail: 'Текущая версия' },
        { label: 'Deprecated', detail: 'Флаг устаревания' },
        { label: 'MigrationGuide', detail: 'Ссылка на руководство по миграции' }
    ];
    // Добавляем все теги с соответствующими категориями
    const allTags = [
        { category: 'Основные теги агента', tags: agentTags },
        { category: 'Контекст выполнения', tags: executionContextTags },
        { category: 'Обработка ошибок', tags: errorHandlingTags },
        { category: 'Валидация', tags: validationTags },
        { category: 'Логирование', tags: loggingTags },
        { category: 'Безопасность', tags: securityTags },
        { category: 'Интеграции', tags: integrationsTags },
        { category: 'Метрики', tags: metricsTags },
        { category: 'Версионирование', tags: versioningTags }
    ];
    allTags.forEach(category => {
        category.tags.forEach(tag => {
            const item = new vscode.CompletionItem(tag.label, vscode.CompletionItemKind.Property);
            item.detail = tag.detail;
            item.documentation = new vscode.MarkdownString(`**${category.category}**\n\n${tag.detail}`);
            items.push(item);
        });
    });
    return items;
}
function getAttributeCompletionItems() {
    return [
        createCompletionItem('version', 'XML версия', vscode.CompletionItemKind.Property),
        createCompletionItem('encoding', 'XML кодировка', vscode.CompletionItemKind.Property)
    ];
}
function createCompletionItem(label, description, kind) {
    const item = new vscode.CompletionItem(label, kind);
    item.detail = description;
    item.documentation = new vscode.MarkdownString(description);
    item.insertText = label;
    return item;
}
function formatXML(xml) {
    // Простое форматирование XML с отступами
    let formatted = '';
    let indent = 0;
    const lines = xml.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('</')) {
            indent--;
        }
        formatted += '\t'.repeat(Math.max(0, indent)) + trimmed + '\n';
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indent++;
        }
    }
    return formatted;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map