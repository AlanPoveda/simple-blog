import Link from 'next/link';
import styled from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styled.header}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo" />
        </a>
      </Link>
      <h2>
        spacetraveling<span>.</span>
      </h2>
    </div>
  );
}
