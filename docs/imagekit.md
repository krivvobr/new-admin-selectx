# Guia Completo: Upload de Imagens com ImageKit em Vite

Este documento explica passo a passo como implementar o sistema de upload de imagens usando ImageKit em um projeto Vite + React, baseado na implementação funcional do projeto atual.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do ImageKit](#configuração-do-imagekit)
3. [Instalação de Dependências](#instalação-de-dependências)
4. [Configuração do Supabase Edge Function](#configuração-do-supabase-edge-function)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Criação do Componente React](#criação-do-componente-react)
7. [Como Usar o Componente](#como-usar-o-componente)
8. [Estrutura de Arquivos](#estrutura-de-arquivos)
9. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, você precisa ter:

- ✅ Conta no [ImageKit](https://imagekit.io/) (gratuita disponível)
- ✅ Projeto Supabase configurado (para a Edge Function de autenticação)
- ✅ Projeto Vite + React configurado
- ✅ Supabase CLI instalado (para deploy da Edge Function)

---

## Configuração do ImageKit

### 1. Criar Conta e Obter Credenciais

1. Acesse [https://imagekit.io/](https://imagekit.io/) e crie uma conta
2. Após criar a conta, acesse o **Dashboard**
3. Vá em **Settings** → **API Keys**
4. Você precisará de:
   - **Public Key** (formato: `public_xxxxx`)
   - **Private Key** (formato: `private_xxxxx`)
   - **URL Endpoint** (formato: `https://ik.imagekit.io/seu_username`)

⚠️ **IMPORTANTE**: Guarde essas informações com segurança, especialmente a Private Key, pois ela não será exibida novamente.

### 2. Configurar CORS (se necessário)

No ImageKit Dashboard:
- Vá em **Settings** → **Security**
- Configure as origens permitidas para upload (ou deixe em branco para permitir todas)

---

## Instalação de Dependências

No seu projeto Vite, instale a biblioteca do ImageKit:

```bash
npm install imagekitio-react
# ou
yarn add imagekitio-react
# ou
pnpm add imagekitio-react
```

A biblioteca `imagekitio-react` fornece os componentes `IKContext` e `IKUpload` necessários para o upload.

---

## Configuração do Supabase Edge Function

O ImageKit requer autenticação server-side para gerar tokens seguros. Vamos criar uma Edge Function no Supabase para isso.

### 1. Criar a Estrutura de Pastas

Crie a seguinte estrutura no seu projeto:

```
supabase/
└── functions/
    └── imagekit-auth/
        ├── index.ts
        └── README.md (opcional)
```

### 2. Criar o Arquivo `index.ts`

Crie o arquivo `supabase/functions/imagekit-auth/index.ts`:

```typescript
// supabase/functions/imagekit-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get("IMAGEKIT_PUBLIC_KEY");
    const privateKey = Deno.env.get("IMAGEKIT_PRIVATE_KEY");

    if (!publicKey || !privateKey) {
      throw new Error("ImageKit keys not configured");
    }

    // Gerar parâmetros de autenticação
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutos

    const signature = createHmac("sha1", privateKey).update(token + expire).digest("hex");

    const authParams = {
      token,
      expire,
      signature,
    };

    return new Response(JSON.stringify(authParams), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
```

### 3. Configurar Secrets no Supabase

Configure as chaves do ImageKit como secrets no Supabase:

```bash
# Para desenvolvimento local
supabase secrets set IMAGEKIT_PUBLIC_KEY=public_sua_chave_aqui
supabase secrets set IMAGEKIT_PRIVATE_KEY=private_sua_chave_aqui

# Para produção (após fazer login no Supabase CLI)
supabase login
supabase secrets set IMAGEKIT_PUBLIC_KEY=public_sua_chave_aqui --project-ref seu-project-ref
supabase secrets set IMAGEKIT_PRIVATE_KEY=private_sua_chave_aqui --project-ref seu-project-ref
```

### 4. Testar Localmente

```bash
# Iniciar o Supabase localmente
supabase start

# Servir a função localmente
supabase functions serve imagekit-auth
```

A função estará disponível em: `http://localhost:54321/functions/v1/imagekit-auth`

### 5. Deploy para Produção

```bash
supabase functions deploy imagekit-auth
```

Após o deploy, o endpoint será:
```
https://<PROJECT_REF>.functions.supabase.co/imagekit-auth
```

Substitua `<PROJECT_REF>` pelo ID do seu projeto Supabase.

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do seu projeto Vite com as seguintes variáveis:

```env
# ImageKit
VITE_IMAGEKIT_PUBLIC_KEY=public_sua_chave_aqui
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_username

# Endpoint da Edge Function
# Para desenvolvimento local:
VITE_IMAGEKIT_AUTH_ENDPOINT=http://localhost:54321/functions/v1/imagekit-auth

# Para produção (após deploy):
# VITE_IMAGEKIT_AUTH_ENDPOINT=https://<PROJECT_REF>.functions.supabase.co/imagekit-auth

# Supabase (necessário para autenticação na Edge Function)
VITE_SUPABASE_URL=https://seu-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

⚠️ **IMPORTANTE**: 
- O arquivo `.env.local` não deve ser commitado no Git (adicione ao `.gitignore`)
- Para produção, use variáveis de ambiente do seu provedor de hospedagem

---

## Criação do Componente React

Crie o componente `ImageKitUpload.tsx`:

### Arquivo: `src/components/ImageKitUpload.tsx`

```typescript
import { Upload } from "lucide-react"; // ou outro ícone de sua preferência
import { IKContext, IKUpload } from "imagekitio-react";

// Configurações do ImageKit (lidas das variáveis de ambiente)
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

// Função de autenticação que chama a Edge Function
const authenticator = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${(error as Error).message}`);
  }
};

interface ImageKitUploadProps {
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
}

const ImageKitUpload = ({ onSuccess, onError }: ImageKitUploadProps) => {
  const handleUploadClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <label
          onClick={handleUploadClick}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer block"
        >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Clique para fazer upload ou arraste as imagens
          </p>
          <p className="text-xs text-muted-foreground">
            Mínimo de 5 imagens, máximo de 20
          </p>
        </label>
        <IKUpload
          onSuccess={(res) => onSuccess(res.url)}
          onError={onError}
          style={{ display: 'none' }}
        />
      </IKContext>
    </div>
  );
};

export default ImageKitUpload;
```

### Observações sobre o Componente:

1. **IKContext**: Fornece o contexto do ImageKit para todos os componentes filhos
2. **IKUpload**: Componente que faz o upload real (escondido com `display: 'none'`)
3. **authenticator**: Função assíncrona que retorna `{ signature, expire, token }` para autenticação
4. **onSuccess**: Callback chamado quando o upload é bem-sucedido, recebe a URL da imagem
5. **onError**: Callback chamado quando há erro no upload

### Personalização do Estilo

O componente usa classes do Tailwind CSS. Se você não usa Tailwind, adapte os estilos:

```typescript
// Exemplo sem Tailwind
<label
  onClick={handleUploadClick}
  style={{
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'block'
  }}
>
  {/* conteúdo */}
</label>
```

---

## Como Usar o Componente

### Exemplo Básico

```typescript
import ImageKitUpload from "@/components/ImageKitUpload";
import { useState } from "react";

function MyComponent() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageKitUpload
      onSuccess={(url) => {
        setImages((prev) => [...prev, url]);
        console.log("Imagem enviada:", url);
      }}
      onError={(error) => {
        console.error("Erro no upload:", error);
        alert("Erro ao fazer upload da imagem");
      }}
    />
  );
}
```

### Exemplo Completo com Validação e Preview

```typescript
import ImageKitUpload from "@/components/ImageKitUpload";
import { useState } from "react";
import { toast } from "sonner"; // ou sua biblioteca de toast

function PropertyForm() {
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");

  return (
    <div>
      <ImageKitUpload
        onSuccess={(url) => {
          // Validação de quantidade
          if (images.length >= 20) {
            toast.error("Máximo de 20 imagens atingido!");
            return;
          }

          // Primeira imagem vira capa
          if (images.length === 0) {
            setCoverImage(url);
          }

          // Adiciona à lista
          setImages((prev) => [...prev, url]);
          toast.success("Imagem enviada com sucesso!");
        }}
        onError={(error) => {
          console.error(error);
          toast.error("Erro ao fazer upload da imagem.");
        }}
      />

      {/* Preview das imagens */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Imagem ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <button
              onClick={() => {
                setImages(images.filter((_, i) => i !== index));
                if (coverImage === url) {
                  setCoverImage(images[1] || "");
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Opções Adicionais do IKUpload

O componente `IKUpload` aceita várias props úteis:

```typescript
<IKUpload
  onSuccess={(res) => onSuccess(res.url)}
  onError={onError}
  style={{ display: 'none' }}
  
  // Opções adicionais:
  fileName="custom-name" // Nome customizado do arquivo
  folder="/minha-pasta" // Pasta no ImageKit
  useUniqueFileName={true} // Usar nome único (recomendado)
  tags={["tag1", "tag2"]} // Tags para organização
  isPrivateFile={false} // Arquivo privado ou público
  customCoordinates="10,10,100,100" // Coordenadas customizadas
  responseFields={["url", "fileId"]} // Campos na resposta
  validateFile={(file) => {
    // Validação customizada
    if (file.size > 5 * 1024 * 1024) {
      return false; // Rejeita arquivos > 5MB
    }
    return true;
  }}
/>
```

---

## Estrutura de Arquivos

Após seguir este guia, sua estrutura de arquivos deve ficar assim:

```
seu-projeto/
├── .env.local                    # Variáveis de ambiente (não commitado)
├── package.json
├── vite.config.ts
├── src/
│   ├── components/
│   │   └── ImageKitUpload.tsx    # Componente de upload
│   └── pages/
│       └── MeuFormulario.tsx     # Exemplo de uso
└── supabase/
    └── functions/
        └── imagekit-auth/
            └── index.ts          # Edge Function de autenticação
```

---

## Troubleshooting

### Erro: "ImageKit keys not configured"

**Causa**: As chaves não foram configuradas como secrets no Supabase.

**Solução**: 
```bash
supabase secrets set IMAGEKIT_PUBLIC_KEY=sua_chave
supabase secrets set IMAGEKIT_PRIVATE_KEY=sua_chave
```

### Erro: "Request failed with status 401"

**Causa**: A chave `VITE_SUPABASE_ANON_KEY` está incorreta ou não está configurada.

**Solução**: Verifique se a variável `VITE_SUPABASE_ANON_KEY` no `.env.local` está correta.

### Erro: "Authentication request failed"

**Causa**: O endpoint da Edge Function está incorreto ou a função não foi deployada.

**Solução**: 
1. Verifique se `VITE_IMAGEKIT_AUTH_ENDPOINT` está correto
2. Para produção, certifique-se de que a função foi deployada:
   ```bash
   supabase functions deploy imagekit-auth
   ```

### Upload não funciona / Sem resposta

**Causa**: Variáveis de ambiente não estão sendo carregadas.

**Solução**: 
1. Certifique-se de que o arquivo é `.env.local` (não `.env`)
2. Reinicie o servidor de desenvolvimento após alterar variáveis de ambiente
3. Verifique se as variáveis começam com `VITE_` (obrigatório no Vite)

### CORS Error

**Causa**: Problema de CORS na Edge Function.

**Solução**: A Edge Function já inclui headers CORS. Se o problema persistir, verifique:
1. Se a função está rodando corretamente
2. Se o endpoint está acessível
3. Se os headers CORS estão corretos no código da função

### Imagens não aparecem após upload

**Causa**: A URL retornada pode estar incorreta ou o ImageKit pode estar bloqueando.

**Solução**: 
1. Verifique no console do navegador a URL retornada
2. Teste a URL diretamente no navegador
3. Verifique as configurações de segurança no ImageKit Dashboard

---

## Recursos Adicionais

- [Documentação oficial do ImageKit React](https://docs.imagekit.io/integration/client-side-libraries/react)
- [Documentação do Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [ImageKit Dashboard](https://imagekit.io/dashboard)

---

## Resumo Rápido

1. ✅ Criar conta no ImageKit e obter credenciais
2. ✅ Instalar `imagekitio-react`
3. ✅ Criar Edge Function `imagekit-auth` no Supabase
4. ✅ Configurar secrets no Supabase
5. ✅ Configurar variáveis de ambiente no `.env.local`
6. ✅ Criar componente `ImageKitUpload.tsx`
7. ✅ Usar o componente no seu formulário

---

**Última atualização**: Baseado na implementação funcional do projeto selectx-admin

