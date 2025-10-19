# Anything Goes

A story-writing app inspired by Infinite Craft where users discover story elements by combining base elements together. Make writing feel like play and discovery rather than work.

## Features

- **6 Base Systems** with 48 total elements:
  - Emotional Chemistry (Joy, Fear, Anger, Desire, Shame, Pride, Loneliness, Hope)
  - Story Particles (A glance, A door, A lie, Rain, A name, Silence, A scar, Running)
  - Character Fusion (Ambitious, Wounded, Cheerful, Secretive, Loyal, Rebellious, Careful, Wild)
  - Trope Alchemy (Fake Dating, Enemy, Amnesia, Prophecy, Heist, Masquerade, Deadline, Secret Identity)
  - Sensory World Building (Smoke, Silk, Iron, Honey, Thunder, Shadow, Salt, Starlight)
  - Momentum Engine (Chase, Hide, Reveal, Betray, Protect, Destroy, Create, Wait)

- **Cross-System Combinations**: Combine elements from different systems for unexpected results
- **AI-Powered Discovery**: Uses OpenAI to generate unique combinations
- **Persistent Discoveries**: Your discoveries are saved locally
- **Tiered Elements**: Higher-tier combinations emerge from combining discovered elements

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Anthropic API key:**
   - Copy `.env.example` to `.env.local`
   - Add your Anthropic API key to `.env.local`
   - Get an API key at: https://console.anthropic.com/

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. Click any element from the Base Systems panel
2. Click a second element to combine it with
3. Press the "Combine" button
4. Discover a new story element!
5. Combine discovered elements with base elements or other discoveries
6. Build increasingly complex story structures

## Examples

- **Same-system**: Joy + Fear = "Nervous Excitement"
- **Cross-system**: Fear + Smoke = "Suffocating Dread"
- **Weird combinations work too**: Ambitious + Rain = "Washing Away the Ladder"

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Vercel AI SDK with Anthropic Claude
- **Deployment**: Ready for Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
