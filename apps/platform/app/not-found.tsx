import NotFound from '@/components/NotFound';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found',
};

const PageNotFound = () => <NotFound link="/" homepage />;

export default PageNotFound;
