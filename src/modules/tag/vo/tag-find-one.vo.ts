import { YN } from 'src/common';
import { Tag } from '../tag.entity';

export class TagFindOneVo implements Partial<Tag> {
  id: number;
  tagName: string;
  searchYn?: YN;
}
