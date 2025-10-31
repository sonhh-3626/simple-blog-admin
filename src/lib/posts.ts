import { notFound } from 'next/navigation';
import { Post } from '../types/post';

export async function fetchPostById(id: string): Promise<{ post: Post, relatedPosts: Post[] }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/posts/${id}`, {});

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch post (status ${response.status})`);
  }

  const json = await response.json();
  return json.data;
}
