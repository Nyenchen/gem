export function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube: watch?v=ID, youtu.be/ID, shorts/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Bilibili: /video/BVxxxxxx or /video/avxxxxxx
  const bvMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (bvMatch) {
    return `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}&page=1&high_quality=1&danmaku=0`;
  }
  const avMatch = url.match(/bilibili\.com\/video\/av(\d+)/);
  if (avMatch) {
    return `https://player.bilibili.com/player.html?aid=${avMatch[1]}&page=1&high_quality=1&danmaku=0`;
  }

  return null;
}

export function getVideoPlatform(url: string): 'youtube' | 'bilibili' | null {
  if (!url) return null;
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('bilibili')) return 'bilibili';
  return null;
}
