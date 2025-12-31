'use client'

import { detectEmbedType, getFigmaEmbedUrl, getYouTubeEmbedUrl, getGitHubRepoInfo } from '@/lib/embedUtils'
import { useState, useEffect } from 'react'

export default function ProjectEmbed({ url, name }) {
  const [embedType, setEmbedType] = useState(null)
  const [embedUrl, setEmbedUrl] = useState(null)
  const [githubData, setGithubData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const type = detectEmbedType(url)
    setEmbedType(type)

    if (type === 'figma') {
      setEmbedUrl(getFigmaEmbedUrl(url))
    } else if (type === 'youtube') {
      setEmbedUrl(getYouTubeEmbedUrl(url))
    } else if (type === 'github') {
      const repoInfo = getGitHubRepoInfo(url)
      if (repoInfo) {
        fetchGithubData(repoInfo.owner, repoInfo.repo)
      }
    }

    setLoading(false)
  }, [url])

  const fetchGithubData = async (owner, repo) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (res.ok) {
        const data = await res.json()
        setGithubData({
          name: data.name,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          language: data.language,
          url: data.html_url
        })
      }
    } catch (error) {
      console.error('GitHub API error:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading preview...</p>
      </div>
    )
  }

  // Figma Embed
  if (embedType === 'figma' && embedUrl) {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={embedUrl}
          className="w-full h-[450px]"
          allowFullScreen
        />
      </div>
    )
  }

  // YouTube Embed
  if (embedType === 'youtube' && embedUrl) {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={embedUrl}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // GitHub Repo Card
  if (embedType === 'github' && githubData) {
    return (
      <a
        href={githubData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all bg-white"
      >
        <div className="flex items-start gap-3">
          <svg className="w-8 h-8 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{githubData.name}</h3>
            {githubData.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{githubData.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              {githubData.language && (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  {githubData.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {githubData.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {githubData.forks.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </a>
    )
  }

  // Fallback: Simple link card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all bg-white"
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-blue-600 truncate mt-1">{url}</p>
        </div>
      </div>
    </a>
  )
}
