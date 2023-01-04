import {parse} from "node-html-parser";

export const parseHtmlString = (htmlString: string, referencedId: string) => {
  const parsedHtml = parse(htmlString);

  const retweets = parsedHtml.getElementsByTagName("meta")
      .filter((meta) => meta.attributes.content === referencedId);

  return retweets && retweets.length > 0;
};
