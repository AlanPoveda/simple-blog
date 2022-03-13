import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  return (
    <div className={styles.content}>
      <image href="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpixy.org%2Fsrc%2F21%2F219269.jpg&f=1&nofb=1">
        image
      </image>
      <h1>title</h1>
      <div className={styles.contentInformation}>
        <time>12/02/2021</time>
        <span>Alan Poveda</span>
        <span>4 min</span>
      </div>

      <h2>SubTitel</h2>
      <p>loren alsdkjfalsd alskdjflasdk alsdj flajsdlf ajslk</p>
    </div>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
