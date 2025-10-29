'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Filter from '@/app/components/filter/Filter';
import Heading1 from '@/app/components/heading/Heading1';
import Pagination from '@/app/components/Pagination';
import PostCard from '@/app/components/post-card/PostCard';
import { postsSeed } from '@/data/posts.seed';
import { Post } from '@/types/post';

export default function PostsPage() {
  const t = useTranslations('PostsPage');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem('posts');
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        if (Array.isArray(parsed)) {
          setPosts(parsed);
        } else {
          console.warn('Dữ liệu localStorage không hợp lệ, khởi tạo lại.');
          localStorage.setItem('posts', JSON.stringify(postsSeed));
          setPosts(postsSeed);
        }
      } else {
        localStorage.setItem('posts', JSON.stringify(postsSeed));
        setPosts(postsSeed);
      }
    } catch (error) {
      console.error('Lỗi đọc localStorage:', error);
      localStorage.removeItem('posts');
      setPosts(postsSeed);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'filterState' && e.newValue) {
        const { searchQuery, sortBy, postsPerPage } = JSON.parse(e.newValue);
        setSearchQuery(searchQuery);
        setSortBy(sortBy);
        setPostsPerPage(postsPerPage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const filterState = { searchQuery, sortBy, postsPerPage };
    localStorage.setItem('filterState', JSON.stringify(filterState));
  }, [searchQuery, sortBy, postsPerPage]);

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'likes') {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  }, [posts, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto py-5">
      <Heading1 title={t("allPosts")} />

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.length !== 0 ? (
          paginatedPosts.map((post) => (
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
