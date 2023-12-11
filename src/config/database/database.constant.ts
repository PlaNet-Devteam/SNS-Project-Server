// DATA SOURCES
export enum DATABASE_SOURCES {
  DATA_SOURCE = 'DATA_SOURCE', // MASTER DATA SOURCE
}
// REPOSITORY PROVIDERS
export enum DB_CONST_REPOSITORY {
  USER = 'USER_REPOSITORY',
  USER_HISTORY = 'USER_HISTORY_REPOSITORY',
  USER_LOGIN_HISTORY = 'USER_LOGIN_HISTORY_REPOSITORY',
  USER_BLOCK = 'USER_BLOCK_REPOSITORY',
  USER_SOCIAL = 'USER_SOCIAL_REPOSITORY',
  FEED = 'FEED_REPOSITORY',
  FEED_IMAGE = 'FEED_IMAGE_REPOSITORY',
  FEED_LIKE = 'FEED_LIKE_REPOSITORY',
  COMMENT = 'COMMENT_REPOSITORY',
  COMMENT_REPLY = 'COMMENT_REPLY_REPOSITORY',
  MAPPER_USER_FOLLOW = 'MAPPER_USER_FOLLOW_REPOSITORY',
  MAPPER_FEED_TAG = 'MAPPER_FEED_TAG_REPOSITORY',
  MAPPER_USER_ROOM = 'MAPPER_USER_ROOM_REPOSITORY',
  TAG = 'TAG_REPOSITORY',
  ROOM = 'ROOM_REPOSITORY',
  MESSAGE = 'MESSAGE_REPOSITORY',
}
