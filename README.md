# N8N Prompt Assistant

Расширение для VSCode и Cursor, помогающее писать промпты для ИИ-агентов в сервисе n8n.

## Возможности

- **Поддержка файлов**: `.prompt.xml`, `.n8n`
- **Сниппеты**: Готовые шаблоны для создания промптов и агентов
- **Автодополнение**: Подсказки тегов и атрибутов при вводе
- **Подсветка синтаксиса**: Улучшенная читаемость XML-структуры
- **Форматирование**: Автоматическое форматирование XML-документов

## Использование

### Создание нового файла

1. Создайте новый файл с расширением `.prompt.xml` или `.n8n`
2. Начните вводить теги или используйте сниппеты

### Сниппеты

Доступные сниппеты:

#### Основные шаблоны
- `agent` - Базовый шаблон агента
- `agentfull` - Полный шаблон агента
- `xml` - XML декларация (опционально)

#### Секции агента
- `agentinstructions` - Корневой элемент для инструкций агента
- `role` - Секция роли агента
- `name` - Имя агента
- `description` - Описание агента
- `currentdate` - Текущая дата с переменной n8n
- `goal` - Секция целей агента
- `primary` - Основная цель
- `secondary` - Вторичная цель
- `instructions` - Секция инструкций
- `instruction` - Отдельная инструкция
- `tools` - Секция инструментов
- `tool` - Отдельный инструмент
- `constraints` - Секция ограничений
- `constraint` - Отдельное ограничение

#### Контекст выполнения
- `executioncontext` - Контекст выполнения агента
- `environment` - Окружение выполнения (production/staging/development)
- `timezone` - Часовой пояс для выполнения задач
- `language` - Язык для обработки задач

#### Обработка ошибок
- `errorhandling` - Настройки обработки ошибок
- `retrystrategy` - Стратегия повторных попыток (exponential/linear/fixed)
- `maxretries` - Максимальное количество повторных попыток
- `fallbackaction` - Действие при исчерпании попыток

#### Валидация
- `validation` - Правила валидации данных
- `requiredfields` - Список обязательных полей
- `field` - Отдельное обязательное поле
- `formatrules` - Правила форматирования полей
- `rule` - Правило форматирования для поля

#### Логирование
- `logging` - Настройки логирования
- `loglevel` - Уровень логирования (debug/info/warn/error)
- `includecontext` - Включить контекст в логи
- `sensitivefields` - Список чувствительных полей

#### Безопасность
- `security` - Настройки безопасности
- `authentication` - Настройки аутентификации
- `authtype` - Тип аутентификации (jwt/basic/oauth)
- `expiration` - Время жизни токена в секундах
- `ratelimit` - Ограничения по количеству запросов
- `requests` - Максимальное количество запросов
- `period` - Период ограничения в секундах

#### Интеграции
- `integrations` - Настройки интеграций с внешними сервисами
- `service` - Конфигурация внешнего сервиса
- `provider` - Провайдер сервиса
- `config` - Конфигурация сервиса
- `host` - Хост сервиса
- `port` - Порт сервиса

#### Метрики
- `metrics` - Настройки метрик и мониторинга
- `track` - Список отслеживаемых метрик
- `metric` - Отдельная метрика для отслеживания
- `thresholds` - Пороговые значения для метрик
- `threshold` - Пороговое значение для метрики

#### Версионирование
- `versioning` - Информация о версионировании
- `currentversion` - Текущая версия
- `deprecated` - Флаг устаревания
- `migrationguide` - Ссылка на руководство по миграции

### Автодополнение

При вводе `<` будут предложены доступные теги, сгруппированные по категориям:
- Основные теги агента
- Контекст выполнения
- Обработка ошибок
- Валидация
- Логирование
- Безопасность
- Интеграции
- Метрики
- Версионирование

Каждый тег имеет подробное описание на русском языке.

### Форматирование

Для форматирования документа используйте команду "Format Document" (Shift+Alt+F).

## Пример использования

### Базовый шаблон агента

```xml
<Agentinstructions>
    <Role>
        <Name>Ассистент по работе с данными</Name>
        <Description>Ассистент, который помогает анализировать и обрабатывать данные</Description>
        <currentDate>{{$now}}</currentDate>
    </Role>
    <Goal>
        <Primary>Анализировать данные и предоставлять полезные выводы</Primary>
    </Goal>
    <Instructions>
        <Instruction>Анализируй данные внимательно и находи закономерности</Instruction>
    </Instructions>
</Agentinstructions>
```

### Расширенный шаблон агента с дополнительными секциями

```xml
<Agentinstructions>
    <Role>
        <Name>Ассистент по работе с данными</Name>
        <Description>Ассистент, который помогает анализировать и обрабатывать данные</Description>
        <currentDate>{{$now}}</currentDate>
    </Role>
    <Goal>
        <Primary>Анализировать данные и предоставлять полезные выводы</Primary>
        <Secondary>Визуализировать данные в понятном формате</Secondary>
    </Goal>
    <Instructions>
        <Instruction>Анализируй данные внимательно и находи закономерности</Instruction>
        <Instruction>Предоставляй выводы в структурированном виде</Instruction>
    </Instructions>
    <ExecutionContext>
        <Environment>production</Environment>
        <Timezone>UTC</Timezone>
        <Language>ru</Language>
    </ExecutionContext>
    <ErrorHandling>
        <RetryStrategy>exponential</RetryStrategy>
        <MaxRetries>3</MaxRetries>
        <FallbackAction>notify_admin</FallbackAction>
    </ErrorHandling>
    <Validation>
        <RequiredFields>
            <Field>data_source</Field>
            <Field>analysis_type</Field>
        </RequiredFields>
        <FormatRules>
            <Rule field="data_source">^[a-zA-Z0-9_]+$</Rule>
        </FormatRules>
    </Validation>
    <Logging>
        <Level>info</Level>
        <IncludeContext>true</IncludeContext>
        <SensitiveFields>
            <Field>api_key</Field>
        </SensitiveFields>
    </Logging>
    <Security>
        <Authentication>
            <Type>jwt</Type>
            <Expiration>3600</Expiration>
        </Authentication>
        <RateLimit>
            <Requests>100</Requests>
            <Period>60</Period>
        </RateLimit>
    </Security>
    <Integrations>
        <Service name="database">
            <Provider>postgres</Provider>
            <Config>
                <Host>localhost</Host>
                <Port>5432</Port>
            </Config>
        </Service>
    </Integrations>
    <Metrics>
        <Track>
            <Metric>response_time</Metric>
            <Metric>error_rate</Metric>
        </Track>
        <Thresholds>
            <Threshold metric="response_time">5000</Threshold>
        </Thresholds>
    </Metrics>
    <Versioning>
        <Current>1.0.0</Current>
        <Deprecated>false</Deprecated>
        <MigrationGuide>https://example.com/migration-guide</MigrationGuide>
    </Versioning>
</Agentinstructions>
```

## Лицензия

MIT

## Поддержка

Если у вас возникли проблемы или есть предложения по улучшению, создайте issue в репозитории проекта. 