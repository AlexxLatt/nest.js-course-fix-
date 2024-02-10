import { IsNotEmpty } from 'class-validator';

export class CreateArticleCommentDto {
  readonly comments: string;
}
