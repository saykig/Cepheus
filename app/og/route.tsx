import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

type OgKind = 'home' | 'essay' | 'essays' | 'writ'

const FALLBACKS: Record<OgKind, { title: string; description: string; label: string }> = {
  home: {
    title: 'Cepheus',
    description: 'Bridging the gap between policy and technology.',
    label: 'INSTITUTIONAL INTELLIGENCE',
  },
  essays: {
    title: 'Essays',
    description: 'Notes on technology, policy, and institutional responsibility.',
    label: 'CEPHEUS ESSAYS',
  },
  essay: {
    title: 'What We Owe to Each Other',
    description: 'What technology and policy can offer to humanity.',
    label: 'CEPHEUS ESSAY',
  },
  writ: {
    title: 'Writ',
    description: 'A domain-specific language for global affairs.',
    label: 'CEPHEUS PROJECT',
  },
}

function readKind(value: string | null): OgKind {
  return value === 'essay' || value === 'essays' || value === 'writ'
    ? value
    : 'home'
}

function readText(value: string | null, fallback: string, limit: number) {
  const normalized = value?.replace(/\s+/g, ' ').trim()
  return normalized ? normalized.slice(0, limit) : fallback
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const kind = readKind(url.searchParams.get('kind'))
  const fallback = FALLBACKS[kind]
  const title = readText(url.searchParams.get('title'), fallback.title, 72)
  const description = readText(
    url.searchParams.get('description'),
    fallback.description,
    150,
  )

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#102b2d',
          color: '#f5f0e4',
          padding: '62px 74px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: 610,
            height: 610,
            borderRadius: 999,
            top: -255,
            right: -126,
            backgroundColor: 'rgba(99, 138, 118, 0.22)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: 999,
            top: 226,
            right: 110,
            backgroundColor: 'rgba(105, 143, 130, 0.12)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: 450,
            height: 88,
            borderRadius: 999,
            right: -82,
            bottom: 82,
            transform: 'rotate(-18deg)',
            backgroundColor: 'rgba(185, 177, 131, 0.1)',
          }}
        />

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 54,
            left: 62,
            width: 150,
            height: 150,
            border: '1px solid rgba(214, 224, 201, 0.4)',
            borderRadius: 999,
          }}
        />
        {[12, 27, 43, 59, 75, 91, 108, 124, 140].map((offset, index) => (
          <div
            key={offset}
            style={{
              display: 'flex',
              position: 'absolute',
              top: 48 + offset * 0.28,
              left: 46 + offset,
              width: index === 6 ? 15 : 8,
              height: index === 6 ? 15 : 8,
              borderRadius: 999,
              backgroundColor: index === 6 ? '#a9c1aa' : 'rgba(213, 224, 204, 0.8)',
            }}
          />
        ))}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                marginLeft: 154,
                fontSize: 32,
                letterSpacing: '-0.02em',
                color: '#f5f0e4',
              }}
            >
              cepheus
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Arial, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#c6d3c2',
              }}
            >
              {fallback.label}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '76%',
              gap: 22,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 56,
                height: 2,
                backgroundColor: '#a9c1aa',
              }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: kind === 'home' ? 92 : 74,
                fontWeight: 400,
                letterSpacing: '-0.035em',
                lineHeight: 1.04,
                color: '#f8f4e9',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                width: '86%',
                fontFamily: 'Georgia, serif',
                fontSize: 25,
                lineHeight: 1.35,
                color: '#d3dacb',
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: 22,
              borderTop: '1px solid rgba(207, 220, 197, 0.34)',
              fontFamily: 'Arial, sans-serif',
              fontSize: 15,
              letterSpacing: '0.11em',
              color: '#bac9b5',
            }}
          >
            <div style={{ display: 'flex' }}>MAPPING THE GAP</div>
            <div style={{ display: 'flex' }}>ALIGNING OUR FUTURE</div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
