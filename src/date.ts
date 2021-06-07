import { format as formatDate } from 'date-fns';

export const toBaseFormat = (time: number): string => formatDate(time, 'dd.MM.yyyy HH:mm');
