import { useTollsContext } from '../context/TollsContext';
import { type Toll } from '../context/TollsContext';

export type { Toll };

export const useTolls = () => {
    const { tolls, loading } = useTollsContext();
    return { tolls, loading };
};