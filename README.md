# Backend Lua

Backend do assistente Lua usando Node.js, TypeScript e Fastify. A chave da OpenAI fica somente no servidor.

## Requisitos

- Node.js 20+
- npm 10+

## Instalacao

```bash
cd backend-lua
npm install
copy .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

## Configuracao do `.env`

Edite o arquivo `.env` localmente:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
OPENAI_MODEL=gpt-4.1
PORT=3000
REQUEST_TIMEOUT_MS=30000
CORS_ORIGIN=*
LOG_LEVEL=info
```

Passos obrigatorios:

1. Copie `.env.example` para `.env`
2. Substitua `YOUR_OPENAI_API_KEY_HERE` pela sua chave localmente
3. Nunca envie o arquivo `.env` para o repositorio
4. Nunca coloque a chave no app Android

## Variaveis de ambiente

- `OPENAI_API_KEY`: lida do ambiente pelo backend e usada somente no servidor
- `OPENAI_MODEL`: modelo da OpenAI usado na Responses API. Recomendado: `gpt-4.1`
- `PORT`: porta HTTP do backend
- `REQUEST_TIMEOUT_MS`: timeout da chamada para a OpenAI
- `CORS_ORIGIN`: origem permitida no CORS
- `LOG_LEVEL`: nivel do logger

## Seguranca

- A chave nunca deve ser hardcoded em nenhum arquivo
- O backend le a chave com `process.env.OPENAI_API_KEY`
- Se `OPENAI_API_KEY` estiver ausente, o backend falha de forma controlada no processamento e retorna erro estavel
- Os logs nao exibem a chave completa
- A chave nunca deve ser colocada no app Android

## Rodando em desenvolvimento

```bash
npm run dev
```

## Build e producao

```bash
npm run build
npm start
```

## Testes

```bash
npm test
```

## Endpoints

### Healthcheck

```bash
curl http://localhost:3000/health
```

### Processar assistente

```bash
curl -X POST http://localhost:3000/assistant/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "abrir youtube",
    "context": {
      "locale": "pt-BR",
      "app_version": "1.0.0",
      "device_info": "Android 15",
      "last_user_utterance": "abrir youtube",
      "conversation_summary": "usuario em tela inicial"
    }
  }'
```

## Observacoes

- O app Android nunca recebe a `OPENAI_API_KEY`
- O backend usa Responses API com Structured Outputs
- Se a OpenAI responder algo invalido, o backend converte para `mode=ERROR` controlado
- O endpoint devolve sempre um envelope previsivel no schema do Lua
- O contrato congelado entre app e backend esta documentado em `../docs/assistant-contract.md`
