import { ArticaleEntity } from '../article.entity';

export type ArticleType = Omit<ArticaleEntity, 'updateTimestamp'>;
