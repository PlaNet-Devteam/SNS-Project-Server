// 통상적인 경우에는 서비스 및 트래픽이 높아질 경우를 대비해 master랑 slave(replica) 디비를 분리하는데
// 서버에서도 이것을 활용해 read operation들은 모두 슬래이브 사용하고 write operation는 master에서 진행하는 경우가 많다
// Spring Boot에서는 보통 transaction단에서 @Transactional(readOnly = true || false) 를 바라보고 적절한 dataSource를 주입시킨다.
// typeorm에서는 그러나 provider단에서 쉽게 설정할 수 있다

// ref: https://typeorm.io/multiple-data-sources

import { dataSource } from './database.config';
import { DATABASE_SOURCES } from './database.constant';

export const databaseProviders = [
  {
    provide: DATABASE_SOURCES.DATA_SOURCE, // connection풀 이름 -> 식별만 할 수 있는 이름이면 되요 ~~
    useFactory: async () => {
      dataSource;
      return dataSource.initialize();
    },
  },
];
