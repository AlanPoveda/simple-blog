import styled from './header.module.scss';
export default function Header() {
  return (
    <div className={styled.header}>
      <h2>spacetraveling<span style={{"color": "#FF57B2"}}>.</span></h2>
    </div>
  );
}
