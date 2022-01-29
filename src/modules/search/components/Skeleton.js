import Skeleton from '@mui/material/Skeleton';

const SearchSkeleton = () => (
  <Skeleton
    variant="rect"
    animation="wave"
    height={41}
    sx={{ bgcolor: "#c57e9e", borderRadius: 5 }}
  />
)

export default SearchSkeleton;
