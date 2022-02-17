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

export default function Home() {
  return (
    <div className={styles.home}>
      <Header />
      <div>
        <h1>title</h1>
        <p>subtitle</p>
        <time>Pulication time</time> <span>Alan Poveda</span>
        <p style={{"color": "#FF57B2"}}>Carregar mais post</p>
      </div>
    </div>
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

  console.log(posts);
  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24, // 24 hrs
  };
};
