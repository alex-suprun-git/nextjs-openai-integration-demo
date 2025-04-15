'use server';

import { revalidatePath } from 'next/cache';

export const update = async (paths: string[] = []) => paths.forEach((p) => revalidatePath(p));
