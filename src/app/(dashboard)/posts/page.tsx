'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import Filter from '@/app/components/filter/Filter';
import Heading1 from '@/app/components/heading/Heading1';
import Pagination from '@/app/components/Pagination';
import PostCard from '@/app/components/post-card/PostCard';
import { Post } from '@/types/post';

interface FetchPostsParams {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface FetchPostsResponse {
  data: Post[];
  totalPages: number;
}

export async function fetchPosts({
  search = '',
  sort = 'newest',
  page = 1,
  limit = 6,
}: FetchPostsParams): Promise<FetchPostsResponse> {
  const params = new URLSearchParams({
    search,
    sort,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`/api/posts?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(`Server error: Failed to fetch posts (${response.status})`);
    } else if (response.status >= 400) {
      throw new Error(`Client error: Failed to fetch posts (${response.status})`);
    } else {
      throw new Error(`Failed to fetch posts (${response.status})`);
    }
  }

  const json = await response.json();
  return {
    data: json.data,
    totalPages: json.meta?.totalPages ?? json.totalPages ?? 1,
  };
}

export default function PostsPage() {
  const t = useTranslations('PostsPage');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const initialSearchQuery = searchParams.get('search') || '';
  const initialSortBy = searchParams.get('sort') || 'newest';
  const initialCurrentPage = Number(searchParams.get('page') || 1);
  const initialPostsPerPage = Number(searchParams.get('limit') || 6);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [postsPerPage, setPostsPerPage] = useState(initialPostsPerPage);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data, totalPages } = await fetchPosts({
          search: searchQuery,
          sort: sortBy,
          page: currentPage,
          limit: postsPerPage,
        });
        setPosts(data);
        setTotalPages(totalPages);
      } catch (error: any) {
        console.error('Failed to load posts:', error.message);
        // Optionally, you could set an error state here to display a message to the user
      }
    };

    loadPosts();
  }, [searchQuery, sortBy, currentPage, postsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (postsPerPage !== 6) params.set('limit', postsPerPage.toString());

    router.replace(`/posts?${params.toString()}`);
  }, [searchQuery, sortBy, currentPage, postsPerPage, router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto py-5">
      <Heading1 title={t('allPosts')} />

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.postId} href={`/posts/${post.postId}`}>
              <PostCard post={post} />
            </Link>
          ))
        ) : (
          <div>{t('hasNoPost')}</div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
