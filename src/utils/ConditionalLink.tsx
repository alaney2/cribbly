import Link from 'next/link';
import { MouseEvent, ReactNode } from 'react';
import { withRouter, NextRouter } from 'next/router';

interface ConditionalLinkProps {
  to: string;
  children: ReactNode;
  router: NextRouter;
}

const ConditionalLink: React.FC<ConditionalLinkProps> = ({ to, children, router }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (router.pathname === to) {
      e.preventDefault();
    }
  };

  return (
    <Link href={to}>
      <a onClick={handleClick}>{children}</a>
    </Link>
  );
};

export default withRouter(ConditionalLink);
