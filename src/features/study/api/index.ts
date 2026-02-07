import { IObjects } from '@/features/study/types';

export async function getObjects(page: number): Promise<IObjects['data']> {
  const res = await fetch(`/api/objects`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch objects');
  }

  const response: IObjects = await res.json();
  return response.data;
}
