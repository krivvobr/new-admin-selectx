# Documentação do Schema do Banco de Dados - SelectX

**Projeto:** selectx  
**ID do Projeto:** odrkeyioeowsavojszsq  
**Região:** us-east-2  
**Status:** ACTIVE_HEALTHY  
**Versão do PostgreSQL:** 17.6.1.042  
**Data de Criação:** 11/11/2025

---

## Tabelas do Banco de Dados

### 1. `properties`

**Schema:** public  
**RLS Habilitado:** Não  
**Número de Registros:** 1  
**Chaves Primárias:** `id`

#### Colunas

| Nome | Tipo de Dados | Formato | Opções | Valor Padrão | Descrição |
|------|---------------|---------|--------|--------------|-----------|
| `id` | uuid | uuid | updatable | `gen_random_uuid()` | Identificador único |
| `code` | text | text | updatable, unique | - | Código único da propriedade |
| `title` | text | text | updatable | - | Título da propriedade |
| `description` | text | text | nullable, updatable | - | Descrição da propriedade |
| `type` | USER-DEFINED | property_type | updatable | - | Tipo da propriedade |
| `purpose` | USER-DEFINED | property_purpose | updatable | - | Finalidade da propriedade |
| `price` | numeric | numeric | updatable | - | Preço da propriedade |
| `address` | text | text | nullable, updatable | - | Endereço da propriedade |
| `area` | numeric | numeric | nullable, updatable | - | Área em m² |
| `bedrooms` | integer | int4 | nullable, updatable | - | Número de quartos |
| `bathrooms` | integer | int4 | nullable, updatable | - | Número de banheiros |
| `parking` | integer | int4 | nullable, updatable | - | Número de vagas de estacionamento |
| `furnished` | boolean | bool | nullable, updatable | `false` | Se está mobiliada |
| `financing` | boolean | bool | nullable, updatable | `false` | Se aceita financiamento |
| `floor` | integer | int4 | nullable, updatable | - | Andar |
| `status` | USER-DEFINED | property_status | nullable, updatable | `'disponivel'::property_status` | Status da propriedade |
| `created_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de criação |
| `updated_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de atualização |
| `city_id` | uuid | uuid | nullable, updatable | - | Referência à cidade |
| `suites` | smallint | int2 | nullable, updatable | - | Número de suítes |
| `images` | jsonb | jsonb | nullable, updatable | - | Array de imagens em JSON |
| `cover_image` | text | text | nullable, updatable | - | URL da imagem de capa |

#### Enums

**property_type:**
- `apartamento`
- `casa`
- `cobertura`
- `comercial`
- `terreno`

**property_purpose:**
- `venda`
- `locacao`

**property_status:**
- `disponivel`
- `vendido`
- `alugado`
- `inativo`

#### Chaves Estrangeiras

- `properties_city_id_fkey`: `city_id` → `public.cities.id`
- Referenciada por: `public.leads.property_id` → `public.properties.id`

---

### 2. `leads`

**Schema:** public  
**RLS Habilitado:** Não  
**Número de Registros:** 2  
**Chaves Primárias:** `id`

#### Colunas

| Nome | Tipo de Dados | Formato | Opções | Valor Padrão | Descrição |
|------|---------------|---------|--------|--------------|-----------|
| `id` | uuid | uuid | updatable | `gen_random_uuid()` | Identificador único |
| `name` | text | text | updatable | - | Nome do lead |
| `phone` | text | text | nullable, updatable | - | Telefone do lead |
| `email` | text | text | nullable, updatable | - | Email do lead |
| `property_id` | uuid | uuid | nullable, updatable | - | Referência à propriedade |
| `status` | USER-DEFINED | lead_status | nullable, updatable | `'new'::lead_status` | Status do lead |
| `created_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de criação |
| `notes` | text | text | nullable, updatable | - | Notas sobre o lead |
| `message` | text | text | nullable, updatable | - | Mensagem do lead |
| `property_url` | text | text | nullable, updatable | - | URL da propriedade relacionada |

#### Enums

**lead_status:**
- `new`
- `contacted`

#### Chaves Estrangeiras

- `leads_property_id_fkey`: `property_id` → `public.properties.id`

---

### 3. `profiles`

**Schema:** public  
**RLS Habilitado:** Sim  
**Número de Registros:** 1  
**Chaves Primárias:** `id`

#### Colunas

| Nome | Tipo de Dados | Formato | Opções | Valor Padrão | Descrição |
|------|---------------|---------|--------|--------------|-----------|
| `id` | uuid | uuid | updatable | - | Identificador único (referência ao auth.users) |
| `full_name` | text | text | nullable, updatable | - | Nome completo do usuário |
| `phone` | text | text | nullable, updatable | - | Telefone do usuário |
| `role` | USER-DEFINED | user_role | nullable, updatable | `'viewer'::user_role` | Papel do usuário |
| `created_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de criação |

#### Enums

**user_role:**
- `admin`
- `agent`
- `viewer`

#### Chaves Estrangeiras

- `profiles_id_fkey`: `id` → `auth.users.id`

---

### 4. `cities`

**Schema:** public  
**RLS Habilitado:** Não  
**Número de Registros:** 6  
**Chaves Primárias:** `id`

#### Colunas

| Nome | Tipo de Dados | Formato | Opções | Valor Padrão | Descrição |
|------|---------------|---------|--------|--------------|-----------|
| `id` | uuid | uuid | updatable | `gen_random_uuid()` | Identificador único |
| `name` | text | text | updatable | - | Nome da cidade |
| `state` | text | text | updatable | - | Estado (UF) |
| `created_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de criação |

#### Chaves Estrangeiras

- Referenciada por: `public.neighborhoods.city_id` → `public.cities.id`
- Referenciada por: `public.properties.city_id` → `public.cities.id`

---

### 5. `neighborhoods`

**Schema:** public  
**RLS Habilitado:** Não  
**Número de Registros:** 0  
**Chaves Primárias:** `id`

#### Colunas

| Nome | Tipo de Dados | Formato | Opções | Valor Padrão | Descrição |
|------|---------------|---------|--------|--------------|-----------|
| `id` | uuid | uuid | updatable | `gen_random_uuid()` | Identificador único |
| `city_id` | uuid | uuid | updatable | - | Referência à cidade |
| `name` | text | text | updatable | - | Nome do bairro |
| `created_at` | timestamp with time zone | timestamptz | nullable, updatable | `now()` | Data de criação |

#### Chaves Estrangeiras

- `neighborhoods_city_id_fkey`: `city_id` → `public.cities.id`

---

## Resumo das Relações

### Hierarquia de Dependências

```
cities (raiz)
  ├── properties (via city_id)
  └── neighborhoods (via city_id)

properties
  └── leads (via property_id)

auth.users
  └── profiles (via id)
```

### Tabelas por RLS

**Com RLS Habilitado:**
- `profiles`

**Sem RLS:**
- `properties`
- `leads`
- `cities`
- `neighborhoods`

---

## Tipos Customizados (Enums)

### `property_type`
- `apartamento`
- `casa`
- `cobertura`
- `comercial`
- `terreno`

### `property_purpose`
- `venda`
- `locacao`

### `property_status`
- `disponivel`
- `vendido`
- `alugado`
- `inativo`

### `lead_status`
- `new`
- `contacted`

### `user_role`
- `admin`
- `agent`
- `viewer`

---

## Estatísticas Gerais

- **Total de Tabelas:** 5
- **Total de Colunas:** 37
- **Tabelas com RLS:** 1
- **Tabelas sem RLS:** 4
- **Total de Registros:** 10 (1 + 2 + 1 + 6 + 0)

---

*Documento gerado automaticamente via Supabase SelectX MCP*

