import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Helper function to get relative time from a timestamp
export const TIME_AGO = (timestamp) => {
    return dayjs(timestamp).fromNow();
};

