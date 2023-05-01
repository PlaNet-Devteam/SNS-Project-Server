import { DataSource } from 'typeorm';
import { Entities } from './database.entities';

export const dataSource = new DataSource({
  type: 'mysql',
  //   entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  entities: [...Entities],
  synchronize: false, // 상용에서는 절대로 true로하면 안됩니다. 데이터 다 날라가요
  replication: {
    master: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || '17828961',
      database: process.env.DB_NAME || 'ria_test',
    },
    // 여기서 여러 개의 slave를 붙일 수 있고 typeorm에서 랜덤하게 고릅니다.
    // 지금은 테스트 계정이니까 마스터랑 동일한 설정 넣음. 추후에는 레플리카가 늘면 배열을 쉽게 풀 수 있는 방식을 생각해야함
    slaves: [
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    ],
  },
});
