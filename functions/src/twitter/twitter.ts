import * as OAuth from "oauth";
import * as functions from "firebase-functions";
import fetch from "node-fetch";
import {
  TwitterFollowers,
  TwitterFriendship,
  TwitterTweet,
  TwitterUser} from "./types";
import {
  GET_FOLLOWERS_V2_URL,
  GET_FRIENDSHIPS_URL,
  GET_TWEET_V2_URL,
  GET_USER_V2_URL,
  twitterConfig1,
  GET_USERNAME_BY_ID_V2_URL,
  TWITTER_URL} from "./config";
import {parseHtmlString} from "./utils";
import {Firebase} from "../firebase";

const oauth = () => new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    twitterConfig1().twitterApiKey,
    twitterConfig1().twitterApiSecret,
    "1.0A",
    null,
    "HMAC-SHA1"
);

/**
 * The function will take the user names of source user and target user,
 * and will check whether the source is a validate follower of the target.
 */
export const isFollowing = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      // check in the table
      // if not call API
      return await getFriendshipsFromTwitter(data.source, data.target);
    });

/**
 * In-Progress
 * The function will take the user name of the user,
 * and pull and store all the followers for the user.
 */
export const autoCaptureFollowers = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      const user = await getUserByUsername(data.userName);

      if (user.data.public_metrics.followers_count < 5000) {
        const followers = await getFollowers(user.data.id);
        console.log(followers.data.length);
      }

      return true;
    }
);

const getUserByUsername = async function(userName: string) {
  const requestUrl = GET_USER_V2_URL + userName +
      "?user.fields=created_at,public_metrics";
  return await twitterApiCall(requestUrl) as TwitterUser;
};

const getFollowers = async function(userId: string) {
  const followerUrl = GET_FOLLOWERS_V2_URL + userId +
      "/followers?user.fields=created_at,public_metrics";
  return await twitterApiCall(followerUrl) as TwitterFollowers;
};

export const getUserById = async function(userId: string) {
  const requestUrl = GET_USERNAME_BY_ID_V2_URL + userId;
  return await twitterApiCall(requestUrl) as TwitterUser;
};

const getFriendshipsFromTwitter = async function(
    source: string,
    target: string
) {
  const requestUrl = GET_FRIENDSHIPS_URL + "?source_screen_name=" + source +
      "&target_screen_name=" + target;
  const friendships = await twitterApiCall(requestUrl) as TwitterFriendship;
  if (friendships && friendships.relationship.source.following) {
    return true;
  }

  return false;
};

/**
 * The function will take a tweet Id and a referenced tweet Id,
 * and will check whether the formmer is a retweet of the latter.
 */
export const hasRetweeted = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      try {
        return await getTweetFromTwitter(data.referencedTweetId, data.tweetId);
      } catch (e) {
        console.log("Twitter API rate exceeded. Pull data via url.");
        const url = TWITTER_URL + data.userName + "/status/" + data.tweetId;
        return await getTweetFromUrl(url, data.referencedTweetId);
      }
    });

const getTweetFromTwitter = async function(
    referencedTweetId: string,
    tweetId: string
) {
  const requestUrl = GET_TWEET_V2_URL + tweetId +
      "?expansions=referenced_tweets.id";
  const tweet = await twitterApiCall(requestUrl) as TwitterTweet;

  if (tweet && tweet.data && tweet.data.referenced_tweets &&
      tweet.data.referenced_tweets.length > 0) {
    const referenced = tweet.data.referenced_tweets
        .filter((reference) => reference.id === referencedTweetId);
    return referenced && referenced.length > 0;
  }

  return false;
};

const getTweetFromUrl = async function(retweetUrl: string,
    referencedTweetId: string) {
  const response = await fetch(retweetUrl, {
    method: "GET",
    headers: {
      "User-Agent": "GoogleBot",
    },
  });

  if (!response.ok) {
    return false;
  }

  const responseObj = await response.text();
  if (!responseObj) {
    return false;
  }

  return parseHtmlString(responseObj, referencedTweetId);
};

const twitterApiCall =
  async function(requestUrl: string) : Promise<TwitterFriendship |
      TwitterTweet | TwitterUser | TwitterFollowers> {
    return new Promise((resolve, reject) => {
      oauth().get(
          requestUrl,
          twitterConfig1().twitterAccessKey,
          twitterConfig1().twitterAccessSecret,
          (err: { statusCode: number; data?: any },
              body?: string | Buffer) => {
            if (err) {
              console.debug("Twitter API call failed: " + err.data);
              reject(err);
              return;
            }

            if (!body) {
              console.debug("Twitter API call returned empty body" +
                "with the url, " + requestUrl);
              return;
            }

            resolve(JSON.parse(body as string));
          });
    });
  };
