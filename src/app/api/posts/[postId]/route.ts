import { NextResponse } from 'next/server';
import { postsSeed } from '@/data/posts.seed';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = (await params);

    const post = postsSeed.find((p) => p.postId === postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const relatedPosts = postsSeed
      .filter((p) => p.category === post.category && p.postId !== post.postId)
      .slice(0, 3);

    return NextResponse.json({
      data: [
        post,
        relatedPosts,
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
