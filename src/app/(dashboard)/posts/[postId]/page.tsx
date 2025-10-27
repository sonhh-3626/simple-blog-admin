import { notFound } from 'next/navigation';

import CategoryBadge from '@/app/components/badge/CategoryBadge';
import ShareSection from '@/app/components/post-detail/ShareSection';
import RelatedPosts from '@/app/components/post-detail/RelatedPosts';
import TableOfContents from '@/app/components/post-detail/TableOfContents';
import Tags from '@/app/components/post-detail/Tags';
import MetaInfo from '@/app/components/post-detail/MetaInfo';
import AuthorInfo from '@/app/components/post-detail/AuthorInfo';
import ContentSection from '@/app/components/post-detail/ContentSection';
import { postsSeed } from '@/data/posts.seed';

interface PostDetailPageProps {
  params: Promise<{ postId: number }>
}

export default async function PostDetailPage({
  params
}: PostDetailPageProps) {
  const id = (await params).postId
  const post = postsSeed.find((p) => p.postId === String(id || ''));
  // sử dụng fetch và params.postId để lấy chi tiết một bài viết.
  if (!post) {
    notFound();
  }

  const relatedPosts = postsSeed
    .filter((p) => p.category === post.category && p.postId !== post.postId)
    .slice(0, 3);

  return (
    <article className="pb-16">
      <div className="mx-auto pt-8 pb-12 bg-white">
        <CategoryBadge title={post.category} />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        <MetaInfo
          publishedAt={post.publishedAt}
          readTime={post.readTime}
          views={post.views}
          likes={post.likes}
        />

        <AuthorInfo author={post.author} />
      </div>

      <div className="w-full h-[500px] mb-10">
        <img
          src={post.coverImage}
          alt={post.title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4">
          <ContentSection content={post.content} />
          <Tags tags={post.tags} />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-8 space-y-8">
            <TableOfContents markdown={post.content} />
            <RelatedPosts relatedPosts={relatedPosts} />
            <ShareSection />
          </div>
        </aside>
      </div>
    </article>
  );
}
