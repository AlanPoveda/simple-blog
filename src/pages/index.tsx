import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
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
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  return (
    <>
      {results.map(post => (
        <div className={styles.home}>
          <h1>{post.data.title}</h1>
          <p>{post.data.subtitle}</p>
          <div className={styles.timeAndAuthor}>
            <time>{post.first_publication_date}</time>{' '}
            <span>{post.data.author}</span>
          </div>
          <p>
            <span>Carregar mais post</span>
          </p>
        </div>
      ))}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['title', 'content'],
      pageSize: 20,
    }
  );

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      results: posts,
      next_page: '10',
    },
    revalidate: 60 * 60 * 24, // 24 hrs
  };
};
