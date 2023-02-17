import * as functions from "firebase-functions";

export const GET_FOLLOWERS_V2_URL = "https://api.twitter.com/2/users/";
export const GET_FRIENDSHIPS_URL = "https://api.twitter.com/1.1/friendships/show.json";
export const GET_USER_V2_URL = "https://api.twitter.com/2/users/by/username/";
export const GET_TWEET_V2_URL = "https://api.twitter.com/2/tweets/";
export const TWITTER_URL = "https://twitter.com/";

const secrets = functions.config().doppler;
export const twitterConfig1 = () => ({
  twitterApiKey: secrets.TWITTER_API_KEY_1,
  twitterApiSecret: secrets.TWITTER_API_SECRET_1,
  twitterAccessKey: secrets.TWITTER_ACCESS_KEY_1,
  twitterAccessSecret: secrets.TWITTER_ACCESS_SECRET_1,
});
