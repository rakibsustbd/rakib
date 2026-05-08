'use client';

import { use } from 'react';
import BlogEditor from '../../../components/BlogEditor';

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <BlogEditor id={resolvedParams.id} />;
}
