create table if not exists comment
(
    id          int unsigned auto_increment comment '아이디'
        primary key,
    user_id     int unsigned                        not null comment '댓글 작성 사용자',
    feed_id     int unsigned                        not null comment '피드 아이디 - feed 테이블',
    comment     mediumtext                          not null comment '댓글',
    reply_count int       default 0                 null comment '하위 댓글 수',
    created_at  timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    updated_at  timestamp                           null on update CURRENT_TIMESTAMP comment '수정일자',
    constraint id
        unique (id)
)
    comment '댓글';

create index comment_user_id_feed_id_index
    on comment (user_id, feed_id);

create table if not exists comment_reply
(
    id         int unsigned auto_increment comment '아이디'
        primary key,
    comment_id int unsigned                        not null comment '댓글 아이디',
    user_id    int unsigned                        not null comment '사용자 아이디',
    comment    mediumtext                          not null comment '하위 댓글',
    created_at timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    updated_at timestamp                           null on update CURRENT_TIMESTAMP comment '수정일자',
    constraint id
        unique (id)
)
    comment '하위 댓글';

create index comment_reply_user_id_comment_id_index
    on comment_reply (user_id, comment_id);

create table if not exists feed
(
    id                 int unsigned auto_increment comment '아이디'
        primary key,
    user_id            int unsigned                                                     not null comment '생성한 사용자 아이디',
    description        mediumtext                                                       null comment '피드 관련 설명',
    like_count         int                                    default 0                 not null comment '좋아요 수',
    show_like_count_yn enum ('Y', 'N')                        default 'Y'               null comment '좋아요 카운트 노출 여부',
    comment_count      int                                    default 0                 not null comment '댓글 수',
    display_yn         enum ('Y', 'N')                        default 'Y'               null comment '노출 여부',
    status             enum ('ACTIVE', 'ARCHIVED', 'DELETED') default 'ACTIVE'          null comment 'ACTIVE: 피드 공개, ARCHIVED: 보관소에 저장, DELETED: 삭제',
    created_at         timestamp                              default CURRENT_TIMESTAMP null comment '생성일자',
    updated_at         timestamp                                                        null on update CURRENT_TIMESTAMP comment '수정일자',
    constraint id
        unique (id)
)
    comment '피드';

create index feed_status_index
    on feed (status);

create index feed_user_id_index
    on feed (user_id);

create table if not exists feed_image
(
    id         int unsigned auto_increment comment '아이디'
        primary key,
    feed_id    int unsigned                        not null comment '피드 아이디',
    image      varchar(50)                         not null comment '이미지 링크',
    sort_order int       default 0                 not null comment '이미지 나열 순서',
    created_at timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id)
)
    comment '피드 이미지';

create index feed_image_feed_id_index
    on feed_image (feed_id);

create table if not exists feed_like
(
    id         int unsigned auto_increment comment '아이디'
        primary key,
    feed_id    int unsigned                        not null comment '피드 아이디',
    user_id    int unsigned                        not null comment '사용자 아이디',
    created_at timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    constraint feed_like_feed_id_user_id
        unique (feed_id, user_id),
    constraint id
        unique (id)
)
    comment '피드 좋아요 기록';

create table if not exists mapper_feed_tag
(
    id         int unsigned auto_increment comment '아이디'
        primary key,
    feed_id    int unsigned                        not null comment '피드 아이디',
    tag_id     int unsigned                        not null comment '태그 아이디',
    created_at timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id)
)
    comment '피드 - 태그 매핑 테이블';

create index mft_feed_id_tag_id_index
    on mapper_feed_tag (feed_id, tag_id);

create table if not exists mapper_user_follow
(
    id           int unsigned auto_increment comment '아이디'
        primary key,
    user_id      int unsigned                        not null comment '사용자 아이디',
    following_id int unsigned                        not null comment '팔로우하는 사용자 아이디',
    created_at   timestamp default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id)
)
    comment '사용자 팔로우 기록';

create index muf_user_id_following_id_index
    on mapper_user_follow (user_id, following_id);

create table if not exists tag
(
    id         int unsigned auto_increment comment '아이디'
        primary key,
    tag_name   varchar(60)                               not null comment '태그 이름',
    search_yn  enum ('Y', 'N') default 'Y'               null comment '검색 가능 여부',
    created_at timestamp       default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id),
    constraint tag_name
        unique (tag_name),
    constraint tag_name_min_length
        check ((`tag_name` is null) or (length(`tag_name`) > 1))
)
    comment '태그';

create index tag_name_search_yn_index
    on tag (tag_name, search_yn);

create table if not exists user
(
    id              int unsigned auto_increment comment '아이디'
        primary key,
    email           varchar(55)                                                             not null comment '사용자 이메일',
    profile_image   varchar(100)                                                            null comment '프로필 이미지 링크',
    username        varchar(25)                                                             not null comment '사용자명',
    nickname        varchar(25)                                                             null comment '닉네임',
    password        varchar(250)                                                            not null comment '비밀번호',
    status          enum ('ACTIVE', 'INACTIVE')                   default 'ACTIVE'          null comment '사용자 상태 - ACTIVE: 사용 중, INACTIVE: 휴면, 비활성',
    bio             mediumtext                                                              null comment '소개글',
    gender          enum ('MALE', 'FEMALE', 'OTHER', 'NO_ANSWER') default 'NO_ANSWER'       null comment '성별 - MALE: 남, FEMALE: 여, OTHER: 기타, NO_ANSWER: 답 없음(기본)',
    following_count int                                           default 0                 null comment '팔로잉 사용자 수',
    feed_count      int                                           default 0                 null comment '피드 수',
    follower_count  int                                           default 0                 null comment '팔로워 사용자 수',
    last_login_at   timestamp                                                               null comment '마지막 로그인 날짜',
    inactive_at     timestamp                                                               null comment '비활성 날짜',
    created_at      timestamp                                     default CURRENT_TIMESTAMP null comment '생성일자',
    updated_at      timestamp                                                               null on update CURRENT_TIMESTAMP comment '수정일자',
    constraint email
        unique (email),
    constraint id
        unique (id),
    constraint username
        unique (username)
)
    comment '사용자';

create table if not exists user_block
(
    id              int unsigned auto_increment comment '아이디'
        primary key,
    user_id         int unsigned                                          not null comment '사용자 아이디',
    blocked_user_id int unsigned                                          not null comment '차단한 사용자 아이디',
    action_type     enum ('BLOCKER', 'BLOCKED') default 'BLOCKER'         not null comment 'BLOCKER: 차단하는 사람, BLOCKED: 차단 당한 사람',
    created_at      timestamp                   default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id),
    constraint user_block_user_id_block_id_action_index
        unique (user_id, blocked_user_id, action_type)
)
    comment '사용자 차단 목록';

create table if not exists user_history
(
    id            int unsigned auto_increment comment '아이디'
        primary key,
    user_id       int                                                                     not null comment '사용자 아이디',
    email         varchar(55)                                                             not null comment '사용자 이메일',
    profile_image varchar(100)                                                            null comment '프로필 이미지 링크',
    username      varchar(25)                                                             not null comment '사용자명',
    nickname      varchar(25)                                                             null comment '닉네임',
    status        enum ('ACTIVE', 'INACTIVE')                   default 'ACTIVE'          null comment '사용자 상태 - ACTIVE: 사용 중, INACTIVE: 휴면, 비활성',
    bio           mediumtext                                                              null comment '소개글',
    gender        enum ('MALE', 'FEMALE', 'OTHER', 'NO_ANSWER') default 'NO_ANSWER'       null comment '성별 - MALE: 남, FEMALE: 여, OTHER: 기타, NO_ANSWER: 답 없음(기본)',
    created_at    timestamp                                     default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id)
)
    comment '사용자 수정 기록';

create index user_history_user_id_index
    on user_history (user_id);

create table if not exists user_login_history
(
    id          int unsigned auto_increment comment '아이디'
        primary key,
    user_id     int unsigned                                       not null comment '사용자 아이디',
    device_id   varchar(20)                                        null comment '디바이스 아이디',
    action_type enum ('LOGIN', 'LOGOUT') default 'LOGIN'           null comment '로그인/로그아웃 여부',
    created_at  timestamp                default CURRENT_TIMESTAMP null comment '생성일자',
    constraint id
        unique (id)
)
    comment '사용자 로그인 기록';

create table if not exists user_social
(
    id               int unsigned auto_increment comment '아이디'
        primary key,
    user_id          int unsigned                                  not null comment '사용자 아이디 - user 테이블',
    email            varchar(55)                                   not null comment '이메일',
    social_type      enum ('GOOGLE', 'KAKAO', 'FACEBOOK', 'NAVER') not null comment '소셜 로그인 종류',
    social_unique_id varchar(100)                                  null comment '소셜 계정 유니크 아이디',
    created_at       timestamp default CURRENT_TIMESTAMP           null comment '생성일자',
    updated_at       timestamp                                     null on update CURRENT_TIMESTAMP comment '수정일자',
    constraint id
        unique (id),
    constraint user_social_email_user_id_social_type_uindex
        unique (email, user_id, social_type)
)
    comment '사용자 소셜 계정 정보';

create index user_social_social_unique_id_social_type_index
    on user_social (social_unique_id, social_type);
