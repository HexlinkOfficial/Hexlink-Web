export interface TwitterFriendship {
  relationship: TwitterRelationship
}

interface TwitterRelationship {
  source: TwitterAccountInfo,
  target: TwitterAccountInfo
}

interface TwitterAccountInfo {
  id: number,
  screen_name: string,
  following: boolean,
  followed_by: boolean,
  blocking?: boolean | null,
  blocked_by?: boolean | null
}

interface TwitterUserBase {
  name: string,
  username: string,
  created_at: string
}

export interface TwitterUser extends TwitterUserBase {
  data: {
    id: string,
    public_metrics: {
      followers_count: number
    }
  }
}

interface TwitterFollower extends TwitterUserBase {
  id: string,
  public_metrics: {
    followers_count: number
  }
}

export interface TwitterFollowers {
  data: TwitterFollower[]
}

export interface TwitterTweet {
  data: TwitterTweetData
}

interface TwitterTweetData {
  id: string,
  referenced_tweets?: TwitterReferenced[]
}

interface TwitterReferenced {
  type: string,
  id: string
}
