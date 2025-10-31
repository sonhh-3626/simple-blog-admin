import { notFound } from 'next/navigation';
import Image from 'next/image';

import CategoryBadge from '@/app/components/badge/CategoryBadge';
import ShareSection from '@/app/components/post-detail/ShareSection';
import RelatedPosts from '@/app/components/post-detail/RelatedPosts';
import TableOfContents from '@/app/components/post-detail/TableOfContents';
import Tags from '@/app/components/post-detail/Tags';
import MetaInfo from '@/app/components/post-detail/MetaInfo';
import AuthorInfo from '@/app/components/post-detail/AuthorInfo';
import ContentSection from '@/app/components/post-detail/ContentSection';
import { Post } from '@/types/post';
import { Metadata } from 'next';
import { fetchPostById } from '@/lib/posts';

export async function generateMetadata(
  { params }: { params: { postId: string } }
): Promise<Metadata> {
  const { postId } = await params;
  console.log(postId)
  const { post, relatedPosts} = await fetchPostById(postId);

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    }
  }

  return {
    title: post.title,
    keywords: post.tags,

    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.postId}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

// export async function fetchPostById(id: string): Promise<{ post: Post, relatedPosts: Post[] }> {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/posts/${id}`, {});

//   if (response.status === 404) {
//     notFound();
//   }

//   if (!response.ok) {
//     throw new Error(`Failed to fetch post (status ${response.status})`);
//   }

//   const json = await response.json();
//   return json.data;
// }

interface PostDetailPageProps {
  params: { postId: string }
}

export default async function PostDetailPage({
  params
}: PostDetailPageProps) {
  const { postId } = await params;

  const { post, relatedPosts } = await fetchPostById(postId);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Simple Blog Admin", // Replace with your blog name
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png` // Replace with your logo URL
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.postId}` // Using postId as per existing type
    }
  };

  return (
    <article className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <div className="relative w-full h-[500px] mb-10">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
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
