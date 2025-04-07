import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    console.log('N8N Prompt Assistant is now active')

    // Регистрируем провайдер автодополнения для XML файлов
    const xmlProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'xml' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
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
        },
        '<', // Триггер для автодополнения тегов
        ' ' // Триггер для автодополнения атрибутов
    );

    // Регистрируем провайдер автодополнения для N8N файлов
    const n8nProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'n8nprompt' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
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
        },
        '<', // Триггер для автодополнения тегов
        ' ' // Триггер для автодополнения атрибутов
    );

    // Регистрируем провайдер форматирования для XML файлов
    const xmlFormatter = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'xml' },
        {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                const text = document.getText();
                const formatted = formatXML(text);
                return [vscode.TextEdit.replace(
                    new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).range.end.character),
                    formatted
                )];
            }
        }
    );

    // Регистрируем провайдер форматирования для N8N файлов
    const n8nFormatter = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'n8nprompt' },
        {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                const text = document.getText();
                const formatted = formatXML(text);
                return [vscode.TextEdit.replace(
                    new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).range.end.character),
                    formatted
                )];
            }
        }
    );

    // Регистрируем команду форматирования
    const formatCommand = vscode.commands.registerCommand('n8n-prompt-assistant.formatDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });

    context.subscriptions.push(xmlProvider, n8nProvider, xmlFormatter, n8nFormatter, formatCommand);
}

function getTagCompletionItems(): vscode.CompletionItem[] {
    return [
        createCompletionItem('prompt', 'Root element for prompt', vscode.CompletionItemKind.Class),
        createCompletionItem('system', 'System section of prompt', vscode.CompletionItemKind.Property),
        createCompletionItem('user', 'User section of prompt', vscode.CompletionItemKind.Property),
        createCompletionItem('assistant', 'Assistant response section', vscode.CompletionItemKind.Property),
        createCompletionItem('example', 'Interaction example section', vscode.CompletionItemKind.Property),
        createCompletionItem('context', 'Additional context section', vscode.CompletionItemKind.Property)
    ];
}

function getN8NTagCompletionItems(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    // Basic agent tags
    const agentTags = [
        { label: 'Agentinstructions', detail: 'Root element for agent instructions' },
        { label: 'Role', detail: 'Agent role section' },
        { label: 'Name', detail: 'Agent name' },
        { label: 'Description', detail: 'Agent description' },
        { label: 'currentDate', detail: 'Current date with n8n variable' },
        { label: 'Goal', detail: 'Agent goals section' },
        { label: 'Primary', detail: 'Primary agent goal' },
        { label: 'Secondary', detail: 'Secondary agent goal' },
        { label: 'Instructions', detail: 'Agent instructions section' },
        { label: 'Instruction', detail: 'Individual instruction for agent' },
        { label: 'Tools', detail: 'Agent tools section' },
        { label: 'Tool', detail: 'Individual tool for agent' },
        { label: 'Constraints', detail: 'Agent constraints section' },
        { label: 'Constraint', detail: 'Individual constraint for agent' }
    ];

    // Execution context tags
    const executionContextTags = [
        { label: 'ExecutionContext', detail: 'Agent execution context' },
        { label: 'Environment', detail: 'Execution environment (production/staging/development)' },
        { label: 'Timezone', detail: 'Timezone for task execution' },
        { label: 'Language', detail: 'Language for task processing' }
    ];

    // Error handling tags
    const errorHandlingTags = [
        { label: 'ErrorHandling', detail: 'Error handling settings' },
        { label: 'RetryStrategy', detail: 'Retry strategy (exponential/linear/fixed)' },
        { label: 'MaxRetries', detail: 'Maximum number of retries' },
        { label: 'FallbackAction', detail: 'Action when retries are exhausted' }
    ];

    // Validation tags
    const validationTags = [
        { label: 'Validation', detail: 'Data validation rules' },
        { label: 'RequiredFields', detail: 'List of required fields' },
        { label: 'Field', detail: 'Individual required field' },
        { label: 'FormatRules', detail: 'Field formatting rules' },
        { label: 'Rule', detail: 'Formatting rule for field' }
    ];

    // Logging tags
    const loggingTags = [
        { label: 'Logging', detail: 'Logging settings' },
        { label: 'Level', detail: 'Logging level (debug/info/warn/error)' },
        { label: 'IncludeContext', detail: 'Include context in logs' },
        { label: 'SensitiveFields', detail: 'List of sensitive fields' }
    ];

    // Security tags
    const securityTags = [
        { label: 'Security', detail: 'Security settings' },
        { label: 'Authentication', detail: 'Authentication settings' },
        { label: 'Type', detail: 'Authentication type (jwt/basic/oauth)' },
        { label: 'Expiration', detail: 'Token lifetime in seconds' },
        { label: 'RateLimit', detail: 'Request rate limits' },
        { label: 'Requests', detail: 'Maximum number of requests' },
        { label: 'Period', detail: 'Limit period in seconds' }
    ];

    // Integration tags
    const integrationsTags = [
        { label: 'Integrations', detail: 'External service integration settings' },
        { label: 'Service', detail: 'External service configuration' },
        { label: 'Provider', detail: 'Service provider' },
        { label: 'Config', detail: 'Service configuration' },
        { label: 'Host', detail: 'Service host' },
        { label: 'Port', detail: 'Service port' }
    ];

    // Metrics tags
    const metricsTags = [
        { label: 'Metrics', detail: 'Metrics and monitoring settings' },
        { label: 'Track', detail: 'List of tracked metrics' },
        { label: 'Metric', detail: 'Individual metric to track' },
        { label: 'Thresholds', detail: 'Metric thresholds' },
        { label: 'Threshold', detail: 'Threshold for metric' }
    ];

    // Versioning tags
    const versioningTags = [
        { label: 'Versioning', detail: 'Versioning information' },
        { label: 'Current', detail: 'Current version' },
        { label: 'Deprecated', detail: 'Deprecation flag' },
        { label: 'MigrationGuide', detail: 'Link to migration guide' }
    ];

    // Database tags
    const databaseTags = [
        { label: 'Database', detail: 'Database configuration and schema' },
        { label: 'Table', detail: 'Database table description' },
        { label: 'Name', detail: 'Table name' },
        { label: 'Description', detail: 'Table description' },
        { label: 'Columns', detail: 'Table columns section' },
        { label: 'Column', detail: 'Individual column description' },
        { label: 'Type', detail: 'Column data type' },
        { label: 'Constraints', detail: 'Column constraints' },
        { label: 'PrimaryKey', detail: 'Primary key configuration' },
        { label: 'ForeignKey', detail: 'Foreign key configuration' },
        { label: 'Index', detail: 'Index configuration' },
        { label: 'Relations', detail: 'Table relations section' },
        { label: 'Relation', detail: 'Individual relation description' }
    ];

    // Example tags
    const exampleTags = [
        { label: 'Examples', detail: 'Section with interaction examples' },
        { label: 'Example', detail: 'Individual interaction example' },
        { label: 'UserInput', detail: 'User input in the example' },
        { label: 'AgentOutput', detail: 'Agent response in the example' },
        { label: 'Context', detail: 'Additional context for the example' },
        { label: 'Notes', detail: 'Notes about the example' }
    ];

    // Add all tags with their categories
    const allTags = [
        { category: 'Basic agent tags', tags: agentTags },
        { category: 'Execution context', tags: executionContextTags },
        { category: 'Error handling', tags: errorHandlingTags },
        { category: 'Validation', tags: validationTags },
        { category: 'Logging', tags: loggingTags },
        { category: 'Security', tags: securityTags },
        { category: 'Integrations', tags: integrationsTags },
        { category: 'Metrics', tags: metricsTags },
        { category: 'Versioning', tags: versioningTags },
        { category: 'Database', tags: databaseTags },
        { category: 'Examples', tags: exampleTags }
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

function getAttributeCompletionItems(): vscode.CompletionItem[] {
    return [
        createCompletionItem('version', 'XML version', vscode.CompletionItemKind.Property),
        createCompletionItem('encoding', 'XML encoding', vscode.CompletionItemKind.Property)
    ];
}

function createCompletionItem(label: string, description: string, kind: vscode.CompletionItemKind): vscode.CompletionItem {
    const item = new vscode.CompletionItem(label, kind);
    item.detail = description;
    item.documentation = new vscode.MarkdownString(description);
    item.insertText = label;
    return item;
}

function formatXML(xml: string): string {
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

export function deactivate() {} 