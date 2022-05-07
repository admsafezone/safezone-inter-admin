import { FC, memo } from 'react';

interface OneRankingItemProps {
  name: string;
  score: number;
  position: number;
}

const OneRankingItem: FC<OneRankingItemProps> = ({ position, name, score }: OneRankingItemProps) => {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid',
        borderBottomColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <span>
        {position}º - {name}
      </span>
      <small>{score}</small>
    </div>
  );
};

export default memo(OneRankingItem);
