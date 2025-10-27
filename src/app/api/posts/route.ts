import { postsSeed } from '@/data/posts.seed';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page') || 1);
  const postsPerPage = Number(searchParams.get('limit') || 6);
  

  let filteredPosts = postsSeed.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === 'newest') {
    filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } else if (sortBy === 'views') {
    filteredPosts.sort((a, b) => b.views - a.views);
  } else if (sortBy === 'likes') {
    filteredPosts.sort((a, b) => b.likes - a.likes);
  }

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return NextResponse.json({
    success: true,
    data: paginatedPosts,
    totalPages: totalPages,
  });
}
