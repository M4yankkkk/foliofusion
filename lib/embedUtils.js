/**
 * Embed Utilities - Detect and generate embeds for URLs
 * Supports: Figma, YouTube, GitHub, and generic Open Graph previews
 */

export function detectEmbedType(url) {
  if (!url) return null

  const urlLower = url.toLowerCase()

  // Figma
  if (urlLower.includes('figma.com/file/') || urlLower.includes('figma.com/proto/')) {
    return 'figma'
  }

  // YouTube
  if (urlLower.includes('youtube.com/watch') || urlLower.includes('youtu.be/')) {
    return 'youtube'
  }

  // GitHub
  if (urlLower.includes('github.com/')) {
    return 'github'
  }

  // Default to link preview
  return 'link'
}

export function getFigmaEmbedUrl(url) {
  try {
    const urlObj = new URL(url)
    // Extract file ID from Figma URL
    const pathParts = urlObj.pathname.split('/')
    const fileIndex = pathParts.indexOf('file') || pathParts.indexOf('proto')
    if (fileIndex !== -1 && pathParts[fileIndex + 1]) {
      const fileId = pathParts[fileIndex + 1]
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
    }
  } catch (e) {
    console.error('Invalid Figma URL:', e)
  }
  return null
}

export function getYouTubeEmbedUrl(url) {
  try {
    const urlObj = new URL(url)
    let videoId = null

    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v')
    }
    // youtu.be/VIDEO_ID
    else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  } catch (e) {
    console.error('Invalid YouTube URL:', e)
  }
  return null
}

export function getGitHubRepoInfo(url) {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    
    // github.com/owner/repo
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
        fullName: `${pathParts[0]}/${pathParts[1]}`
      }
    }
  } catch (e) {
    console.error('Invalid GitHub URL:', e)
  }
  return null
}

export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}
