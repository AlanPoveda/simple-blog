import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { BsCalendar } from 'react-icons/bs';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function handleLoadMorePosts(): Promise<void> {
    const newPostsPagination = await fetch(nextPage).then(response =>
      response.json()
    );

    setNextPage(newPostsPagination.next_page);

    const newFormattedPosts = newPostsPagination.results.map(post => {
      return {
        ...post,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
      };
    });

    setPosts([...posts, ...newFormattedPosts]);
  }

  return (
    <>
      {posts.map(post => (
        <div className={styles.home} key={post.uid}>
          <Link href={`/post/${post.uid}`}>
            <a href={`/post/${post.uid}`}>
              <h1> {post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.timeAndAuthor}>
                <BsCalendar className={styles.icon} />
                <time>{post.first_publication_date}</time>{' '}
                <AiOutlineUser className={styles.icon} />
                <span>{post.data.author}</span>
              </div>
            </a>
          </Link>
        </div>
      ))}
      <div className={styles.home}>
        {nextPage && (
          <button type="button" onClick={handleLoadMorePosts}>
            <span>Carregar mais posts</span>
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24, // 24 hrs
  };
};
