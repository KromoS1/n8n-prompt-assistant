# N8N Prompt Assistant

VSCode and Cursor extension that helps write prompts for AI agents in the n8n service.

## Features

- **File Support**: `.prompt.xml`, `.n8n`
- **Snippets**: Ready-made templates for creating prompts and agents
- **Autocompletion**: Tag and attribute hints while typing
- **Syntax Highlighting**: Improved readability of XML structure
- **Formatting**: Automatic XML document formatting

## Usage

### Creating a New File

1. Create a new file with extension `.prompt.xml` or `.n8n`
2. Start typing tags or use snippets

### Snippets

Available snippets:

#### Basic Templates
- `agent` - Basic agent template
- `agentfull` - Full agent template
- `xml` - XML declaration (optional)
- `database` - Database schema template
- `example` - Interaction example template

#### Agent Sections
- `agentinstructions` - Root element for agent instructions
- `role` - Agent role section
- `name` - Agent name
- `description` - Agent description
- `currentdate` - Current date with n8n variable
- `goal` - Agent goals section
- `primary` - Primary goal
- `secondary` - Secondary goal
- `instructions` - Instructions section
- `instruction` - Individual instruction
- `tools` - Tools section
- `tool` - Individual tool
- `constraints` - Constraints section
- `constraint` - Individual constraint

#### Database Schema
- `database` - Root element for database configuration
- `table` - Table description
- `columns` - Table columns section
- `column` - Individual column description
- `type` - Column data type
- `constraints` - Column constraints
- `primarykey` - Primary key configuration
- `foreignkey` - Foreign key configuration
- `index` - Index configuration
- `relations` - Table relations section
- `relation` - Individual relation description

#### Examples
- `examples` - Section with interaction examples
- `example` - Individual interaction example
- `userinput` - User input in the example
- `agentoutput` - Agent response in the example
- `context` - Additional context for the example
- `notes` - Notes about the example

#### Execution Context
- `executioncontext` - Agent execution context
- `environment` - Execution environment (production/staging/development)
- `timezone` - Timezone for task execution
- `language` - Language for task processing

#### Error Handling
- `errorhandling` - Error handling settings
- `retrystrategy` - Retry strategy (exponential/linear/fixed)
- `maxretries` - Maximum number of retries
- `fallbackaction` - Action when retries are exhausted

#### Validation
- `validation` - Data validation rules
- `requiredfields` - List of required fields
- `field` - Individual required field
- `formatrules` - Field formatting rules
- `rule` - Formatting rule for field

#### Logging
- `logging` - Logging settings
- `loglevel` - Logging level (debug/info/warn/error)
- `includecontext` - Include context in logs
- `sensitivefields` - List of sensitive fields

#### Security
- `security` - Security settings
- `authentication` - Authentication settings
- `authtype` - Authentication type (jwt/basic/oauth)
- `expiration` - Token lifetime in seconds
- `ratelimit` - Request rate limits
- `requests` - Maximum number of requests
- `period` - Limit period in seconds

#### Integrations
- `integrations` - External service integration settings
- `service` - External service configuration
- `provider` - Service provider
- `config` - Service configuration
- `host` - Service host
- `port` - Service port

#### Metrics
- `metrics` - Metrics and monitoring settings
- `track` - List of tracked metrics
- `metric` - Individual metric to track
- `thresholds` - Metric thresholds
- `threshold` - Threshold for metric

#### Versioning
- `versioning` - Versioning information
- `currentversion` - Current version
- `deprecated` - Deprecation flag
- `migrationguide` - Link to migration guide

### Autocompletion

When typing `<`, available tags will be suggested, grouped by categories:
- Basic agent tags
- Database schema
- Examples
- Execution context
- Error handling
- Validation
- Logging
- Security
- Integrations
- Metrics
- Versioning

Each tag has a detailed description in English.

### Formatting

Use the "Format Document" command (Shift+Alt+F) to format the document.

## Usage Example

### Basic Agent Template

```xml
<Agentinstructions>
    <Role>
        <Name>Data Processing Assistant</Name>
        <Description>Assistant that helps analyze and process data</Description>
        <currentDate>{{$now}}</currentDate>
    </Role>
    <Goal>
        <Primary>Analyze data and provide useful insights</Primary>
    </Goal>
    <Instructions>
        <Instruction>Carefully analyze data and find patterns</Instruction>
    </Instructions>
</Agentinstructions>
```

### Database Schema Example

```xml
<Database>
    <Table>
        <Name>users</Name>
        <Description>User accounts and profiles</Description>
        <Columns>
            <Column>
                <Name>id</Name>
                <Type>INTEGER</Type>
                <Constraints>
                    <PrimaryKey>true</PrimaryKey>
                </Constraints>
            </Column>
            <Column>
                <Name>email</Name>
                <Type>VARCHAR(255)</Type>
                <Constraints>
                    <Index>true</Index>
                </Constraints>
            </Column>
        </Columns>
        <Relations>
            <Relation>
                <Type>hasMany</Type>
                <Target>orders</Target>
            </Relation>
        </Relations>
    </Table>
</Database>
```

### Interaction Example

```xml
<Examples>
    <Example>
        <Context>User needs help with data analysis</Context>
        <UserInput>How can I analyze sales data from the last quarter?</UserInput>
        <AgentOutput>I'll help you analyze the sales data. First, let's load the data using pandas...</AgentOutput>
        <Notes>This example demonstrates basic data analysis workflow</Notes>
    </Example>
</Examples>
```

### Extended Agent Template with Additional Sections

```xml
<Agentinstructions>
    <Role>
        <Name>Data Processing Assistant</Name>
        <Description>Assistant that helps analyze and process data</Description>
        <currentDate>{{$now}}</currentDate>
    </Role>
    <Goal>
        <Primary>Analyze data and provide useful insights</Primary>
        <Secondary>Visualize data in a clear format</Secondary>
    </Goal>
    <Instructions>
        <Instruction>Carefully analyze data and find patterns</Instruction>
        <Instruction>Provide insights in a structured format</Instruction>
    </Instructions>
    <ExecutionContext>
        <Environment>production</Environment>
        <Timezone>UTC</Timezone>
        <Language>en</Language>
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

## License

MIT

## Support

If you encounter any issues or have suggestions for improvement, please create an issue in the project repository. 