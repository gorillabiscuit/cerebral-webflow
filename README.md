# NFTfi Marketing Site - Single Scroll

A single page scroller using Three.js elements and scroll capture libraries, managed with Taskmaster.

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your API keys:
   - **Required**: At least one AI provider API key
   - **Recommended**: `ANTHROPIC_API_KEY` and `PERPLEXITY_API_KEY`

### 2. Install Taskmaster

```bash
npm install -g task-master-ai
```

### 3. Configure Taskmaster Models

```bash
# View current configuration
task-master models

# Run interactive setup
task-master models --setup

# Or set models manually
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research sonar-pro
task-master models --set-fallback claude-3-5-sonnet-20241022
```

### 4. Test Taskmaster

```bash
# Test with a simple task
task-master create --prompt "Create a basic HTML structure for a single page scroller"
```

## Project Structure

- `.taskmaster/config.json` - Taskmaster configuration
- `env.example` - Environment variables template
- `.env` - Your local environment variables (not in git)

## Next Steps

1. Add your API keys to `.env`
2. Test Taskmaster with a simple task
3. Use Taskmaster to break down your PRD into tasks
4. Begin implementing the Three.js single page scroller

## API Keys Required

- **Anthropic API Key**: For Claude models (recommended)
- **Perplexity API Key**: For research features (highly recommended)
- **Other providers**: OpenAI, Google, Mistral, etc. (optional) 